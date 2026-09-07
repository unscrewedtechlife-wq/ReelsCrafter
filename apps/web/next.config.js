/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "commondatastorage.googleapis.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "assets.viewmax.ai" },
      { protocol: "https", hostname: "cdn.viewmax.ai" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    return [{ source: "/api/:path*", destination: `${apiUrl}/api/:path*` }];
  },
};

module.exports = nextConfig;
