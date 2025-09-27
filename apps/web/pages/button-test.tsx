import dynamic from 'next/dynamic';
import React from 'react';

const Client = dynamic(() => import('./button-test.client'), { ssr: false });

export default function ButtonTest() {
  return <Client />;
}
