import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more: 
// https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error']
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Helper function for common database operations
export async function safeDbOperation<T>(
  operation: () => Promise<T>, 
  errorMessage: string = 'Database operation failed'
): Promise<T | null> {
  try {
    return await operation()
  } catch (error) {
    console.error(errorMessage, error)
    return null
  }
}

// Pagination helper
export function getPaginationParams(page: number = 1, pageSize: number = 10) {
  const skip = (page - 1) * pageSize
  return { skip, take: pageSize }
}
