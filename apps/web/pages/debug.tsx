'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Client = dynamic(() => import('./debug.client'), { ssr: false });

export default function Debug() {
  return <Client />;
}
