import { clerkClient } from '@clerk/nextjs/server'
import { prisma } from './prisma'

enum UserRole {
  ADMIN = 'ADMIN',
  PARENT = 'PARENT'
}

export async function createUserProfile(userId: string, email: string) {
  try {
    const userDetails = await clerkClient.users.getUser(userId)
    
    return await prisma.userProfile.create({
      data: {
        id: userId,
        clerkId: userId,
        email: email,
        firstName: userDetails.firstName || '',
        lastName: userDetails.lastName || '',
        phoneNumber: userDetails.phoneNumbers[0]?.phoneNumber || '',
        role: UserRole.PARENT
      }
    })
  } catch (error) {
    console.error('Error creating user profile:', error)
    throw error
  }
}

export async function getUserProfile(userId: string) {
  return await prisma.userProfile.findUnique({
    where: { id: userId },
    include: { registrations: true }
  })
}

export async function updateUserRole(userId: string, role: UserRole) {
  return await prisma.userProfile.update({
    where: { id: userId },
    data: { role }
  })
}
