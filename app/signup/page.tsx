'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@utils/Logo';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function SignUp() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get('email')?.toString() || '';
      const password = formData.get('password')?.toString() || '';
      const confirmPassword = formData.get('confirm-password')?.toString() || '';

      console.log('Attempting signup with:', { email }); // Debug log

      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`
        }
      });

      console.log('Signup response:', { data, error }); // Debug log

      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message);
        return;
      }

      if (data?.user) {
        toast.success('Check your email to confirm your account');
        router.push('/login');
      } else {
        console.error('No user data in response');
        toast.error('Failed to create account');
      }
    } catch (error: any) {
      console.error('Signup catch block:', error);
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
              autoComplete="new-password"
              required
              placeholder="Password"
              className="input input-bordered w-full"
              disabled={isLoading}
            />
          </div>

          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Confirm password"
              className="input input-bordered w-full"
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className={`btn btn-primary w-full mt-6 ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="text-center mt-6">
            <Link href="/login" className="link link-info">
              Already have an account? Log in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
