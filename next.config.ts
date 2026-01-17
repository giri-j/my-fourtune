import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  // Clerk middleware 자동 생성 방지
  transpilePackages: ['@clerk/nextjs'],
};

export default nextConfig;
