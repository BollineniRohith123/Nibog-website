import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { requireAdminAuth } from '../../../utils/adminAuth';

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const events = await prisma.event.findMany({
          orderBy: {
            date: 'desc'
          },
          include: {
            city: true,
            _count: {
              select: { registrations: true }
            }
          }
        });
        res.status(200).json(events);
      } catch (error) {
        console.error('Fetch events error:', error);
        res.status(500).json({ 
          error: 'Unable to fetch events', 
          details: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
      break;

    case 'POST':
      try {
        const { 
          name, 
          description, 
          date, 
          time, 
          location, 
          cityId, 
          maxCapacity, 
          price, 
          gameId 
        } = req.body;

        const eventData = {
          name: String(name),
          description: String(description),
          date: new Date(date),
          time: String(time),
          location: String(location),
          cityId: Number(cityId),
          gameId: Number(gameId),
          registrationFee: Number(price) || 0,
          status: 'UPCOMING' as const,
          maxParticipants: Number(maxCapacity) || 100
        };

        const newEvent = await prisma.event.create({
          data: eventData
        });

        res.status(201).json(newEvent);
      } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ 
          error: 'Unable to create event', 
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
          date, 
          time, 
          location, 
          cityId, 
          maxCapacity, 
          price, 
          gameId, 
          status 
        } = req.body;

        if (!id) {
          return res.status(400).json({ error: 'Event ID is required' });
        }

        const updateEventData = {
          name: String(name),
          description: String(description),
          date: new Date(date),
          time: String(time),
          location: String(location),
          cityId: Number(cityId),
          gameId: Number(gameId),
          registrationFee: Number(price) || 0,
          status: 'UPCOMING' as const,
          maxParticipants: Number(maxCapacity) || 100
        };

        const updatedEvent = await prisma.event.update({
          where: { id: Number(id) },
          data: updateEventData
        });

        res.status(200).json(updatedEvent);
      } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({ 
          error: 'Unable to update event', 
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
