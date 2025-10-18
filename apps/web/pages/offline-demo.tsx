'use client';

import dynamic from 'next/dynamic';

const OfflineDemoClient = dynamic(() => import('./offline-demo.client'), {
  ssr: false,
});

export default function OfflineDemo() {
  return <OfflineDemoClient />;
}
