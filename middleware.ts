import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  // Create Supabase client
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session
  const { data: { session } } = await supabase.auth.getSession();

  // Protected routes
  if (pathname.startsWith('/u')) {
    if (!session) {
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('returnTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Auth routes
  if (['/login', '/signup', '/reset'].includes(pathname)) {
    if (session) {
      return NextResponse.redirect(new URL('/u', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/u/:path*',
    '/login',
    '/signup',
    '/reset'
  ],
}