'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@udp/ui';
import { signIn } from 'next-auth/react';
import styles from './styles/DemoPages.module.css';

export default function LoginClient() {
  const router = useRouter();
  const [name, setName] = useState('');

  const handleLogin = () => {
    if (name && name.trim()) {
      localStorage.setItem('userName', name.trim());
      router.push('/');
    } else {
      // fallback to GitHub sign-in when no local name provided
      signIn('github', { callbackUrl: '/' });
    }
  };

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder='Enter your name (or leave blank to sign in with GitHub)'
        className={styles.input}
      />
      <div className={styles.buttonSpacing}>
        <Button onClick={handleLogin}>Enter</Button>
      </div>
    </div>
  );
}
