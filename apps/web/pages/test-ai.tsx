import dynamic from 'next/dynamic';
import React from 'react';

const ClientTestAI = dynamic(() => import('./test-ai.client'), { ssr: false });

export default function TestAIWrapper() {
  const ClientComp = ClientTestAI as unknown as React.ComponentType<Record<string, unknown>>;
  return (
    // @ts-ignore - dynamic client component props intentionally treated as unknown during typing pass
    <ClientComp />
  );
}
