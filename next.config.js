/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'beenote.vercel.app',
      'raw.githubusercontent.com',
      'github.com',
      'avatars.githubusercontent.com'
    ],
  },
  experimental: {
    serverActions: true,
  }
}

module.exports = nextConfig