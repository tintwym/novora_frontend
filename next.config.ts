import type { NextConfig } from 'next'

const renderApi = 'https://novora-backend-wiem.onrender.com'

/** Local dev uses Spring on 8081; Vercel production proxies to Render. */
const apiProxyTarget =
  process.env.API_PROXY_TARGET ??
  (process.env.VERCEL ? renderApi : 'http://127.0.0.1:8081')

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
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
