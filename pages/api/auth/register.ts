import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { Clerk } from '@clerk/nextjs/server';

const prisma = new PrismaClient();
const clerk = Clerk({ apiKey: process.env.CLERK_SECRET_KEY });

const UserRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phoneNumber: z.string().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const validatedData = UserRegistrationSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Prepare Clerk user data
    const clerkUserData: any = {
      emailAddress: [validatedData.email],
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      password: validatedData.password,
    };

    // Add phone number if provided
    if (validatedData.phoneNumber) {
      clerkUserData.phoneNumber = [validatedData.phoneNumber];
    }

    // Create Clerk user
    const clerkUser = await clerk.users.createUser(clerkUserData);

    // Create user in Prisma
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phoneNumber: validatedData.phoneNumber || '',
        password: hashedPassword,
        clerkUserId: clerkUser.id,
        role: 'PARENT',
      },
    });

    return res.status(201).json({
      success: true,
      userId: user.id,
      email: user.email,
      token: clerkUser.id, // Using Clerk user ID as token
    });
  } catch (error) {
    console.error('Registration Error:', error);
    
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
