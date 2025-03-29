import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { Clerk } from '@clerk/nextjs/server';

const prisma = new PrismaClient();
const clerk = Clerk({ apiKey: process.env.CLERK_SECRET_KEY });

const UserLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const validatedData = UserLoginSchema.parse(req.body);

    // Find user in Prisma
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      validatedData.password, 
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Authenticate with Clerk
    const clerkUser = await clerk.users.getUser(user.clerkUserId);

    return res.status(200).json({
      success: true,
      token: clerkUser.id,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation Error', 
        errors: error.errors 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'Internal Server Error' 
    });
  }
}
