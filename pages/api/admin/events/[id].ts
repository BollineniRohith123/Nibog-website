import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { requireAdminAuth } from '../../../../utils/adminAuth';

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      // Check if event exists and has no registrations
      const existingEvent = await prisma.event.findUnique({
        where: { id: Number(id) },
        include: {
          _count: {
            select: { registrations: true }
          }
        }
      });

      if (!existingEvent) {
        return res.status(404).json({ error: 'Event not found' });
      }

      if (existingEvent._count.registrations > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete event with existing registrations',
          details: 'Please cancel or modify existing registrations first.'
        });
      }

      // Delete the event
      await prisma.event.delete({
        where: { id: Number(id) }
      });

      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Delete event error:', error);
      res.status(500).json({ 
        error: 'Unable to delete event', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default requireAdminAuth(handler);
