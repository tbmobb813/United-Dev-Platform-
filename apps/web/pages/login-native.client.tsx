'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';

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
    <div style={{ padding: 24 }}>
      <h1>Login (Native Button)</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder='Enter your name'
        style={{ padding: 6, border: '1px solid #ddd', borderRadius: 6 }}
      />
      <div style={{ marginTop: 12 }}>
        <button
          onClick={handleLogin}
          style={{
            padding: '8px 16px',
            backgroundColor: '#0070f3',
            borderRadius: 4,
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Enter
        </button>
      </div>
    </div>
  );
}
