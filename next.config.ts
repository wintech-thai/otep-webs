import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*', 
        destination: 'https://api-dev.otep.triple-t.co/:path*',
      },
    ]
  },
};

export default nextConfig;
