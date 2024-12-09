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
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  staticPageGenerationTimeout: 300,
  output: 'standalone'
}

module.exports = nextConfig