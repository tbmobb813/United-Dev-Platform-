import dynamic from 'next/dynamic';
import React from 'react';

const ClientTestAI = dynamic(() => import('./test-ai.client'), { ssr: false });

export default function TestAIWrapper() {
  return <ClientTestAI />;
}
