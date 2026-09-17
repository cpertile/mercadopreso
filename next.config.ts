import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "http2.mlstatic.com" },
      { protocol: "https", hostname: "http2.mlstatic.com.br" },
    ],
  },
};

export default nextConfig;
