import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "www.istockphoto.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  api: {
    bodyParser: {
      sizeLimit: "50mb", // Increased from default 1mb
    },
  },
};

export default nextConfig;
