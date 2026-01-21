import type { NextConfig } from "next";

if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const nextConfig: NextConfig = {
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