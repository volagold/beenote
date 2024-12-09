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
  async redirects() {
    return [
      {
        source: '/u',
        has: [
          {
            type: 'header',
            key: 'x-prerender-revalidate',
          },
        ],
        destination: '/login',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig