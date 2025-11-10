import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider, CommandPaletteProvider, CommandPalette } from '@udp/ui';

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider defaultMode='light' storageKey='udp-theme-mode'>
        <CommandPaletteProvider openShortcut='mod+k'>
          <Component {...pageProps} />
          <CommandPalette
            placeholder='Type a command or search...'
            maxResults={10}
          />
        </CommandPaletteProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
