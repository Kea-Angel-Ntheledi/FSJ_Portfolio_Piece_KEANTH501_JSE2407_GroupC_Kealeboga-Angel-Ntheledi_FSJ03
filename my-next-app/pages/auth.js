"use client";

import { useState, useEffect } from 'react';
import { auth } from '../pages/api/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') || 'signin';

  // Redirect to home if user is already signed in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/');  // Redirect if already logged in
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleAuth = async (event) => {
    event.preventDefault();
    setError('');  // Reset error message

    try {
      // Authenticate user based on mode (signup or signin)
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/');  // Redirect to home page on success
    } catch (err) {
      setError(err.message);  // Show error message if authentication fails
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">
        {mode === 'signup' ? 'Sign Up' : 'Sign In'}
      </h1>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <form onSubmit={handleAuth} className="flex flex-col space-y-4 w-80">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className={`px-4 py-2 text-white rounded-md transition ${
            mode === 'signup' ? 'bg-green-600 hover:bg-green-500' : 'bg-blue-600 hover:bg-blue-500'
          }`}
        >
          {mode === 'signup' ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      <p className="mt-4 text-center">
        {mode === 'signup' ? (
          <>
            Already have an account?{' '}
            <Link href="/auth?mode=signin" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <Link href="/auth?mode=signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
