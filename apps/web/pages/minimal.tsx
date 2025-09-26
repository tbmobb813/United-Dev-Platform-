'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Client = dynamic(() => import('./minimal.client'), { ssr: false });

export default function MinimalHome() {
  return <Client />;
}
