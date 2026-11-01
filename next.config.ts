import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Server external packages for prisma and csv-parse
  serverExternalPackages: ["@prisma/client", "prisma", "csv-parse"],
};

export default nextConfig;
