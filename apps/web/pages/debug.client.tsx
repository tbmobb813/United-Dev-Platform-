'use client';

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@udp/ui';

export default function DebugClient() {
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

  if (!isClient) {
    return <div>Loading...</div>;
  }
  if (!userName) {
    return <div>No user found, redirecting...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Head>
        <title>Debug - Unified Dev Platform</title>
      </Head>
      <h1>Debug Page - Unified Dev Platform</h1>
      <p>Logged in as: {String(userName)}</p>
      <Button onClick={handleSignOut}>Sign out</Button>
      <hr />
      <h2>This is a minimal test page</h2>
      <p>
        If this page works without errors, we can gradually add features back.
      </p>
      <ul>
        <li>✅ Basic React components</li>
        <li>✅ Button component from @udp/ui</li>
        <li>✅ Client-side rendering</li>
        <li>✅ Local storage access</li>
      </ul>
    </div>
  );
}
