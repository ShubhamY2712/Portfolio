/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      // Uploads from /admin (photo, resume, PDFs, project covers) go through
      // Server Actions, whose default body limit is only 1 MB.
      bodySizeLimit: "10mb",
    },
  },
  // v0 case-study URLs moved under /work in v1.0.
  async redirects() {
    return [
      { source: "/invai", destination: "/work/invai", statusCode: 301 },
      { source: "/creditsaathi", destination: "/work/creditsaathi", statusCode: 301 },
    ];
  },
};

module.exports = nextConfig;
