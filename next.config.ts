import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: { root: __dirname },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.obrnhomen.com" }],
        destination: "https://obrnhomen.com/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dsmcdn.com",
      },
    ],
  },
};

export default nextConfig;
