'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@udp/ui';
import styles from './styles/DemoPages.module.css';

export default function LoginClient() {
  const router = useRouter();
  const [name, setName] = useState('');

  const handleLogin = () => {
    if (name.trim()) {
      localStorage.setItem('userName', name.trim());
      router.push('/');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder='Enter your name'
        className={styles.input}
      />
      <div className={styles.buttonSpacing}>
        <Button onClick={handleLogin}>Enter</Button>
      </div>
    </div>
  );
}
