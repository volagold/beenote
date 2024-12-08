'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useTheme, useToggleTheme } from './Theme';
import 'remixicon/fonts/remixicon.css';
import toast from 'react-hot-toast';

export default function ProfileDrop({ drop = 'dropdown-end' }) {
  const theme = useTheme();
  const toggleTheme = useToggleTheme();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState('/logo.png'); // Default avatar

  useEffect(() => {
    async function getUser() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          return;
        }

        if (session?.user) {
          setLoggedIn(true);
          setUser(session.user);

          // Get user profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('avatar_url')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Profile error:', profileError);
            return;
          }

          if (profile?.avatar_url) {
            setAvatarUrl(profile.avatar_url);
          }
        }
      } catch (error) {
        console.error('Error getting user:', error);
      }
    }

    getUser();
  }, [supabase]);

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setLoggedIn(false);
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/');
      router.refresh();
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Error logging out');
    }
  };

  return (
    <>
      {loggedIn ? (
        <div className={`dropdown ${drop}`}>
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="rounded-full">
              <Image
                src={avatarUrl}
                width={40}
                height={40}
                alt="user avatar"
              />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-48"
          >
            <li>
              <Link href="/u">
                <i className="ri-booklet-line"></i>Notebooks
              </Link>
            </li>
            <li>
              <Link href="/profile">
                <i className="ri-user-line"></i>Profile
              </Link>
            </li>
            <li>
              <Link href="/">
                <i className="ri-home-line"></i>Home
              </Link>
            </li>
            <li>
              <span onClick={() => toggleTheme(theme)} className="text-blue-600">
                <i className="ri-moon-clear-line"></i>Change Theme
              </span>
            </li>
            <li>
              <span onClick={logout} className="text-red-500">
                <i className="ri-logout-box-line"></i>Logout
              </span>
            </li>
          </ul>
        </div>
      ) : null}
    </>
  );
}
