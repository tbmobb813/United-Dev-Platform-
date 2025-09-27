import { resolve } from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Resolve the canonical yjs ESM entry point once for reuse in aliases and plugins
const yjsEsm = require.resolve('yjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emit production source maps for client bundles so we can map webpack module ids
  // (e.g. the module containing an inlined Yjs runtime) back to their original
  // source files. This is a temporary diagnostic change; it can be removed after
  // we identify the offending package/file and apply a permanent fix.
  productionBrowserSourceMaps: true,
  import { createRequire } from 'module';
  const require = createRequire(import.meta.url);

  // Minimal, robust Next.js config tuned for the monorepo.
  const yjsEsm = (() => {
    try {
      return require.resolve('yjs');
    } catch (e) {
      return undefined;
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
      config.resolve = config.resolve || {};
      config.resolve.alias = { ...(config.resolve.alias || {}) };

      if (yjsEsm) {
        config.resolve.alias = {
          ...config.resolve.alias,
          yjs: yjsEsm,
          'yjs/dist/yjs.mjs': yjsEsm,
          'yjs/dist/yjs.cjs': yjsEsm,
        };
      }

      try {
        config.resolve['mainFields'] = Array.from(new Set(['module', 'browser', 'main', ...(config.resolve.mainFields || [])]));
      } catch (e) {
        // ignore
      }

      if (!isServer) {
        config.resolve.fallback = { ...(config.resolve.fallback || {}), fs: false, path: false, crypto: false, stream: false, buffer: false, util: false };
        config.optimization = config.optimization || {};
        config.optimization.splitChunks = config.optimization.splitChunks || {};
        config.optimization.splitChunks.cacheGroups = {
          ...(config.optimization.splitChunks.cacheGroups || {}),
          'vendors-yjs': {
            test: /[\\/]node_modules[\\/]yjs[\/]/,
            name: 'vendors-yjs',
            chunks: 'all',
            enforce: true,
            priority: 100,
          },
        };
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const webpackPkg = require('webpack');
        config.plugins = config.plugins || [];
        if (yjsEsm) {
          config.plugins.push(new webpackPkg.NormalModuleReplacementPlugin(/yjs\/dist\/yjs\.(mjs|cjs)$/, (resource) => { resource.request = yjsEsm; }));
        }
        if (typeof webpackPkg.SourceMapDevToolPlugin === 'function') {
          config.devtool = false;
          config.plugins.push(new webpackPkg.SourceMapDevToolPlugin({ filename: '[file].map', moduleFilenameTemplate: (info) => `webpack:///${info.resourcePath}` }));
        }
      } catch (e) {
        // ignore
      }

      if (isServer) config.devtool = 'source-map';
      return config;
    },
  };

  export default nextConfig;
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
                  new webpackPkg.NormalModuleReplacementPlugin(/node_modules\/\.pnpm\/y-websocket@.*\/node_modules\/y-websocket\/dist\/y-websocket\.cjs$/, (resource) => {
                    resource.request = require.resolve('y-websocket');
                  })
                );

                config.plugins.push(
                  new webpackPkg.NormalModuleReplacementPlugin(/^yjs$/, (resource) => {
                    resource.request = yjsEsm;
                  })
                );

                if (typeof webpackPkg.SourceMapDevToolPlugin === 'function') {
                  config.devtool = false;
                  config.plugins.push(
                    new webpackPkg.SourceMapDevToolPlugin({
                      filename: '[file].map',
                      moduleFilenameTemplate: (info) => `webpack:///${info.resourcePath}`,
                    })
                  );
                }
              } catch (e) {
                // ignore if webpack isn't available
              }

              if (isServer) {
                config.devtool = 'source-map';
              }

              return config;
            },
          } catch(e) {
