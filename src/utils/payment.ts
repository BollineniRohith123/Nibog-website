import { prisma } from '../lib/db'

enum RegistrationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  PAID = 'PAID'
}

interface PhonePePaymentResponse {
  transactionId: string;
  status: string;
  amount: number;
  currency: string;
  gatewayResponse: any;
}

export async function initiatePayment(registrationId: number, amount: number) {
  // Generate a unique transaction ID that includes the registration ID
  const transactionId = `NIBOG-${registrationId}-${Date.now()}`

  // TODO: Implement actual PhonePe payment initiation logic
  // This is a placeholder implementation
  return {
    paymentUrl: `https://phonepe.com/pay/${transactionId}`,
    transactionId,
    registrationId
  }
}

export async function processPaymentCallback(paymentResponse: PhonePePaymentResponse) {
  try {
    // Extract the actual registration ID from the transaction details
    const registrationId = parseInt(paymentResponse.transactionId.split('-')[1], 10)

    const transaction = await prisma.paymentTransaction.create({
      data: {
        registrationId: registrationId,
        amount: paymentResponse.amount,
        transactionId: paymentResponse.transactionId,
        status: paymentResponse.status,
        gatewayResponse: paymentResponse.gatewayResponse,
        paymentMethod: 'PHONEPE' // Default payment method
      }
    })

    // Update registration status based on payment
    await prisma.registration.update({
      where: { id: registrationId },
      data: { 
        status: paymentResponse.status === 'SUCCESS' 
          ? RegistrationStatus.PAID 
          : RegistrationStatus.PENDING 
      }
    })

    return transaction
  } catch (error) {
    console.error('Payment callback processing error:', error)
    throw error
  }
}

export async function refundPayment(transactionId: string) {
  try {
    // TODO: Implement actual refund logic with PhonePe
    const transaction = await prisma.paymentTransaction.findUnique({
      where: { transactionId }
    })

    if (!transaction) {
      throw new Error('Transaction not found')
    }

    // Update transaction status to refunded
    await prisma.paymentTransaction.update({
      where: { transactionId },
      data: { status: 'REFUNDED' }
    })

    // Update registration status
    await prisma.registration.update({
      where: { id: transaction.registrationId },
      data: { status: RegistrationStatus.CANCELLED }
    })

    return { success: true, transactionId }
  } catch (error) {
    console.error('Refund processing error:', error)
    throw error
  }
}
