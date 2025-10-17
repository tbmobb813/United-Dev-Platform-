'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Client = dynamic(() => import('./presence-demo.client'), { ssr: false });

export default function PresenceDemo() {
  return <Client />;
}
