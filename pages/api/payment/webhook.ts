import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import PaymentService from '@/services/payment';
import EmailService from '@/services/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { merchantTransactionId, transactionId, status } = req.body;

    // Verify payment with PhonePe
    const isPaymentValid = await PaymentService.verifyPayment({
      merchantTransactionId,
      transactionId
    });

    // Extract registration ID from merchant transaction ID
    const registrationId = merchantTransactionId.replace('MT', '');

    // Find the registration
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { 
        event: {
          include: {
            game: true
          }
        }
      }
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (isPaymentValid && status === 'SUCCESS') {
      // Create a payment transaction
      await prisma.paymentTransaction.create({
        data: {
          registrationId: registration.id,
          amount: registration.event.price,
          transactionId: transactionId,
          status: 'COMPLETED',
          paymentMethod: 'PhonePe'
        }
      });

      // Update registration status
      await prisma.registration.update({
        where: { id: registrationId },
        data: { 
          status: 'PAID'
        }
      });

      // Send confirmation email
      await EmailService.sendRegistrationConfirmation({
        to: registration.userProfile.email,
        childName: registration.userProfile.firstName, 
        eventName: registration.event.name,
        gameName: registration.event.game.name,
        registrationId: registration.id
      });

      return res.status(200).json({ message: 'Payment processed successfully' });
    } else {
      // Update registration status
      await prisma.registration.update({
        where: { id: registrationId },
        data: { 
          status: 'CANCELLED'
        }
      });

      return res.status(400).json({ message: 'Payment failed' });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
