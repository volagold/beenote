'use client';
import { getClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@utils/Logo';
import toast from 'react-hot-toast';

export default function SignUp() {
  const router = useRouter();
  const supabase = getClient();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email')!.toString();
    const password = data.get('password')!.toString();
    const confirmPassword = data.get('confirm-password')!.toString();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/u`
        }
      });

      if (error) throw error;

      if (authData?.user) {
        toast.success('Check your email to confirm your account');
        router.push('/login');
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
              autoComplete="new-password"
              placeholder="Password"
              required
              className="input input-bordered w-full max-w-xs" />
          </div>

          <div className="form-control w-full max-w-xs">
            <label className="label"><span className="label-text">Confirm Password</span></label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm password"
              required
              className="input input-bordered w-full max-w-xs" />
          </div>

          <button type="submit" className="btn btn-primary btn-wide mt-4">Sign Up</button>
        </form>
      </div>

      <div className="flex justify-center mt-10 mb-10">
        <Link href="/login" className="link link-info">Already have an account? Log in here</Link>
      </div>
    </div>
  );
}
