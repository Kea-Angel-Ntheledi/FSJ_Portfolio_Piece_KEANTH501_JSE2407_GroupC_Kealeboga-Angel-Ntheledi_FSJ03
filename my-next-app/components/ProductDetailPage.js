"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/firebaseConfig';
import Link from 'next/link';

export default function ProductDetail({ productId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">Sign in to view</h1>
        <p className="mb-4">You need to be signed in to view this product's details.</p>
        <Link href="/auth?mode=signin" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition">
          Sign In
        </Link>
      </div>
    );
  }

  // Here you would fetch and display the product details
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-8">Product Details</h1>
      {/* Replace this with actual product details */}
      <p>Details for product {productId}</p>
    </div>
  );
}