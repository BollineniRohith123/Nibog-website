import type { NextApiRequest, NextApiResponse } from 'next'
import { auth } from '@clerk/nextjs/server'
import { 
  getEventDetails, 
  updateEventStatus 
} from '../../../lib/event-utils'
import { prisma } from '../../../lib/db'

enum EventStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED'
}

enum UserRole {
  ADMIN = 'ADMIN',
  PARENT = 'PARENT',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  const { 
    query: { id }, 
    method 
  } = req

  const { userId } = auth()

  // Basic authentication check
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Check user role for admin operations
  const userProfile = await prisma.userProfile.findUnique({
    where: { clerkId: userId }
  })

  const isAdmin = userProfile?.role === UserRole.ADMIN || 
                  userProfile?.role === UserRole.SUPER_ADMIN

  // Validate id
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Invalid event ID' })
  }

  const idNum = parseInt(id as string, 10)

  switch (method) {
    case 'GET':
      try {
        const event = await getEventDetails(idNum)
        
        if (!event) {
          return res.status(404).json({ error: 'Event not found' })
        }

        return res.status(200).json(event)
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch event details' })
      }

    case 'PUT':
      // Only admins can update event status
      if (!isAdmin) {
        return res.status(403).json({ error: 'Insufficient permissions' })
      }

      try {
        const { status } = req.body

        // Validate status
        if (!Object.values(EventStatus).includes(status)) {
          return res.status(400).json({ error: 'Invalid event status' })
        }

        const updatedEvent = await updateEventStatus(
          idNum, 
          status as EventStatus
        )

        return res.status(200).json(updatedEvent)
      } catch (error) {
        return res.status(400).json({ error: 'Failed to update event status' })
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}
