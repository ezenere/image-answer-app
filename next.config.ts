import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb'
    }
  },
  images: {
    domains: ['upload.wikimedia.org'],
  },
};

export default nextConfig;
