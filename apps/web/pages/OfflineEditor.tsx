import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the client demo and disable SSR so Next.js won't
// attempt to prerender browser-only code or call the component with
// unexpected props (like a children function) during build.
const OfflineDemoClient = dynamic(() => import('./offline-demo.client'), {
  ssr: false,
});

export default function OfflineEditorPage() {
  return <OfflineDemoClient />;
}
