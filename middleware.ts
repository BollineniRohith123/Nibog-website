import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default authMiddleware({
  // Configure public routes that don't require authentication
  publicRoutes: [
    '/',
    '/events',
    '/api/events(.*)'
  ],
  debug: true,
  beforeAuth: (req: NextRequest) => {
    try {
      // Optional: add custom logging or preprocessing
      console.log('Middleware processing:', req.url);
      return NextResponse.next();
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.json(
        { error: 'Internal Middleware Error', details: String(error) }, 
        { status: 500 }
      );
    }
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/'],
};
