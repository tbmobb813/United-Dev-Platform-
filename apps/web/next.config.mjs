import { resolve } from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@udp/editor-core', '@udp/ui'],
  outputFileTracingRoot: resolve(process.cwd(), '../..'),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Force single Yjs instance to prevent "already imported" warnings
    config.resolve.alias = {
      ...config.resolve.alias,
      yjs: resolve(process.cwd(), 'node_modules/yjs')
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
  }
};

export default nextConfig;
