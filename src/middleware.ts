import { authMiddleware, redirectToSignIn } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    '/', 
    '/events', 
    '/about', 
    '/contact', 
    '/api/events',
    '/sign-in',
    '/sign-up',
    '/pricing'
  ],
  
  // Routes that require admin access
  apiRoutes: [
    '/admin',
    '/admin/events',
    '/admin/registrations',
    '/api/events',
    '/api/registrations'
  ],

  // Customize the middleware behavior
  async afterAuth(auth, req: NextRequest) {
    // Logging for debugging
    console.log('Middleware Authentication Check:', {
      userId: auth.userId,
      isPublicRoute: auth.isPublicRoute,
      orgRole: auth.orgRole,
      pathname: req.nextUrl.pathname
    })

    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ 
        returnBackUrl: req.url 
      })
    }

    // Check for admin routes
    if (
      (req.nextUrl.pathname.startsWith('/admin') || 
       req.nextUrl.pathname.startsWith('/api/admin')) && 
      (!auth.userId || auth.orgRole !== 'admin')
    ) {
      console.warn('Unauthorized admin access attempt:', {
        userId: auth.userId,
        orgRole: auth.orgRole,
        pathname: req.nextUrl.pathname
      })
      return new NextResponse('Unauthorized', { status: 403 })
    }

    // Check for dashboard and protected routes
    if (
      req.nextUrl.pathname === '/dashboard' && 
      (!auth.userId || (auth.orgRole !== 'admin' && auth.orgRole !== 'user'))
    ) {
      console.warn('Unauthorized dashboard access attempt:', {
        userId: auth.userId,
        orgRole: auth.orgRole
      })
      return redirectToSignIn({ 
        returnBackUrl: req.url
      })
    }

    // If all checks pass, continue the request
    return NextResponse.next()
  }
})

// Specify which routes this middleware applies to
export const config = {
  matcher: [
    '/((?!_next/image|_next/static|favicon.ico).*)',
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/:path*'
  ]
}
