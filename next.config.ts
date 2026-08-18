import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["mysql2", "nodemailer"],
  allowedDevOrigins: ["192.168.1.212"],
};

export default nextConfig;