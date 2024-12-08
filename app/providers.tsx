'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AuthChangeEvent } from '@supabase/supabase-js';

const AuthContext = createContext({});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      if (event === 'SIGNED_IN') {
        router.refresh();
      }
      if (event === 'SIGNED_OUT') {
        router.push('/login');
        router.refresh();
      }
      if (event === 'USER_UPDATED') {
        router.refresh();
      }
      if (event === 'TOKEN_REFRESHED') {
        router.refresh();
      }
      if (event === 'PASSWORD_RECOVERY') {
        toast.success('Check your email for password reset instructions');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};
