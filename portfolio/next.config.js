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
};

module.exports = nextConfig;
