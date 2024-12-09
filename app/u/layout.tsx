import { headers } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'production') {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      redirect('/login');
    }

    return <>{children}</>;
  }
  
  return <>{children}</>;
}