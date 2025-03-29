import { clerkClient } from '@clerk/nextjs/server';

export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const adminUserIds = process.env.ADMIN_USERS?.split(',') || [];
    return adminUserIds.includes(userId);
  } catch (error) {
    console.error('Admin check failed:', error);
    return false;
  }
}

export async function getUserRole(userId: string): Promise<'ADMIN' | 'USER'> {
  const isAdminUser = await isAdmin(userId);
  return isAdminUser ? 'ADMIN' : 'USER';
}

export async function getUserDetails(userId: string) {
  try {
    const user = await clerkClient.users.getUser(userId);
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.emailAddresses[0].emailAddress,
      role: await getUserRole(userId)
    };
  } catch (error) {
    console.error('Failed to fetch user details:', error);
    return null;
  }
}
