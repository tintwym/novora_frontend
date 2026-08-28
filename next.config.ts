import type { NextConfig } from 'next'

const renderApi = 'https://novora-backend-wiem.onrender.com'

/**
 * Local dev: proxy /api and /auth to Spring on 8081.
 * Production: Vercel applies `vercel.json` rewrites to Render before Next.js runs.
 */
const apiProxyTarget = process.env.API_PROXY_TARGET ?? 'http://127.0.0.1:8081'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    // Skip external rewrites on Vercel — vercel.json handles production proxying.
    if (process.env.VERCEL) {
      return []
    }

    return [
      {
        source: '/api/:path*',
        destination: `${apiProxyTarget}/api/:path*`,
      },
      {
        source: '/auth/:path*',
        destination: `${apiProxyTarget}/auth/:path*`,
      },
    ]
  },
}

export default nextConfig
