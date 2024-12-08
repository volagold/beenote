'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Logo from '@utils/Logo';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

export default function LogIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);

  // Check for error parameter
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      toast.error(decodeURIComponent(error));
    }
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get('email')?.toString() || '';
      const password = formData.get('password')?.toString() || '';

      console.log('Login attempt:', { email, timestamp: new Date().toISOString() });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message);
        return;
      }

      if (data?.session) {
        console.log('Session established');
        
        // Get return URL or default to /u
        const returnTo = searchParams.get('returnTo') || '/u';
        
        toast.success('Logged in successfully');
        router.push(returnTo);
        router.refresh();
      } else {
        console.error('No session in response');
        toast.error('Failed to log in');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-center pt-32">
        <Link href="/">
          <button className="btn btn-ghost text-3xl capitalize gap-1">
            <Logo size={40}/> BeeNote
          </button>
        </Link>
      </div>

      <div className="flex justify-center mt-10"> 
        <form onSubmit={handleSubmit} className="w-full max-w-xs">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input 
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              className="input input-bordered w-full"
              disabled={isLoading}
            />
          </div>

          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input 
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              className="input input-bordered w-full"
              disabled={isLoading}
            />
            <label className="label">
              <span></span>
              <Link href="/reset" className="label-text-alt link link-info">
                Forgot Password?
              </Link>
            </label>
          </div>

          <button 
            type="submit" 
            className={`btn btn-primary w-full mt-4 ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center mt-6">
            <Link href="/signup" className="link link-info">
              Don&apos;t have an account? Sign up here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
