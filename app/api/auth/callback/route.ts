import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/u';

  console.log('Auth callback received:', { 
    code: code ? 'present' : 'missing',
    next 
  });

  if (code) {
    try {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
      
      // Exchange the code for a session
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
      
      console.log('Code exchange result:', { 
        hasSession: !!session,
        error: error?.message 
      });

      if (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url)
        );
      }

      if (session) {
        console.log('Session established, redirecting to:', next);
        return NextResponse.redirect(new URL(next, request.url));
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(
        new URL('/login?error=Something%20went%20wrong', request.url)
      );
    }
  }

  // If we get here, something went wrong
  console.log('No code present, redirecting to login');
  return NextResponse.redirect(
    new URL('/login?error=No%20code%20provided', request.url)
  );
}
