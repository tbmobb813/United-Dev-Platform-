'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Client = dynamic(() => import('./simple.client'), { ssr: false });

export default function SimpleHome() {
  return <Client />;
}
