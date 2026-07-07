import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function assertProductionApiConfig(mode: string) {
  if (mode !== 'production') return
  const api = process.env.VITE_API_BASE_URL?.trim()
  if (!api || api === '/' || api === 'same-origin') return
  if (/^https?:\/\//i.test(api)) {
    throw new Error(
      'VITE_API_BASE_URL must be empty for production Vercel builds. ' +
        'Cross-origin API URLs break session cookies and cause 403 on login. ' +
        'Remove VITE_API_BASE_URL from Vercel Environment Variables and redeploy.',
    )
  }
  throw new Error(
    'VITE_API_BASE_URL must be empty or a full https:// URL. ' +
      'A bare hostname is treated as a relative path and breaks API calls. ' +
      'Remove VITE_API_BASE_URL on Vercel and use same-origin /api rewrites instead.',
  )
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  assertProductionApiConfig(mode)
  return {
    plugins: [tailwindcss(), react()],
    server: {
      port: 5173,
      proxy: {
        '/api': { target: 'http://localhost:8081', changeOrigin: true },
        '/auth': { target: 'http://localhost:8081', changeOrigin: true },
        '/actuator': { target: 'http://localhost:8081', changeOrigin: true },
      },
    },
  }
})
