import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { requireAdminAuth } from '../../../utils/adminAuth';

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const games = await prisma.game.findMany({
          include: {
            _count: {
              select: { 
                events: true 
              }
            }
          },
          orderBy: {
            name: 'asc'
          }
        });
        res.status(200).json(games);
      } catch (error) {
        console.error('Fetch games error:', error);
        res.status(500).json({ 
          error: 'Unable to fetch games', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
      break;

    case 'POST':
      try {
        const { 
          name, 
          description, 
          minAge, 
          maxAge, 
          imageUrl, 
          videoLink,
          maxParticipants
        } = req.body;

        // Validate input
        if (!name || minAge === undefined || maxAge === undefined) {
          return res.status(400).json({ error: 'Name, minimum age, and maximum age are required' });
        }

        if (minAge > maxAge) {
          return res.status(400).json({ error: 'Minimum age cannot be greater than maximum age' });
        }

        const newGame = await prisma.game.create({
          data: {
            name: String(name),
            description: String(description)
          }
        });

        res.status(201).json(newGame);
      } catch (error) {
        console.error('Create game error:', error);
        res.status(500).json({ 
          error: 'Unable to create game', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
      break;

    case 'PUT':
      try {
        const { 
          id,
          name, 
          description, 
          minAge, 
          maxAge, 
          imageUrl, 
          videoLink,
          maxParticipants
        } = req.body;

        // Validate input
        if (!id) {
          return res.status(400).json({ error: 'Game ID is required' });
        }

        if (minAge > maxAge) {
          return res.status(400).json({ error: 'Minimum age cannot be greater than maximum age' });
        }

        const updatedGame = await prisma.game.update({
          where: { id: Number(id) },
          data: {
            name: String(name),
            description: String(description)
          }
        });

        res.status(200).json(updatedGame);
      } catch (error) {
        console.error('Update game error:', error);
        res.status(500).json({ 
          error: 'Unable to update game', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default requireAdminAuth(handler);
