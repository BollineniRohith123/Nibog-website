import type { NextApiRequest, NextApiResponse } from 'next'
import { auth } from '@clerk/nextjs/server'
import { 
  createRegistration, 
  getUserRegistrations 
} from '../../../lib/registration-utils'
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
  const { userId } = auth()

  // Basic authentication check
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Check user role
  const userProfile = await prisma.userProfile.findUnique({
    where: { clerkId: userId }
  })

  const isAdmin = userProfile?.role === UserRole.ADMIN || 
                  userProfile?.role === UserRole.SUPER_ADMIN

  switch (method) {
    case 'GET':
      try {
        // If admin, allow fetching all registrations
        // If user, fetch only their own registrations
        const registrations = isAdmin 
          ? await prisma.registration.findMany({
              include: { 
                event: true
              }
            })
          : await getUserRegistrations(userId)

        return res.status(200).json(registrations)
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch registrations' })
      }

    case 'POST':
      try {
        const registrationData = {
          ...req.body,
          userId: userId
        }

        // Validate required fields
        const requiredFields = [
          'childName', 
          'childAge', 
          'parentName', 
          'contactInfo', 
          'email', 
          'phoneNumber', 
          'eventId', 
          'gameId'
        ]

        for (const field of requiredFields) {
          if (!registrationData[field]) {
            return res.status(400).json({ 
              error: `Missing required field: ${field}` 
            })
          }
        }

        const newRegistration = await createRegistration(registrationData)

        return res.status(201).json(newRegistration)
      } catch (error) {
        return res.status(400).json({ 
          error: error instanceof Error ? error.message : 'Registration failed' 
        })
      }

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}
