'use client';
import { getClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@utils/Logo';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const router = useRouter();
  const supabase = getClient();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email')!.toString();

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) throw error;

      toast.success('Check your email for password reset instructions');
      router.push('/login');
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

          <button type="submit" className="btn btn-primary btn-wide mt-4">Reset Password</button>
        </form>
      </div>

      <div className="flex justify-center mt-10 mb-10">
        <Link href="/login" className="link link-info">Remember your password? Log in here</Link>
      </div>
    </div>
  );
}
