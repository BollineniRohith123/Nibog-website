import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { requireAdminAuth } from '../../../../utils/adminAuth';

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      // Check if game exists and has no registrations or events
      const existingGame = await prisma.game.findUnique({
        where: { id: Number(id) },
        include: {
          _count: {
            select: { 
              events: true
            }
          }
        }
      });

      if (!existingGame) {
        return res.status(404).json({ error: 'Game not found' });
      }

      if (existingGame._count.events > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete game with existing events',
          details: 'Please remove or reassign events first.'
        });
      }

      // Delete the game
      await prisma.game.delete({
        where: { id: Number(id) }
      });

      res.status(200).json({ message: 'Game deleted successfully' });
    } catch (error) {
      console.error('Delete game error:', error);
      res.status(500).json({ 
        error: 'Unable to delete game', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default requireAdminAuth(handler);
