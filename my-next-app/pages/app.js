// pages/_app.js
import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        router.push('/auth');  // Redirect to auth page if not logged in
      }
    });

    return () => unsubscribe();  // Cleanup listener on component unmount
  }, [router]);

  return <Component {...pageProps} user={user} />;
}

export default MyApp;

