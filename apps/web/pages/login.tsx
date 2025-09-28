'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Client = dynamic(() => import('./login.client'), { ssr: false });

export default function Login() {
  return <Client />;
}
