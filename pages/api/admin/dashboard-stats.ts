import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { requireAdminAuth } from '../../../utils/adminAuth';

const prisma = new PrismaClient();

type Registration = {
  id: string;
  userId: string;
  createdAt: Date;
  event: {
    name: string;
    date: Date;
  }
}

type FormattedRegistration = {
  id: string;
  userId: string;
  eventName: string;
  startDate: string;
  registrationDate: string;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Total Events
      const totalEvents = await prisma.event.count();

      // Total Registrations
      const totalRegistrations = await prisma.registration.count();

      // Upcoming Events
      const upcomingEvents = await prisma.event.count({
        where: {
          date: {
            gt: new Date()
          },
          status: 'UPCOMING'
        }
      });

      // Recent Registrations
      const recentRegistrations: Registration[] = await prisma.registration.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          id: true,
          userId: true,
          event: {
            select: {
              name: true,
              date: true
            }
          },
          createdAt: true
        }
      });

      // Transform recent registrations
      const formattedRecentRegistrations: FormattedRegistration[] = recentRegistrations.map(reg => ({
        id: reg.id,
        userId: reg.userId,
        eventName: reg.event.name,
        startDate: reg.event.date.toISOString(),
        registrationDate: reg.createdAt.toISOString()
      }));

      res.status(200).json({
        totalEvents,
        totalRegistrations,
        upcomingEvents,
        recentRegistrations: formattedRecentRegistrations
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      res.status(500).json({ 
        error: 'Unable to fetch dashboard statistics', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default requireAdminAuth(handler);
