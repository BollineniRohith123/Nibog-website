import { prisma, safeDbOperation, getPaginationParams } from './db'

enum EventStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED'
}

export async function getUpcomingEvents(
  page: number = 1, 
  pageSize: number = 10, 
  cityId?: number
) {
  return safeDbOperation(async () => {
    const { skip, take } = getPaginationParams(page, pageSize)
    
    return await prisma.event.findMany({
      where: {
        status: EventStatus.UPCOMING,
        ...(cityId && { cityId })
      },
      include: {
        city: true,
        game: true
      },
      orderBy: { startDate: 'asc' },
      skip,
      take
    })
  }, 'Failed to fetch upcoming events')
}

export async function getEventDetails(eventId: number) {
  return safeDbOperation(async () => {
    return await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        city: true,
        game: true,
        registrations: {
          include: {
            userProfile: true
          }
        }
      }
    })
  }, `Failed to fetch event details for ID ${eventId}`)
}

export async function createEvent(eventData: any) {
  return safeDbOperation(async () => {
    return await prisma.event.create({
      data: {
        ...eventData,
        status: EventStatus.UPCOMING
      }
    })
  }, 'Failed to create event')
}

export async function updateEventStatus(
  eventId: number, 
  status: EventStatus
) {
  return safeDbOperation(async () => {
    return await prisma.event.update({
      where: { id: eventId },
      data: { status }
    })
  }, `Failed to update event status for ID ${eventId}`)
}

export async function getAvailableGamesByAge(
  eventId: number, 
  childAge: number
) {
  return safeDbOperation(async () => {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { game: true }
    })

    if (!event) {
      return []
    }

    // Filter games based on child's age
    const availableGames = event.game ? [event.game] : []
    
    return availableGames
  }, `Failed to fetch available games for event ID ${eventId}`)
}
