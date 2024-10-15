"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { auth } from '../pages/api/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-200 shadow">
      <div className="text-xl font-bold">
        <Link href="/">Your Store Logo</Link>
      </div>
      <nav className="flex space-x-4">
        <Link href="/about" className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition">
          About
        </Link>
        {user ? (
          <button onClick={handleLogout} className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-red-600 transition">
            Logout
          </button>
        ) : (
          <>
            <Link href="/auth?mode=signin" className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-blue-600 transition">
              Sign In
            </Link>
            <Link href="/auth?mode=signup" className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-green-600 transition">
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}