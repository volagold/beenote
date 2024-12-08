import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const pathname = req.nextUrl.pathname;

  console.log('Middleware processing path:', pathname); // Debug log

  try {
    // Refresh session if needed
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    console.log('Middleware session check:', {
      path: pathname,
      hasSession: !!session,
      error: sessionError
    });

    if (sessionError) {
      console.error('Session error in middleware:', sessionError);
    }

    // Protected routes check
    if (pathname.startsWith('/u')) {
      if (!session) {
        console.log('No session, redirecting to login from:', pathname);
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/login';
        redirectUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(redirectUrl);
      }
      console.log('Session exists, allowing access to:', pathname);
    }

    // Auth pages check (login, signup, reset)
    if (session && ['/login', '/signup', '/reset'].includes(pathname)) {
      console.log('Session exists, redirecting to /u from auth page:', pathname);
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/u';
      return NextResponse.redirect(redirectUrl);
    }

    // Update response headers to set cookie
    const response = NextResponse.next({
      request: {
        headers: req.headers,
      },
    });

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    
    // If there's an error and trying to access protected route, redirect to login
    if (pathname.startsWith('/u')) {
      console.log('Error occurred, redirecting to login from:', pathname);
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/login';
      return NextResponse.redirect(redirectUrl);
    }
    return res;
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/u/:path*',
    '/login',
    '/signup',
    '/reset'
  ],
}
