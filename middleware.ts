import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  try {
    const supabase = createMiddlewareClient({ req, res });
    
    // Refresh session if needed
    const { data: { session } } = await supabase.auth.getSession();

    // Handle protected routes (/u/*)
    if (pathname.startsWith('/u')) {
      if (!session) {
        const redirectUrl = new URL('/login', req.url);
        redirectUrl.searchParams.set('returnTo', pathname);
        return NextResponse.redirect(redirectUrl);
      }
      return res;
    }

    // Handle auth pages (login, signup, reset)
    if (['/login', '/signup', '/reset'].includes(pathname)) {
      if (session) {
        return NextResponse.redirect(new URL('/u', req.url));
      }
      return res;
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    
    if (pathname.startsWith('/u')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return res;
  }
}

export const config = {
  matcher: [
    '/u/:path*',
    '/login',
    '/signup',
    '/reset'
  ],
}
