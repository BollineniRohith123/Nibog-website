import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { withAuth } from '@clerk/nextjs/api';
import axios from 'axios';

const prisma = new PrismaClient();

// Simulated PhonePe Payment Gateway Integration
// Note: Replace with actual PhonePe SDK/API in production
async function initiatePhonePePayment(
  amount: number, 
  registrationId: number, 
  merchantId: string
) {
  try {
    // Simulate PhonePe payment initiation
    const paymentResponse = {
      transactionId: `NIBOG-${Date.now()}`,
      status: 'INITIATED',
      redirectUrl: `https://phonepay.com/pay/${registrationId}`
    };

    return paymentResponse;
  } catch (error) {
    console.error('Payment initiation error:', error);
    throw new Error('Payment initiation failed');
  }
}

async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { 
        registrationId, 
        amount, 
        userId 
      } = req.body;

      // Validate registration
      const registration = await prisma.registration.findUnique({
        where: { id: registrationId },
        include: { event: true }
      });

      if (!registration) {
        return res.status(404).json({ error: 'Registration not found' });
      }

      // Check if registration is already paid
      if (registration.status === 'PAID') {
        return res.status(400).json({ error: 'Registration already paid' });
      }

      // Retrieve merchant details from environment
      const merchantId = process.env.PHONEPE_MERCHANT_ID;
      const saltKey = process.env.PHONEPE_SALT_KEY;

      if (!merchantId || !saltKey) {
        return res.status(500).json({ error: 'Payment gateway configuration missing' });
      }

      // Initiate payment
      const paymentResponse = await initiatePhonePePayment(
        amount, 
        registrationId, 
        merchantId
      );

      // Create payment transaction record
      const paymentTransaction = await prisma.paymentTransaction.create({
        data: {
          registrationId: registration.id,
          amount: amount,
          transactionId: paymentResponse.transactionId,
          status: paymentResponse.status,
          paymentMethod: 'PhonePe',
          gatewayResponse: JSON.parse(JSON.stringify(paymentResponse))
        }
      });

      // Update registration status
      await prisma.registration.update({
        where: { id: registrationId },
        data: { status: 'PENDING' }
      });

      res.status(200).json({
        message: 'Payment initiated',
        paymentDetails: {
          transactionId: paymentTransaction.transactionId,
          redirectUrl: paymentResponse.redirectUrl
        }
      });
    } catch (error) {
      console.error('Payment processing error:', error);
      res.status(500).json({ 
        error: 'Payment processing failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else if (req.method === 'GET') {
    try {
      const { transactionId, registrationId } = req.query;

      // Fetch payment transaction
      const paymentTransaction = await prisma.paymentTransaction.findFirst({
        where: {
          ...(transactionId ? { transactionId: String(transactionId) } : {}),
          ...(registrationId ? { registrationId: Number(registrationId) } : {})
        },
        include: {
          registration: {
            include: {
              event: true,
              userProfile: true
            }
          }
        }
      });

      if (!paymentTransaction) {
        return res.status(404).json({ error: 'Payment transaction not found' });
      }

      res.status(200).json(paymentTransaction);
    } catch (error) {
      console.error('Payment retrieval error:', error);
      res.status(500).json({ 
        error: 'Unable to retrieve payment details', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withAuth(handler);
