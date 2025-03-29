import type { NextApiRequest, NextApiResponse } from 'next'
import { auth } from '@clerk/nextjs/server'
import { 
  getUpcomingEvents, 
  createEvent, 
  getEventDetails 
} from '../../../lib/event-utils'
import { prisma } from '../../../lib/db'

enum UserRole {
  ADMIN = 'ADMIN',
  PARENT = 'PARENT',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  const { method } = req
  const { userId, orgRole } = auth()

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

  switch (method) {
    case 'GET':
      try {
        const { page = 1, pageSize = 10, cityId } = req.query
        const events = await getUpcomingEvents(
          Number(page), 
          Number(pageSize), 
          cityId ? Number(cityId) : undefined
        )
        return res.status(200).json(events)
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch events' })
      }

    case 'POST':
      // Only admins can create events
      if (!isAdmin) {
        return res.status(403).json({ error: 'Insufficient permissions' })
      }

      try {
        const eventData = req.body
        const newEvent = await createEvent(eventData)
        return res.status(201).json(newEvent)
      } catch (error) {
        return res.status(400).json({ error: 'Failed to create event' })
      }

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}
