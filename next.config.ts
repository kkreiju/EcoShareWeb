import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `https://api-ecoshare.vercel.app/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

// `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
// `https://api-ecoshare.vercel.app/api/:path*`,