'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Client = dynamic(() => import('./minimal.client'), { ssr: false });

export default function MinimalHome() {
  const ClientComp = Client as unknown as React.ComponentType<Record<string, unknown>>;
  return (
    // @ts-ignore - dynamic client component props intentionally treated as unknown during typing pass
    <ClientComp />
  );
}
