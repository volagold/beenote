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
    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent) => {
        if (event === 'SIGNED_IN') {
          toast.success('Signed in successfully');
          await router.push('/u');
          router.refresh();
        }
        if (event === 'SIGNED_OUT') {
          await router.push('/login');
          router.refresh();
        }
        if (event === 'USER_UPDATED') {
          router.refresh();
        }
        if (event === 'PASSWORD_RECOVERY') {
          toast.success('Check your email for password reset instructions');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Auth state change error:', error);
      toast.error('Authentication error occurred');
    }
  }, [router, supabase]);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};
