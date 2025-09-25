"use client";
import dynamic from 'next/dynamic';

const Client = dynamic(() => import('./index.client'), { ssr: false });

export default function Home() {
  return <Client />;
}
