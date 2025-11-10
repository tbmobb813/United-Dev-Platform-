import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@udp/ui';

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider defaultMode='light' storageKey='udp-theme-mode'>
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}
