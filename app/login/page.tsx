'use client';
import { getClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@utils/Logo';
import toast from 'react-hot-toast';

export default function LogIn() {
  const router = useRouter();
  const supabase = getClient();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email')!.toString();
    const password = data.get('password')!.toString();
    
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Redirect only if we have a session
      if (authData?.session) {
        router.push('/u');
        router.refresh(); // Refresh to update auth state across the app
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-center pt-32">
        <Link href="/"><button className="btn btn-ghost text-3xl capitalize gap-1"><Logo size={40}/> BeeNote</button></Link>
      </div>

      <div className="flex justify-center mt-10"> 
        <form action="#" method="POST" onSubmit={handleSubmit}>
          <div className="form-control w-full max-w-xs">
            <label className="label"><span className="label-text">Email</span></label>
            <input 
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email address"
              required
              className="input input-bordered w-full max-w-xs" />
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label"><span className="label-text">Password</span></label>
            <input 
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              required 
              className="input input-bordered w-full max-w-xs" />
            <label className="label">
              <span className='label-text-alt'></span>
              <span className='label-text-alt'><Link href="/reset" className="link link-info">Forgot Password?</Link></span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-wide mt-4">Log In</button>
        </form>
      </div>

      <div className="flex justify-center mt-10 mb-10">
        <Link href="/signup" className="link link-info">Don&apos;t have an account? Sign up here</Link>
      </div>
    </div>
  );
}
