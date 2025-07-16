import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "ecomgrove-store.s3.ap-southeast-2.amazonaws.com",
      "images.unsplash.com",
      "shofy-svelte.vercel.app",
      "vn4u.vn",
      "picsum.photos",
      "loremflickr.com",
    ],
  },
};

export default nextConfig;
