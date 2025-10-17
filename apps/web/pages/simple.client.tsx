'use client';

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@udp/ui';

export default function SimpleHomeClient() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedName =
      typeof window !== 'undefined' ? localStorage.getItem('userName') : null;
    if (!storedName) {
      router.push('/login');
    } else {
      setUserName(storedName);
    }
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('userName');
    router.push('/login');
  };

  if (!userName || !isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Head>
        <title>Simple Unified Dev Platform</title>
      </Head>
      <h1>Simple Unified Dev Platform (Web)</h1>
      <p>Logged in as: {userName}</p>
      <Button onClick={handleSignOut}>Sign out</Button>
      <p>This is a simplified version for testing.</p>
    </div>
  );
}
