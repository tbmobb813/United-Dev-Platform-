import { resolve } from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emit production source maps for client bundles so we can map webpack module ids
  // (e.g. the module containing an inlined Yjs runtime) back to their original
  // source files. This is a temporary diagnostic change; it can be removed after
  // we identify the offending package/file and apply a permanent fix.
  productionBrowserSourceMaps: true,
  transpilePackages: ['@udp/editor-core', '@udp/ui', '@udp/ai'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Force single Yjs and related packages to prevent "already imported" warnings
    // Force webpack to resolve to the exact hoisted module files using require.resolve
    // This is more robust than pointing at node_modules paths (pnpm's layout can vary)
    config.resolve.alias = {
      ...config.resolve.alias,
      // Resolve all imports of 'yjs' to the single hoisted runtime entry (mjs) so webpack
      // can't accidentally bundle multiple copies from nested node_modules. This is the
      // durable fix for the "Yjs was already imported" constructor mismatch warning.
      // Prefer the ESM build when available.
      // Resolve the yjs package to its exported entrypoint so Node's package
      // exports map is respected. Using the package name avoids referencing
      // internal/dist subpaths which may be blocked by "exports" and cause
      // ERR_PACKAGE_PATH_NOT_EXPORTED during build-time resolution.
      yjs: require.resolve('yjs'),
      // Some packages import internal entry paths (dist/*.cjs or dist/*.mjs).
      // Canonicalize those to the hoisted package entry so webpack dedupes the runtime.
      'yjs/dist/yjs.cjs': require.resolve('yjs'),
      'yjs/dist/yjs.mjs': require.resolve('yjs'),
      // y-protocols uses path-based exports; alias the specific awareness module that we import
      'y-protocols/awareness': require.resolve('y-protocols/awareness.js'),
      // alias y-websocket to its package entry
      'y-websocket': require.resolve('y-websocket'),
    };

    // Client-side optimizations
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
      };
    }

    return config;
  },
};

export default nextConfig;
