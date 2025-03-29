import type { NextApiRequest, NextApiResponse } from 'next'
import { auth } from '@clerk/nextjs/server'
import { 
  initiatePhonePePayment, 
  processPaymentCallback,
  refundPayment
} from '../../../lib/payment-utils'
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
    case 'POST':
      try {
        const { registrationId, amount } = req.body

        // Validate registration
        const registration = await prisma.registration.findUnique({
          where: { id: registrationId },
          include: { event: true }
        })

        if (!registration) {
          return res.status(404).json({ error: 'Registration not found' })
        }

        // Verify ownership or admin access
        if (registration.userId !== userId && !isAdmin) {
          return res.status(403).json({ error: 'Access denied' })
        }

        // Verify amount matches event price
        if (amount !== registration.event?.price) {
          return res.status(400).json({ error: 'Invalid payment amount' })
        }

        // Initiate PhonePe payment
        const paymentInitiation = await initiatePhonePePayment(
          registrationId, 
          amount
        )

        return res.status(200).json(paymentInitiation)
      } catch (error) {
        return res.status(500).json({ 
          error: error instanceof Error ? error.message : 'Payment initiation failed' 
        })
      }

    case 'PUT':
      // Payment callback (typically called by PhonePe webhook)
      try {
        const { 
          transactionId, 
          status, 
          gatewayResponse 
        } = req.body

        // Validate required fields
        if (!transactionId || !status) {
          return res.status(400).json({ error: 'Missing required payment details' })
        }

        const paymentTransaction = await processPaymentCallback(
          transactionId, 
          status, 
          gatewayResponse
        )

        return res.status(200).json(paymentTransaction)
      } catch (error) {
        return res.status(500).json({ 
          error: error instanceof Error ? error.message : 'Payment processing failed' 
        })
      }

    case 'DELETE':
      // Refund payment (admin only)
      if (!isAdmin) {
        return res.status(403).json({ error: 'Insufficient permissions' })
      }

      try {
        const { transactionId } = req.body

        if (!transactionId) {
          return res.status(400).json({ error: 'Transaction ID is required' })
        }

        const refundDetails = await refundPayment(transactionId)

        return res.status(200).json(refundDetails)
      } catch (error) {
        return res.status(500).json({ 
          error: error instanceof Error ? error.message : 'Refund processing failed' 
        })
      }

    default:
      res.setHeader('Allow', ['POST', 'PUT', 'DELETE'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}
