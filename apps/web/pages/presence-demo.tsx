'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Client = dynamic(() => import('./presence-demo.client'), { ssr: false });

export default function PresenceDemo() {
  const ClientComp = Client as unknown as React.ComponentType<Record<string, unknown>>;
  return (
    // @ts-ignore - dynamic client component props intentionally treated as unknown during typing pass
    <ClientComp />
  );
}
