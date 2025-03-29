import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';

// Ensure a single Prisma client instance
const prisma = new PrismaClient();

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

    // GET method to list events
    if (req.method === 'GET') {
      try {
        // Flexible query parameters
        const { 
          city, 
          date, 
          status = 'UPCOMING',
          page = '1',
          limit = '10' 
        } = req.query;
        
        // Parse pagination
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const offset = (pageNum - 1) * limitNum;

        // Dynamic filtering
        const whereCondition: any = {
          status: status ? { equals: status as string } : undefined,
        };

        // Optional city filtering
        if (city) {
          whereCondition.city = { 
            name: { contains: city as string, mode: 'insensitive' } 
          };
        }

        // Optional date filtering
        if (date) {
          whereCondition.date = {
            gte: new Date(date as string),
            lt: new Date(new Date(date as string).setDate(new Date(date as string).getDate() + 1))
          };
        }

        // Fetch events with pagination
        const events = await prisma.event.findMany({
          where: whereCondition,
          include: {
            city: true,
            game: true,
            _count: {
              select: { registrations: true }
            }
          },
          take: limitNum,
          skip: offset,
          orderBy: {
            date: 'asc'
          }
        });

        // Count total events
        const totalEvents = await prisma.event.count({ where: whereCondition });

        return res.status(200).json({
          events,
          pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(totalEvents / limitNum),
            totalEvents,
            eventsPerPage: limitNum
          }
        });
      } catch (fetchError) {
        console.error('Event fetch error:', fetchError);
        return res.status(500).json({ 
          error: 'Unable to fetch events', 
          details: fetchError instanceof Error ? fetchError.message : 'Unknown error' 
        });
      }
    } 
    
    // POST method to create event (admin only)
    else if (req.method === 'POST') {
      try {
        // Authentication check
        const { userId } = getAuth(req);
        if (!userId) {
          return res.status(401).json({ error: 'Unauthorized: Login required' });
        }

        // Validate admin role
        const adminUser = await prisma.user.findUnique({
          where: { clerkUserId: userId }
        });

        if (!adminUser || !['ADMIN', 'SUPER_ADMIN'].includes(adminUser.role)) {
          return res.status(403).json({ error: 'Unauthorized: Admin access required' });
        }

        // Validate event data
        const eventData = req.body;
        if (!eventData || Object.keys(eventData).length === 0) {
          return res.status(400).json({ error: 'Event data is required' });
        }

        // Create event
        const newEvent = await prisma.event.create({
          data: {
            ...eventData,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });

        return res.status(201).json(newEvent);
      } catch (createError) {
        console.error('Event creation error:', createError);
        return res.status(500).json({ 
          error: 'Unable to create event', 
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
