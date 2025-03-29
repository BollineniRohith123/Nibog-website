import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { requireAdminAuth } from '../../../../utils/adminAuth';

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      // Check if city exists and has no events
      const existingCity = await prisma.city.findUnique({
        where: { id: Number(id) },
        include: {
          _count: {
            select: { events: true }
          }
        }
      });

      if (!existingCity) {
        return res.status(404).json({ error: 'City not found' });
      }

      if (existingCity._count.events > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete city with existing events',
          details: 'Please remove or reassign events first.'
        });
      }

      // Delete the city
      await prisma.city.delete({
        where: { id: Number(id) }
      });

      res.status(200).json({ message: 'City deleted successfully' });
    } catch (error) {
      console.error('Delete city error:', error);
      res.status(500).json({ 
        error: 'Unable to delete city', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default requireAdminAuth(handler);
