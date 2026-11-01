import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Disable the floating Next.js "N" developer indicator badge
  devIndicators: false,
  // Server external packages for prisma and csv-parse
  serverExternalPackages: ["@prisma/client", "prisma", "csv-parse"],
};

export default nextConfig;
