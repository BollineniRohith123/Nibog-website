import { PrismaClient } from '@prisma/client'
import { addDays, format } from 'date-fns'

const prisma = new PrismaClient()

enum UserRole {
  ADMIN = 'ADMIN',
  PARENT = 'PARENT',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

enum EventStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED'
}

enum RegistrationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  PAID = 'PAID'
}

async function seedUsers(): Promise<void> {
  return prisma.userProfile.createMany({
    data: [
      {
        clerkId: 'user_admin_1',
        email: 'admin@nibog.com',
        firstName: 'NIBOG',
        lastName: 'Administrator',
        phoneNumber: '+919876543210',
        role: UserRole.ADMIN
      },
      {
        clerkId: 'user_parent_1',
        email: 'parent1@example.com',
        firstName: 'Rahul',
        lastName: 'Sharma',
        phoneNumber: '+919876543211',
        role: UserRole.PARENT
      }
    ],
    skipDuplicates: true
  })
}

async function seedCities(): Promise<void> {
  return prisma.city.createMany({
    data: [
      {
        name: 'Bangalore',
        state: 'Karnataka',
        country: 'India'
      },
      {
        name: 'Mumbai',
        state: 'Maharashtra', 
        country: 'India'
      },
      {
        name: 'Delhi',
        state: 'Delhi',
        country: 'India'
      }
    ],
    skipDuplicates: true
  })
}

async function seedGames(): Promise<void> {
  return prisma.game.createMany({
    data: [
      {
        name: 'Chess',
        minAge: 6,
        maxAge: 16,
        description: 'Strategic board game for young minds'
      },
      {
        name: 'Coding Workshop',
        minAge: 8,
        maxAge: 16,
        description: 'Learn programming fundamentals'
      },
      {
        name: 'Robotics',
        minAge: 10,
        maxAge: 16,
        description: 'Introduction to robotics and basic engineering'
      }
    ],
    skipDuplicates: true
  })
}

async function seedEvents(): Promise<void> {
  const cities: { name: string; id: number }[] = await prisma.city.findMany()
  const games: { name: string; id: number }[] = await prisma.game.findMany()

  const eventsData = [
    {
      name: 'Chess Tournament',
      description: 'Annual chess competition for kids',
      startDate: new Date(),
      endDate: addDays(new Date(), 2),
      cityId: cities.find((c) => c.name === 'Bangalore')?.id || 1,
      gameId: games.find((g) => g.name === 'Chess')?.id || 1,
      status: EventStatus.UPCOMING,
      price: 500,
      maxParticipants: 50
    },
    {
      name: 'Coding Workshop for Beginners',
      description: 'Learn programming from scratch',
      startDate: addDays(new Date(), 7),
      endDate: addDays(new Date(), 9),
      cityId: cities.find((c) => c.name === 'Mumbai')?.id || 2,
      gameId: games.find((g) => g.name === 'Coding Workshop')?.id || 2,
      status: EventStatus.UPCOMING,
      price: 1000,
      maxParticipants: 30
    }
  ]

  return prisma.event.createMany({
    data: eventsData,
    skipDuplicates: true
  })
}

async function main(): Promise<void> {
  console.log('Starting database seeding...')
  
  await seedUsers()
  await seedCities()
  await seedGames()
  await seedEvents()

  console.log('Database seeding completed successfully!')
}

main()
  .catch((e: Error) => {
    console.error('Unhandled error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
