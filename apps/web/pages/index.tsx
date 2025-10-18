import dynamic from 'next/dynamic';

const ClientIndex = dynamic(() => import('./index.client'), { ssr: false });

export default function IndexWrapper() {
  return <ClientIndex />;
}
