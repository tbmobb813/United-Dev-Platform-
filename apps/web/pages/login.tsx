'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Client = dynamic(() => import('./login.client'), { ssr: false });

  return (
    <div style={{ padding: 24 }}>
      <h1>Login</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder='Enter your name'
        style={{ padding: 6, border: '1px solid #ddd', borderRadius: 6 }}
      />
      <div style={{ marginTop: 12 }}>
        <Button onClick={handleLogin}>Enter</Button>
      </div>
    </div>
  );
}
