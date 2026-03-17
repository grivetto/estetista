import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Note: We use the repository name 'estetista' as the basePath
  basePath: '/estetista',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
