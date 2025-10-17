'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const ClientIndex = dynamic(() => import('./index.client'), { ssr: false });

export default function IndexWrapper() {
  return <ClientIndex />;
}
