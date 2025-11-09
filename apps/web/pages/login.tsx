'use client';

import dynamic from 'next/dynamic';

const LoginClient = dynamic(() => import('./login.client'), { ssr: false });

export default function Login() {
  return <LoginClient />;
}
