'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@utils/Logo';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function ResetPassword() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get('email')?.toString() || '';

      console.log('Attempting password reset for:', { email }); // Debug log

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/login`,
      });

      console.log('Reset password response:', { error }); // Debug log

      if (error) {
        console.error('Reset password error:', error);
        toast.error(error.message);
        return;
      }

      toast.success('Check your email for password reset instructions');
      router.push('/login');
    } catch (error: any) {
      console.error('Reset password catch block:', error);
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

          <button 
            type="submit" 
            className={`btn btn-primary w-full mt-6 ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending Instructions...' : 'Reset Password'}
          </button>

          <div className="text-center mt-6">
            <Link href="/login" className="link link-info">
              Remember your password? Log in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
