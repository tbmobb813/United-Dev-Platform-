// Clean, canonical Next.js configuration tuned to avoid duplicate-Yjs bundling
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const yjsEsm = (() => {
  try {
    // Resolve to actual yjs package for consistency
    return require.resolve('yjs');
  } catch (e) {
    return undefined;
  }
})();

const webpackPkg = (() => {
  try {
    return require('webpack');
  } catch (e) {
    return null;
  }
})();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  transpilePackages: ['@udp/editor-core', '@udp/ui', '@udp/ai'],
  turbopack: {},
  typescript: { ignoreBuildErrors: true },
  webpack: (config, { isServer }) => {
    // ensure objects exist
    config.resolve = config.resolve || {};
    config.resolve.alias = { ...(config.resolve.alias || {}) };

    if (yjsEsm) {
      config.resolve.alias = {
        ...config.resolve.alias,
        yjs: yjsEsm,
        'yjs/dist/yjs.mjs': yjsEsm,
        'yjs/dist/yjs.cjs': yjsEsm,
        // DO NOT alias the singleton - it must remain separate to provide single Yjs instance
      };
    }

    try {
      config.resolve.mainFields = Array.from(
        new Set([
          'module',
          'browser',
          'main',
          ...(config.resolve.mainFields || []),
        ])
      );
    } catch (e) {
      /* ignore */
    }

    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
      };
    }

    // Only apply chunk optimization for client-side bundles
    if (!isServer) {
      config.optimization = config.optimization || {};
      config.optimization.splitChunks = config.optimization.splitChunks || {};
      config.optimization.splitChunks.cacheGroups = {
        ...(config.optimization.splitChunks.cacheGroups || {}),
        // Stronger cache group for Yjs family: match both hoisted and pnpm
        // virtual-store nested paths so webpack groups all yjs-related
        // modules into a single `vendors-yjs` chunk.
        'vendors-yjs': {
          // Use a function test to inspect the module's resource path where
          // present. This lets us match pnpm virtual-store paths like:
          // node_modules/.pnpm/yjs@13.6.27/node_modules/yjs/...
          test: (module, chunks) => {
            try {
              // Prefer resource (absolute filesystem path) when available.
              let p = module && module.resource;
              // Some modules (CJS concatenated or loader-wrapped) don't expose
              // `resource`. Fall back to nameForCondition() which often
              // contains the module path, or module.identifier().
              if (!p || typeof p !== 'string') {
                if (typeof module.nameForCondition === 'function') {
                  p = module.nameForCondition();
                }
              }
              if (!p || typeof p !== 'string') {
                if (typeof module.identifier === 'function') {
                  p = module.identifier();
                }
              }
              if (!p || typeof p !== 'string') return false;
              // Match yjs, y-protocols, y-websocket in either hoisted
              // node_modules or pnpm virtual-store nested paths.
              return /[\\/]node_modules[\\/](?:\\.pnpm[\\/].*?[\\/])?(?:yjs|y-protocols|y-websocket)(?:[\\/]|$)/.test(
                p
              );
            } catch (e) {
              return false;
            }
          },
          name: 'vendors-yjs',
          chunks: 'all',
          enforce: true,
          priority: 200,
          // Allow very small modules (like a single CJS file) to be pulled
          // into the vendors-yjs chunk and prefer reusing an existing
          // vendors-yjs chunk rather than creating a separate one.
          minSize: 0,
          reuseExistingChunk: true,
        },
      };
    }

    // If webpack is available, register replacement plugins
    if (
      webpackPkg &&
      typeof webpackPkg.NormalModuleReplacementPlugin === 'function'
    ) {
      config.plugins = config.plugins || [];

      config.plugins.push(
        new webpackPkg.NormalModuleReplacementPlugin(
          /^y-protocols(\/.*)?$/,
          resource => {
            const req = resource.request || '';
            if (
              req === 'y-protocols' ||
              req === 'y-protocols/sync' ||
              req === 'y-protocols/sync.js'
            ) {
              resource.request = require.resolve('y-protocols/dist/sync.cjs');
            } else if (req.includes('awareness')) {
              resource.request = require.resolve(
                'y-protocols/dist/awareness.cjs'
              );
            } else if (req.includes('auth')) {
              resource.request = require.resolve('y-protocols/dist/auth.cjs');
            } else {
              resource.request = require.resolve('y-protocols/dist/sync.cjs');
            }
          }
        )
      );

      config.plugins.push(
        new webpackPkg.NormalModuleReplacementPlugin(
          /node_modules\/\.pnpm\/y-websocket@.*\/node_modules\/y-websocket\/dist\/y-websocket\.cjs$/,
          resource => {
            resource.request = require.resolve('y-websocket');
          }
        )
      );

      if (yjsEsm) {
        config.plugins.push(
          new webpackPkg.NormalModuleReplacementPlugin(/^yjs$/, resource => {
            resource.request = yjsEsm;
          })
        );
      }

      if (typeof webpackPkg.SourceMapDevToolPlugin === 'function') {
        config.devtool = false;
        config.plugins.push(
          new webpackPkg.SourceMapDevToolPlugin({
            filename: '[file].map',
            moduleFilenameTemplate: info => `webpack:///${info.resourcePath}`,
          })
        );
      }
    }

    if (isServer) {
      config.devtool = 'source-map';

      // Externalize Yjs packages on the server to prevent duplicate bundling
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push({
          yjs: 'commonjs yjs',
          'y-protocols': 'commonjs y-protocols',
          'y-websocket': 'commonjs y-websocket',
          'y-indexeddb': 'commonjs y-indexeddb',
        });
      }
    }

    return config;
  },
};

export default nextConfig;
