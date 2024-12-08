'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error
    console.error('Error:', error);

    // If it's an auth error, redirect to login
    if (error.message?.includes('auth') || error.message?.includes('session')) {
      router.push('/login');
    }
  }, [error, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <div className="flex gap-4 justify-center">
          <button
            className="btn btn-primary"
            onClick={() => reset()}
          >
            Try again
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => router.push('/')}
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}
