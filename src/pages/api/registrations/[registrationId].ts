import type { NextApiRequest, NextApiResponse } from 'next'
import { auth } from '@clerk/nextjs/server'
import { 
  cancelRegistration 
} from '../../../lib/registration-utils'
import { prisma } from '../../../lib/db'

enum UserRole {
  ADMIN = 'ADMIN',
  PARENT = 'PARENT',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

enum RegistrationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  PAID = 'PAID'
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  const { 
    query: { registrationId }, 
    method 
  } = req

  const { userId } = auth()

  // Basic authentication check
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Check user role and ownership
  const userProfile = await prisma.userProfile.findUnique({
    where: { clerkId: userId }
  })

  const isAdmin = userProfile?.role === UserRole.ADMIN || 
                  userProfile?.role === UserRole.SUPER_ADMIN

  // Validate registrationId
  if (!registrationId || Array.isArray(registrationId)) {
    return res.status(400).json({ error: 'Invalid registration ID' })
  }

  const registrationIdNum = parseInt(registrationId as string, 10)

  // Verify registration ownership or admin access
  const registration = await prisma.registration.findUnique({
    where: { id: registrationIdNum }
  })

  if (!registration) {
    return res.status(404).json({ error: 'Registration not found' })
  }

  const isOwner = registration.userId === userId

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: 'Access denied' })
  }

  switch (method) {
    case 'GET':
      try {
        const registrationDetails = await prisma.registration.findUnique({
          where: { id: registrationIdNum },
          include: {
            event: { include: { city: true } }
          }
        })

        return res.status(200).json(registrationDetails)
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch registration details' })
      }

    case 'PUT':
      try {
        const { status } = req.body

        // Only allow cancellation for pending registrations
        if (status !== RegistrationStatus.CANCELLED) {
          return res.status(400).json({ 
            error: 'Only cancellation is allowed through this endpoint' 
          })
        }

        // Check if registration is already paid
        if (registration.status === RegistrationStatus.PAID) {
          return res.status(400).json({ 
            error: 'Cannot cancel a paid registration' 
          })
        }

        const cancelledRegistration = await cancelRegistration(registrationIdNum)

        return res.status(200).json(cancelledRegistration)
      } catch (error) {
        return res.status(400).json({ 
          error: error instanceof Error ? error.message : 'Registration update failed' 
        })
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}
