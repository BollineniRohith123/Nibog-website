import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '@clerk/nextjs/server'
import { prisma } from '../../lib/db'

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  const { method } = req
  const { userId } = getAuth(req)

  // Ensure user is authenticated
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    switch (method) {
      case 'GET':
        // Fetch registrations for the authenticated user
        const registrations = await prisma.registration.findMany({
          where: { 
            userId: userId 
          },
          include: {
            event: {
              include: {
                city: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        })

        return res.status(200).json(registrations)

      case 'DELETE':
        // Get registration ID from query or body
        const registrationId = req.query.id || req.body.id

        if (!registrationId) {
          return res.status(400).json({ error: 'Registration ID is required' })
        }

        // Delete the specific registration
        const deletedRegistration = await prisma.registration.delete({
          where: { 
            id: String(registrationId),
            userId: userId 
          }
        })

        return res.status(200).json(deletedRegistration)

      default:
        res.setHeader('Allow', ['GET', 'DELETE'])
        return res.status(405).end(`Method ${method} Not Allowed`)
    }
  } catch (error) {
    console.error('Registration API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
