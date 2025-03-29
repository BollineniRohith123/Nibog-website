import { prisma, safeDbOperation } from './db'

enum RegistrationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

export async function createRegistration(registrationData: {
  childName: string
  childAge: number
  parentName: string
  contactInfo: string
  email: string
  phoneNumber: string
  eventId: number
  gameId: number
  userId: string
}) {
  return safeDbOperation(async () => {
    // Check event and game availability
    const event = await prisma.event.findUnique({
      where: { id: registrationData.eventId },
      include: { 
        registrations: true,
        game: true
      }
    })

    if (!event) {
      throw new Error('Event not found')
    }

    if (event.registrations.length >= event.capacity) {
      throw new Error('Event has reached maximum capacity')
    }

    const game = event.game
    if (!game) {
      throw new Error('Selected game not available for this event')
    }

    // Validate age restrictions
    if (
      registrationData.childAge < game.minAge || 
      registrationData.childAge > game.maxAge
    ) {
      throw new Error('Child age does not match game requirements')
    }

    return await prisma.registration.create({
      data: {
        ...registrationData,
        status: RegistrationStatus.PENDING
      }
    })
  }, 'Failed to create registration')
}

export async function getUserRegistrations(userId: string) {
  return safeDbOperation(async () => {
    return await prisma.registration.findMany({
      where: { userId },
      include: { 
        event: {
          include: { 
            city: true,
            game: true 
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }, 'Failed to fetch user registrations')
}

export async function updateRegistrationStatus(
  registrationId: number, 
  status: RegistrationStatus
) {
  return safeDbOperation(async () => {
    return await prisma.registration.update({
      where: { id: registrationId },
      data: { status }
    })
  }, 'Failed to update registration status')
}

export async function cancelRegistration(registrationId: number) {
  return safeDbOperation(async () => {
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId }
    })

    if (!registration) {
      throw new Error('Registration not found')
    }

    return await prisma.registration.update({
      where: { id: registrationId },
      data: { status: RegistrationStatus.CANCELLED }
    })
  }, 'Failed to cancel registration')
}
