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
    // Resolve the package root and point at the published 'module' build
    // without importing subpaths directly (avoids ERR_PACKAGE_PATH_NOT_EXPORTED).
    const yjsPkg = require.resolve('yjs/package.json');
    const yjsEsm = resolve(yjsPkg, '..', 'dist', 'yjs.mjs');
    // Configure resolver to avoid pointing at non-exported package subpaths
    // (which can throw ERR_PACKAGE_PATH_NOT_EXPORTED). Map explicit dist
    // imports back to the package name so webpack's resolution can pick the
    // correct entry (module vs require) via `mainFields` instead of hardcoding
    // internal files.
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      // Map any explicit imports of internal dist files back to the package
      // so the exports map and mainFields determine the final file chosen.
      'yjs/dist/yjs.cjs': 'yjs',
      // Ensure all imports of `yjs` resolve to the ESM build so webpack
      // consistently bundles the same runtime. Point imports and the
      // package name to the hoisted ESM `yjs.mjs` entry.
      yjs: yjsEsm,
      'yjs/dist/yjs.mjs': yjsEsm,
      'yjs/dist/yjs.cjs': yjsEsm,
      // y-protocols uses path-based exports; alias the specific modules we import
      // to the canonical installed files so webpack treats them as the same
      // module across different pnpm/nested layouts.
      'y-protocols/awareness': require.resolve('y-protocols/awareness.js'),
      'y-protocols/dist/sync.cjs': require.resolve('y-protocols/dist/sync.cjs'),
      // Defensive alias for nested pnpm layout of y-protocols (matches source-map traces)
      'node_modules/.pnpm/y-protocols@1.0.6_yjs@13.6.27/node_modules/y-protocols/dist/sync.cjs':
        require.resolve('y-protocols/dist/sync.cjs'),
      // alias y-websocket to its package entry (safe to point at package entry)
      'y-websocket': require.resolve('y-websocket'),
      // Some bundlers / pnpm layouts cause imports to resolve to a nested
      // pnpm path like the one we see inside production source maps
      // (e.g. node_modules/.pnpm/yjs@13.6.27/node_modules/yjs/dist/yjs.mjs).
      // Add a defensive alias from that exact nested path string back to the
      // canonical hoisted ESM file so webpack treats these as the same module.
      'node_modules/.pnpm/yjs@13.6.27/node_modules/yjs/dist/yjs.mjs': yjsEsm,
    };

    // Prefer the ESM 'module' field during client resolution so bundlers use
    // the package's ESM build when available (this helps avoid mixing CJS
    // and ESM builds of yjs in the client bundle).
    if (!config.resolve.mainFields) {
      config.resolve.mainFields = ['module', 'browser', 'main'];
    } else {
      config.resolve.mainFields = Array.from(
        new Set(['module', 'browser', 'main', ...config.resolve.mainFields])
      );
    }

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

    // Enforce a single shared yjs chunk for both client and server bundles
    config.optimization = config.optimization || {};
    config.optimization.splitChunks = config.optimization.splitChunks || {};
    config.optimization.splitChunks.cacheGroups = {
      ...(config.optimization.splitChunks.cacheGroups || {}),
      'vendors-yjs': {
        test: /[\\/]node_modules[\\/]yjs[\\/]/,
        name: 'vendors-yjs',
        chunks: 'all',
        enforce: true,
        priority: 100,
      },
    };

    // Ensure any requests that point at nested pnpm yjs copies or direct
    // dist file imports are redirected to the canonical hoisted ESM file.
    // This uses webpack's NormalModuleReplacementPlugin which can match
    // absolute/relative request paths (including nested pnpm virtual-store
    // paths) and replace them with the single canonical module. This is a
    // minimal, targeted fix to avoid inlining multiple Yjs runtimes in the
    // client bundle.
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const webpackPkg = require('webpack');
      config.plugins = config.plugins || [];
      // Replace exact nested pnpm yjs dist paths (matches the form found in
      // production source maps: node_modules/.pnpm/yjs@.../node_modules/yjs/dist/yjs.mjs)
      config.plugins.push(
        new webpackPkg.NormalModuleReplacementPlugin(
          /node_modules\/\.pnpm\/yjs@.*\/node_modules\/yjs\/dist\/yjs\.(mjs|cjs)$/,
          resource => {
            resource.request = yjsEsm;
          }
        )
      );
      // Replace any import of the dist files (e.g. 'yjs/dist/yjs.mjs' or
      // 'yjs/dist/yjs.cjs') with the canonical ESM bundle
      config.plugins.push(
        new webpackPkg.NormalModuleReplacementPlugin(
          /yjs\/dist\/yjs\.(mjs|cjs)$/,
          resource => {
            resource.request = yjsEsm;
          }
        )
      );
      // As a safety-net, also rewrite bare 'yjs' requests to the canonical file
      // (alias already exists above, but NormalModuleReplacementPlugin ensures
      // absolute requests are also rewritten).
      config.plugins.push(
        new webpackPkg.NormalModuleReplacementPlugin(/^yjs$/, resource => {
          resource.request = yjsEsm;
        })
      );
    } catch (e) {
      // If webpack isn't resolvable for some reason, don't crash the build here;
      // the existing resolve.alias entries are still present and will be used.
    }

    // Ensure server builds emit external source maps (sidecar .map files)
    // so the duplicate detector can map generated positions back to
    // original source files. This sets webpack's devtool only for server
    // builds to keep client-side tooling unchanged (we already enable
    // productionBrowserSourceMaps above for client bundles).
    if (isServer) {
      config.devtool = 'source-map';
    }

    return config;
  },
};

export default nextConfig;
