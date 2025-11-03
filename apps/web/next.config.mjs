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
      // Exact nested pnpm paths observed in production source maps. Map them
      // back to the canonical installed files so webpack treats these as the
      // same module and doesn't inline multiple copies of the runtime.
      'node_modules/.pnpm/y-protocols@1.0.6_yjs@13.6.27/node_modules/y-protocols/dist/sync.cjs':
        require.resolve('y-protocols/dist/sync.cjs'),
      'node_modules/.pnpm/y-protocols@1.0.6_yjs@13.6.27/node_modules/y-protocols/dist/awareness.cjs':
        require.resolve('y-protocols/dist/awareness.cjs'),
      'node_modules/.pnpm/y-protocols@1.0.6_yjs@13.6.27/node_modules/y-protocols/dist/auth.cjs':
        require.resolve('y-protocols/dist/auth.cjs'),
      'node_modules/.pnpm/y-websocket@1.5.4_yjs@13.6.27/node_modules/y-websocket/dist/y-websocket.cjs':
        require.resolve('y-websocket'),
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
      // Canonicalize any y-protocols requests (including nested pnpm layouts)
      // to the installed package entry so webpack treats them as the same
      // module across different pnpm/hoisted layouts.
      config.plugins.push(
        new webpackPkg.NormalModuleReplacementPlugin(/^y-protocols(\/.*)?$/, resource => {
          // Map common y-protocols import variants to the explicit dist CJS
          // files which are guaranteed to exist in the package. Avoid
          // resolving the package root (which has no "." export) to
          // prevent ERR_PACKAGE_PATH_NOT_EXPORTED during build.
          const req = resource.request || '';
          if (req === 'y-protocols' || req === 'y-protocols/sync' || req === 'y-protocols/sync.js') {
            resource.request = require.resolve('y-protocols/dist/sync.cjs');
          } else if (req.includes('awareness')) {
            resource.request = require.resolve('y-protocols/dist/awareness.cjs');
          } else if (req.includes('auth')) {
            resource.request = require.resolve('y-protocols/dist/auth.cjs');
          } else {
            // Fallback to the sync CJS bundle.
            resource.request = require.resolve('y-protocols/dist/sync.cjs');
          }
        })
      );
      // Also rewrite the specific nested pnpm y-protocols dist paths we observed
      // in source maps back to the canonical installed dist files.
      config.plugins.push(
        new webpackPkg.NormalModuleReplacementPlugin(
          /node_modules\/\.pnpm\/y-protocols@.*\/node_modules\/y-protocols\/dist\/.*\.cjs$/,
          resource => {
            // Normalize to the package-installed dist files (sync/awareness/auth)
            // Let Node resolution pick the precise file where possible.
            // Keep the original request basename so the module resolver can
            // locate the right dist file under the package.
            const basename = resource.request.replace(/^.*dist\//, 'dist/');
            resource.request = require.resolve(`y-protocols/${basename}`);
          }
        )
      );
      // Canonicalize nested pnpm y-websocket dist path to the installed package
      config.plugins.push(
        new webpackPkg.NormalModuleReplacementPlugin(
          /node_modules\/\.pnpm\/y-websocket@.*\/node_modules\/y-websocket\/dist\/y-websocket\.cjs$/,
          resource => {
            resource.request = require.resolve('y-websocket');
          }
        )
      );
      // Canonicalize y-websocket imports to the resolved package entry too.
      config.plugins.push(
        new webpackPkg.NormalModuleReplacementPlugin(/^y-websocket$/, resource => {
          resource.request = require.resolve('y-websocket');
        })
      );
      // As a safety-net, also rewrite bare 'yjs' requests to the canonical file
      // (alias already exists above, but NormalModuleReplacementPlugin ensures
      // absolute requests are also rewritten).
      config.plugins.push(
        new webpackPkg.NormalModuleReplacementPlugin(/^yjs$/, resource => {
          // If the requesting module (issuer) is inside y-protocols or
          // y-websocket, rewrite the request to the canonical yjs ESM file
          // to avoid CJS/ESM interop causing multiple runtime instances.
          try {
            const issuer = (resource.contextInfo && resource.contextInfo.issuer) || resource.context || '';
            if (typeof issuer === 'string' && /(?:y-protocols|y-websocket)(?:[\\/]|$)/.test(issuer)) {
              resource.request = yjsEsm;
            } else {
              // If issuer info isn't available, still apply the canonical
              // rewrite as a defensive fallback.
              resource.request = yjsEsm;
            }
          } catch (e) {
            resource.request = yjsEsm;
          }
        })
      );
      // Emit external sidecar source maps instead of inline data-URIs. Some
      // vendor bundles (and server chunks) previously contained inline
      // sourceMappingURL data URIs which the duplicate detector couldn't
      // reliably parse. Force webpack to write separate `.map` sidecar files
      // so the detector can read and map generated locations back to the
      // original sources.
      if (typeof webpackPkg.SourceMapDevToolPlugin === 'function') {
        // Avoid emitting inline/sourceURL maps; use the DevTool plugin to
        // produce external files. We intentionally set config.devtool to
        // false so webpack won't fall back to an inline devtool mode.
        config.devtool = false;
        config.plugins.push(
          new webpackPkg.SourceMapDevToolPlugin({
            filename: '[file].map',
            // Keep a stable module filename template so mappings contain
            // readable webpack:// paths that the detector can resolve.
            moduleFilenameTemplate: info => `webpack:///${info.resourcePath}`,
          })
        );
      }
    } catch (e) {
      // If webpack isn't resolvable for some reason, don't crash the build here;
      // the existing resolve.alias entries are still present and will be used.
    }

    // We emit external sidecar maps via SourceMapDevToolPlugin above (when
    // webpack is available). That plugin writes usable `.map` files instead
    // of inline data URIs which improves the duplicate detector's ability
    // to trace generated locations back to original source modules.

    return config;
  },
};

export default nextConfig;
