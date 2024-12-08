import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    // Refresh session if needed
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    console.log('Middleware session check:', {
      path: req.nextUrl.pathname,
      hasSession: !!session,
      error: sessionError
    });

    // If there's no session and the user is trying to access a protected route
    if (!session && req.nextUrl.pathname.startsWith('/u')) {
      console.log('No session, redirecting to login');
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/login';
      redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If there's a session and the user is trying to access auth pages
    if (session && (
      req.nextUrl.pathname === '/login' ||
      req.nextUrl.pathname === '/signup' ||
      req.nextUrl.pathname === '/reset'
    )) {
      console.log('Session exists, redirecting to /u');
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/u';
      return NextResponse.redirect(redirectUrl);
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    
    // If there's an error getting the session, redirect to login
    if (req.nextUrl.pathname.startsWith('/u')) {
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
