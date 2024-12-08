import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/u';

  console.log('Auth callback:', { 
    hasCode: !!code,
    next,
    timestamp: new Date().toISOString()
  });

  if (code) {
    try {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
      
      // Exchange the code for a session
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
      
      console.log('Code exchange:', { 
        hasSession: !!session,
        error: error?.message,
        timestamp: new Date().toISOString()
      });

      if (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent(error.message)}`, request.url)
        );
      }

      if (session) {
        // Create a response that redirects to the next page
        const response = NextResponse.redirect(new URL(next, request.url));

        // Set cookie expiry to match session expiry
        const sessionExpiry = new Date(session.expires_at * 1000);
        
        // Set secure cookie flags
        response.cookies.set('sb-access-token', session.access_token, {
          path: '/',
          expires: sessionExpiry,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });

        response.cookies.set('sb-refresh-token', session.refresh_token, {
          path: '/',
          expires: sessionExpiry,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });

        console.log('Redirecting with session:', {
          next,
          expiresAt: sessionExpiry.toISOString()
        });

        return response;
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(
        new URL('/login?error=Something%20went%20wrong', request.url)
      );
    }
  }

  console.log('No code present, redirecting to login');
  return NextResponse.redirect(
    new URL('/login?error=No%20code%20provided', request.url)
  );
}
