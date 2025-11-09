// Clean, canonical Next.js configuration tuned to avoid duplicate-Yjs bundling
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const yjsEsm = (() => {
  try {
    return require.resolve('yjs');
  } catch (e) {
    return undefined;
  }
})();

// Prefer the CJS build when available to avoid ESM/CJS dual-evaluation at runtime
const yjsCjs = (() => {
  try {
    return require.resolve('yjs/dist/yjs.cjs');
  } catch (e) {
    try {
      return require.resolve('yjs');
    } catch (e2) {
      return undefined;
    }
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

    if (yjsCjs || yjsEsm) {
      // Prefer the CJS bundle if available, otherwise fall back to the package entry
      const yjsTarget = yjsCjs || yjsEsm;
      config.resolve.alias = {
        ...config.resolve.alias,
        // direct imports
        yjs: yjsTarget,
        // explicit internal paths
        'yjs/dist/yjs.mjs': yjsTarget,
        'yjs/dist/yjs.cjs': yjsTarget,
        // some consumers import deep or platform-specific entrypoints
        'yjs/yjs.cjs': yjsTarget,
        'yjs/yjs.mjs': yjsTarget,
      };
    }

    try {
      config.resolve.mainFields = Array.from(
        new Set(['module', 'browser', 'main', ...(config.resolve.mainFields || [])])
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

    config.optimization = config.optimization || {};
    config.optimization.splitChunks = config.optimization.splitChunks || {};
    config.optimization.splitChunks.cacheGroups = config.optimization.splitChunks.cacheGroups || {};

    // If webpack is available, register replacement plugins
    if (webpackPkg && typeof webpackPkg.NormalModuleReplacementPlugin === 'function') {
      config.plugins = config.plugins || [];

      config.plugins.push(
        new webpackPkg.NormalModuleReplacementPlugin(/^y-protocols(\/.*)?$/, (resource) => {
          const req = resource.request || '';
          if (req === 'y-protocols' || req === 'y-protocols/sync' || req === 'y-protocols/sync.js') {
            resource.request = require.resolve('y-protocols/dist/sync.cjs');
          } else if (req.includes('awareness')) {
            resource.request = require.resolve('y-protocols/dist/awareness.cjs');
          } else if (req.includes('auth')) {
            resource.request = require.resolve('y-protocols/dist/auth.cjs');
          } else {
            resource.request = require.resolve('y-protocols/dist/sync.cjs');
          }
        })
      );

      config.plugins.push(
        new webpackPkg.NormalModuleReplacementPlugin(
          /node_modules\/\.pnpm\/y-websocket@.*\/node_modules\/y-websocket\/dist\/y-websocket\.cjs$/,
          (resource) => {
            resource.request = require.resolve('y-websocket');
          }
        )
      );

      if (yjsCjs || yjsEsm) {
        const yjsTarget = yjsCjs || yjsEsm;
        config.plugins.push(
          new webpackPkg.NormalModuleReplacementPlugin(/^yjs$/, (resource) => {
            resource.request = yjsTarget;
          })
        );
      }

      if (typeof webpackPkg.SourceMapDevToolPlugin === 'function') {
        config.devtool = false;
        config.plugins.push(
          new webpackPkg.SourceMapDevToolPlugin({
            filename: '[file].map',
            moduleFilenameTemplate: (info) => `webpack:///${info.resourcePath}`,
          })
        );
      }
    }

    if (isServer) {
      config.devtool = 'source-map';
    }

    return config;
  },
};

export default nextConfig;
