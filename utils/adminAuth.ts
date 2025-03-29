import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';

// List of admin user IDs or emails
const ADMIN_USERS = process.env.ADMIN_USERS 
  ? process.env.ADMIN_USERS.split(',') 
  : [];

const ADMIN_EMAIL_DOMAINS = ['nibog.com'];
const ADMIN_ROLE = 'admin';

export async function isAdmin(userId: string | null): Promise<boolean> {
  if (!userId) return false;

  try {
    // Check if user exists in predefined admin list
    if (ADMIN_USERS.includes(userId)) return true;

    // Fetch user from Clerk with error handling
    let user;
    try {
      user = await clerkClient.users.getUser(userId);
    } catch (fetchError) {
      console.error('Failed to fetch user:', fetchError);
      return false;
    }

    // Ensure user object exists before checking
    if (!user) {
      console.error('No user found for ID:', userId);
      return false;
    }

    // Check for admin role
    const isAdminRole = user.publicMetadata?.role === ADMIN_ROLE;

    // Check for admin email domain
    const isAdminDomain = user.emailAddresses?.some(email => 
      ADMIN_EMAIL_DOMAINS.some(domain => 
        email.emailAddress.toLowerCase().endsWith(`@${domain}`)
      )
    ) || false;

    return isAdminRole || isAdminDomain;
  } catch (error) {
    console.error('Admin check error:', error);
    return false;
  }
}

export async function verifyAdminToken(req: NextApiRequest): Promise<boolean> {
  const { userId } = getAuth(req);
  return await isAdmin(userId);
}

export function requireAdminAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const { userId } = getAuth(req);

    const adminCheck = await isAdmin(userId);
    if (!adminCheck) {
      return res.status(403).json({ 
        error: 'Unauthorized', 
        message: 'You do not have permission to access this resource' 
      });
    }

    return handler(req, res);
  };
}

export function withAdminAuth<P = {}>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AdminAuthWrapper(props: P) {
    const { user, isLoaded } = useUser();
    const router = useRouter();

    useEffect(() => {
      const checkAdminAccess = async () => {
        if (isLoaded) {
          try {
            const adminAccess = await isAdmin(user?.id || null);
            
            if (!adminAccess) {
              router.push('/unauthorized');
            }
          } catch (error) {
            console.error('Admin access check failed', error);
            router.push('/unauthorized');
          }
        }
      };

      if (isLoaded) {
        checkAdminAccess();
      }
    }, [user, isLoaded, router]);

    if (!isLoaded) {
      return null; // or a loading component
    }

    // Use function call to render component
    return (WrappedComponent as any)(props);
  };
}
