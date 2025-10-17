'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Client = dynamic(() => import('./login-native.client'), { ssr: false });

export default function LoginNative() {
  return <Client />;
}
