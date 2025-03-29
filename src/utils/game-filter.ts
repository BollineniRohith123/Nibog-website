import { prisma } from '../lib/prisma'

export async function getEligibleGames(childAge: number, eventId?: number) {
  try {
    const baseQuery = {
      where: {
        minAge: { lte: childAge },
        maxAge: { gte: childAge }
      },
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        minAge: true,
        maxAge: true
      }
    }

    if (eventId) {
      return await prisma.game.findMany({
        ...baseQuery,
        where: {
          ...baseQuery.where,
          events: { some: { id: eventId } }
        }
      })
    }

    return await prisma.game.findMany(baseQuery)
  } catch (error) {
    console.error('Error filtering games:', error)
    throw error
  }
}

export function calculateAgeGroup(age: number) {
  const ageGroups = [
    { name: 'Infant', min: 0, max: 1 },
    { name: 'Toddler', min: 1, max: 3 },
    { name: 'Preschooler', min: 3, max: 5 }
  ]

  return ageGroups.find(group => age >= group.min && age <= group.max)?.name || 'Unknown'
}
