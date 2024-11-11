'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { fetchUserProfile } from '@/components/FetchUserProfile';
import supabaseAnon from '@/lib/supabaseAnonClient';

const AuthContext = createContext();

// Wrapper that redirects to login if user is not authenticated
export default function AuthCheckWrapper({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabaseAnon.auth.getSession();

      const restrictedPaths = ['/login', '/register'];

      // Skip redirect if user is on login or register page
      if (!session && !(restrictedPaths.includes(pathname))) {
        console.log("path name", pathname)
        router.push('/login');
        setLoading(false);
      }
      else if (!session) {
        if (!restrictedPaths.includes(pathname)) {
          router.push("/login")
          setLoading(false)
        }
        setLoading(false)
      }
      // Send to home if logged in and accessing login/register
      else if (
        session &&
        (pathname === '/login' || pathname === '/register')
      ) {
        router.push('/home');
        setLoading(false);
      } else {
        const fetchedUserProfile = await fetchUserProfile(session.user.id);
        const updatedUser = { ...session.user, ...fetchedUserProfile };
        setUser(updatedUser);
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      <div className="flex w-full h-full">
        {loading ? (
          <div className="flex w-full h-full items-center justify-center">
            <p className="text-xl text-white">Loading...</p>
          </div>
        ) : (
          children
        )}
      </div>
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
