/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  i18n: {
    locales: ['en', 'hi'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  async rewrites() {
    const backendBaseUrl = process.env.BACKEND_API_URL || 'http://localhost:5001'

    return [
      {
        source: '/api/:path*',
        destination: `${backendBaseUrl}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
