import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@udp/ui/Button';

export default function Login() {
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
      <h1>Login</h1>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        style={{ padding: 6, border: '1px solid #ddd', borderRadius: 6 }}
      />
      <div style={{ marginTop: 12 }}>
        <Button onClick={handleLogin}>Enter</Button>
      </div>
    </div>
  );
}