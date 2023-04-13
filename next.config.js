/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    API_KEY: process.env.NEXT_PUBLIC_API_KEY,
    SOCKET: process.env.NEXT_PUBLIC_SOCKET,
  },
};

module.exports = nextConfig;
