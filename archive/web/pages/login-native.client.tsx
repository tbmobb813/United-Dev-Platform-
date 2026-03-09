'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './styles/DemoPages.module.css';

export default function LoginNativeClient() {
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
      <h1>Login (Native Button)</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder='Enter your name'
        className={styles.input}
      />
      <div className={styles.buttonSpacing}>
        <button onClick={handleLogin} className={styles.primaryButton}>
          Enter
        </button>
      </div>
    </div>
  );
}
