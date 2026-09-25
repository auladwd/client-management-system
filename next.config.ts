import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.0.100",
    "192.168.0.*",
    "192.168.*.*",
    "localhost:3000",
    "localhost:3001",
    "127.0.0.1",
  ],
};

export default nextConfig;
