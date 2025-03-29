import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { requireAdminAuth } from '../../../utils/adminAuth';

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const cities = await prisma.city.findMany({
          include: {
            _count: {
              select: { events: true }
            }
          },
          orderBy: {
            name: 'asc'
          }
        });
        res.status(200).json(cities);
      } catch (error) {
        console.error('Fetch cities error:', error);
        res.status(500).json({ 
          error: 'Unable to fetch cities', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
      break;

    case 'POST':
      try {
        const { 
          name, 
          description, 
          imageUrl 
        } = req.body;

        // Validate input
        if (!name) {
          return res.status(400).json({ error: 'City name is required' });
        }

        const newCity = await prisma.city.create({
          data: {
            name,
            description,
            imageUrl
          }
        });

        res.status(201).json(newCity);
      } catch (error) {
        console.error('Create city error:', error);
        res.status(500).json({ 
          error: 'Unable to create city', 
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
          imageUrl 
        } = req.body;

        // Validate input
        if (!id) {
          return res.status(400).json({ error: 'City ID is required' });
        }

        const updatedCity = await prisma.city.update({
          where: { id: Number(id) },
          data: {
            name,
            description,
            imageUrl
          }
        });

        res.status(200).json(updatedCity);
      } catch (error) {
        console.error('Update city error:', error);
        res.status(500).json({ 
          error: 'Unable to update city', 
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
