// pages/dashboard.js
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { auth } from '../firebase';

export default function Dashboard({ user }) {
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  return user ? <div>Welcome to your Dashboard!</div> : null;
}
