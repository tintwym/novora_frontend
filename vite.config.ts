import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const API_PROXY_TARGET = process.env.VITE_API_PROXY_TARGET || 'https://novora-backend-56ot.onrender.com'

/** Production cookies are Secure; strip so HTTP localhost can keep the session via the Vite proxy. */
function rewriteUpstreamCookies(proxyRes: { headers: Record<string, unknown> }) {
  const raw = proxyRes.headers['set-cookie']
  if (!raw) return
  const list = Array.isArray(raw) ? raw : [raw]
  proxyRes.headers['set-cookie'] = list.map((cookie) =>
    String(cookie)
      .replace(/;\s*Secure/gi, '')
      .replace(/;\s*Domain=[^;]*/gi, ''),
  )
}

function apiProxy() {
  return {
    target: API_PROXY_TARGET,
    changeOrigin: true,
    secure: true,
    configure: (proxy: { on: (event: string, fn: (...args: never[]) => void) => void }) => {
      proxy.on('proxyRes', rewriteUpstreamCookies as (...args: never[]) => void)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // Same-origin cookie sessions in local dev (JSESSIONID + XSRF-TOKEN).
      '/api': apiProxy(),
      '/auth': apiProxy(),
    },
  },
})
