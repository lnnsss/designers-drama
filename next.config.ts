import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "radika1.link"
      },
      {
        protocol: "https",
        hostname: "s1.radikal.cloud"
      },
      {
        protocol: "https",
        hostname: "kfrnqibhrcaztstryhwf.supabase.co"
      }
    ]
  }
};

export default nextConfig;
