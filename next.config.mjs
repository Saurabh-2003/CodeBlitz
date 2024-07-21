/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "leetcode.com",
      },
    ],
  },
};

export default nextConfig;
