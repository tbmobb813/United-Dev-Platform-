import { resolve } from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@udp/editor-core', '@udp/ui'],
  webpack: (config) => {
    // Force single Yjs instance to prevent "already imported" warnings
    config.resolve.alias = {
      ...config.resolve.alias,
      yjs: resolve(process.cwd(), 'node_modules/yjs')
    };

    return config;
  }
};

export default nextConfig;
