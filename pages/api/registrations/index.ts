import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';
import nodemailer from 'nodemailer';

// Ensure a single Prisma client instance
const prisma = new PrismaClient();

// Email sending function with improved error handling
async function sendConfirmationEmail(registration: any) {
  try {
    // Validate email configuration
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email configuration is incomplete');
      return;
    }

    // Create a transporter using SMTP
    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Nibog Events" <events@nibog.com>',
      to: registration.contactEmail,
      subject: 'Event Registration Confirmation',
      text: `
        Dear ${registration.parentName},

        Your child ${registration.childName} has been successfully registered for the event.

        Event Details:
        - Event ID: ${registration.eventId}
        - Child Name: ${registration.childName}
        - Child Age: ${registration.childAge}

        Thank you for registering with Nibog!
      `,
      html: `
        <h1>Event Registration Confirmation</h1>
        <p>Dear ${registration.parentName},</p>
        <p>Your child ${registration.childName} has been successfully registered for the event.</p>
        <h2>Event Details:</h2>
        <ul>
          <li>Event ID: ${registration.eventId}</li>
          <li>Child Name: ${registration.childName}</li>
          <li>Child Age: ${registration.childAge}</li>
        </ul>
        <p>Thank you for registering with Nibog!</p>
      `
    });

    console.log('Confirmation email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Global error handling
  try {
    // Logging for debugging
    console.log('Received request method:', req.method);
    console.log('Request query:', req.query);
    console.log('Request body:', req.body);

    // GET method to retrieve registrations
    if (req.method === 'GET') {
      try {
        // Authentication check
        const { userId } = getAuth(req);
        if (!userId) {
          return res.status(401).json({ error: 'Unauthorized: Login required' });
        }

        // Fetch user's registrations
        const registrations = await prisma.registration.findMany({
          where: { 
            userId: userId
          },
          include: {
            event: {
              include: {
                city: true,
                game: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });

        return res.status(200).json(registrations);
      } catch (fetchError) {
        console.error('Registration fetch error:', fetchError);
        return res.status(500).json({ 
          error: 'Unable to fetch registrations', 
          details: fetchError instanceof Error ? fetchError.message : 'Unknown error' 
        });
      }
    } 
    
    // POST method to create registration
    else if (req.method === 'POST') {
      try {
        // Authentication check
        const { userId } = getAuth(req);
        if (!userId) {
          return res.status(401).json({ error: 'Unauthorized: Login required' });
        }

        // Validate input data
        const { 
          eventId, 
          childName, 
          childAge, 
          parentName, 
          contactEmail, 
          contactPhone,
          gameId
        } = req.body;

        // Validate required fields
        if (!childName || !childAge || !eventId || !parentName || !contactEmail) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate event and game
        const event = await prisma.event.findUnique({
          where: { id: eventId },
          include: { 
            game: true,
            _count: { 
              select: { registrations: true } 
            } 
          }
        });

        if (!event) {
          return res.status(404).json({ error: 'Event not found' });
        }

        // Check event capacity
        if (event.maxParticipants && event._count.registrations >= event.maxParticipants) {
          return res.status(400).json({ error: 'Event is already at full capacity' });
        }

        // Create registration
        const registration = await prisma.registration.create({
          data: {
            userId: userId,
            eventId: eventId,
            status: 'PENDING',
            paymentStatus: false
          }
        });

        // Send confirmation email (optional)
        await sendConfirmationEmail({
          parentName,
          childName,
          childAge,
          eventId,
          contactEmail
        });

        return res.status(201).json({ 
          message: 'Registration successful', 
          registrationId: registration.id 
        });
      } catch (createError) {
        console.error('Registration creation error:', createError);
        return res.status(500).json({ 
          error: 'Unable to complete registration', 
          details: createError instanceof Error ? createError.message : 'Unknown error' 
        });
      }
    } 
    
    // Unsupported method
    else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (globalError) {
    console.error('Global error handler:', globalError);
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      details: globalError instanceof Error ? globalError.message : 'Unknown error' 
    });
  }
}

// Ensure body parser is configured correctly
export const config = {
  api: {
    bodyParser: true,
  },
};
