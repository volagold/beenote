import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const pathname = req.nextUrl.pathname;

  console.log('Middleware processing:', {
    path: pathname,
    timestamp: new Date().toISOString()
  });

  try {
    // Refresh session if needed
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    console.log('Session check:', {
      hasSession: !!session,
      path: pathname,
      error: sessionError?.message
    });

    // Handle protected routes (/u/*)
    if (pathname.startsWith('/u')) {
      if (!session) {
        console.log('No session, redirecting to login');
        const redirectUrl = new URL('/login', req.url);
        redirectUrl.searchParams.set('returnTo', pathname);
        return NextResponse.redirect(redirectUrl);
      }
      // If we have a session, allow access to /u routes
      console.log('Session valid, allowing access to:', pathname);
      return res;
    }

    // Handle auth pages (login, signup, reset)
    if (['/login', '/signup', '/reset'].includes(pathname)) {
      if (session) {
        console.log('Session exists on auth page, redirecting to /u');
        return NextResponse.redirect(new URL('/u', req.url));
      }
      // If no session, allow access to auth pages
      console.log('No session, allowing access to auth page:', pathname);
      return res;
    }

    // For all other routes, just continue
    return res;
  } catch (error) {
    console.error('Middleware error:', {
      error: error.message,
      path: pathname
    });
    
    // On error accessing protected route, redirect to login
    if (pathname.startsWith('/u')) {
      console.log('Error occurred, redirecting to login');
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('error', 'session_error');
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
