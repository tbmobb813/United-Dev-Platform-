'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Client = dynamic(() => import('./offline-demo.client'), { ssr: false });

export default function OfflineDemo() {
  return <Client />;
}
