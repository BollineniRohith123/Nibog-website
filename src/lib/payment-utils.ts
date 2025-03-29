import { prisma, safeDbOperation } from './db'

enum RegistrationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

// Simulated PhonePe payment integration
export async function initiatePhonePePayment(
  registrationId: number, 
  amount: number
) {
  return safeDbOperation(async () => {
    // In a real-world scenario, this would interact with PhonePe's SDK
    const transactionId = `NIBOG-${Date.now()}`
    
    return {
      paymentUrl: `https://phonepe.com/pay/${transactionId}`,
      transactionId,
      registrationId
    }
  }, 'Failed to initiate PhonePe payment')
}

export async function processPaymentCallback(
  transactionId: string, 
  status: string, 
  gatewayResponse: any
) {
  return safeDbOperation(async () => {
    // Find the registration associated with this transaction
    const registration = await prisma.registration.findFirst({
      where: { 
        paymentTransactions: {
          some: {
            transactionId: transactionId 
          }
        }
      }
    })

    if (!registration) {
      throw new Error('Registration not found for this transaction')
    }

    // Fetch the event price
    const event = await prisma.event.findUnique({
      where: { id: registration.eventId }
    })

    // Create or update payment transaction
    const paymentTransaction = await prisma.paymentTransaction.upsert({
      where: { transactionId },
      update: {
        status,
        gatewayResponse: JSON.stringify(gatewayResponse),
        amount: event?.price || 0
      },
      create: {
        transactionId,
        status,
        gatewayResponse: JSON.stringify(gatewayResponse),
        registrationId: registration.id,
        amount: event?.price || 0
      }
    })

    // Update registration status based on payment status
    const registrationStatus = status === 'SUCCESS' 
      ? RegistrationStatus.CONFIRMED 
      : RegistrationStatus.CANCELLED

    await prisma.registration.update({
      where: { id: registration.id },
      data: { 
        status: registrationStatus,
        paymentStatus: status
      }
    })

    return paymentTransaction
  }, 'Failed to process payment callback')
}

export async function refundPayment(transactionId: string) {
  return safeDbOperation(async () => {
    // Find the payment transaction
    const paymentTransaction = await prisma.paymentTransaction.findUnique({
      where: { transactionId },
      include: { registration: true }
    })

    if (!paymentTransaction) {
      throw new Error('Payment transaction not found')
    }

    // Simulate refund process with a payment gateway
    const refundId = `REFUND-${Date.now()}`
    const refundStatus = 'PROCESSED'

    // Update payment transaction with refund details
    const updatedTransaction = await prisma.paymentTransaction.update({
      where: { transactionId },
      data: {
        refundId,
        refundStatus,
        status: 'REFUNDED'
      }
    })

    // Update registration status
    await prisma.registration.update({
      where: { id: paymentTransaction.registrationId },
      data: { 
        status: RegistrationStatus.CANCELLED,
        paymentStatus: 'REFUNDED'
      }
    })

    return {
      refundId,
      refundStatus,
      transactionId,
      amount: paymentTransaction.amount
    }
  }, 'Failed to process refund')
}
