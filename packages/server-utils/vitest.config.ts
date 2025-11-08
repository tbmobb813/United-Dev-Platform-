import { defineConfig } from 'vitest/config';

// Use a permissive export shape to avoid strict typing mismatches across Vitest versions
export default (defineConfig as any)({
  test: {
    environment: 'node',
    // Ensure server-side transformation for TS files to avoid web/browser SSR helpers
    transformMode: {
      ssr: [/\.ts$/],
    },
  },
});
