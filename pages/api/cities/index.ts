import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { withAuth } from '@clerk/nextjs/api';

const prisma = new PrismaClient();

async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { 
        search, 
        page = 1, 
        limit = 10 
      } = req.query;

      const pageNum = Number(page);
      const limitNum = Number(limit);
      const offset = (pageNum - 1) * limitNum;

      // Construct dynamic filtering
      const whereCondition: any = {};

      // Search filtering
      if (search) {
        whereCondition.OR = [
          { 
            name: { 
              contains: String(search), 
              mode: 'insensitive' 
            } 
          },
          { 
            description: { 
              contains: String(search), 
              mode: 'insensitive' 
            } 
          }
        ];
      }

      // Fetch cities with pagination and event count
      const cities = await prisma.city.findMany({
        where: whereCondition,
        take: limitNum,
        skip: offset,
        include: {
          _count: {
            select: { events: true }
          }
        }
      });

      return res.status(200).json(cities);
    } catch (error) {
      console.error('Error fetching cities:', error);
      res.status(500).json({ 
        error: 'Unable to fetch cities', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { userId, userRole } = req.body;
      
      // Only allow admin users to create cities
      if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Unauthorized: Admin access required' });
      }

      const cityData = req.body.cityData;

      // Validate city data
      if (!cityData.name) {
        return res.status(400).json({ error: 'City name is required' });
      }

      // Check if city already exists
      const existingCity = await prisma.city.findUnique({
        where: { name: cityData.name }
      });

      if (existingCity) {
        return res.status(409).json({ error: 'City already exists' });
      }

      const newCity = await prisma.city.create({
        data: {
          name: cityData.name,
          description: cityData.description,
          imageUrl: cityData.imageUrl
        }
      });

      res.status(201).json(newCity);
    } catch (error) {
      console.error('Error creating city:', error);
      res.status(500).json({ 
        error: 'Unable to create city', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const { userId, userRole } = req.body;
      
      // Only allow admin users to update cities
      if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Unauthorized: Admin access required' });
      }

      const { cityId, cityData } = req.body;

      if (!cityId) {
        return res.status(400).json({ error: 'City ID is required' });
      }

      const updatedCity = await prisma.city.update({
        where: { id: cityId },
        data: {
          name: cityData.name,
          description: cityData.description,
          imageUrl: cityData.imageUrl
        }
      });

      res.status(200).json(updatedCity);
    } catch (error) {
      console.error('Error updating city:', error);
      res.status(500).json({ 
        error: 'Unable to update city', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withAuth(handler);
