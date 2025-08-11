import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",              // static export → ./out
  images: { unoptimized: true }, // we’ll use regular <img> or unoptimized Next Image
};

export default nextConfig;
