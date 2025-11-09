'use client';

import dynamic from 'next/dynamic';

const LoginNativeClient = dynamic(() => import('./login-native.client'), {
  ssr: false,
});

export default function LoginNative() {
  return <LoginNativeClient />;
}
