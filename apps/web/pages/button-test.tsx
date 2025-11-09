import dynamic from 'next/dynamic';
import React from 'react';

const Client = dynamic(() => import('./button-test.client'), { ssr: false });

export default function ButtonTest() {
  const ClientComp = Client as unknown as React.ComponentType<Record<string, unknown>>;
  return (
    // @ts-ignore - dynamic client component props intentionally treated as unknown during typing pass
    <ClientComp />
  );
}
