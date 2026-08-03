import { defineConfig, type ProxyOptions } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import type { IncomingMessage, ServerResponse } from 'node:http'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const API_PROXY_TARGET = process.env.VITE_API_PROXY_TARGET || 'https://novora-backend-56ot.onrender.com'

/** Production cookies are Secure; strip so HTTP localhost can keep the session via the Vite proxy. */
function rewriteUpstreamCookies(proxyRes: IncomingMessage) {
  const raw = proxyRes.headers['set-cookie']
  if (!raw) return
  const list = Array.isArray(raw) ? raw : [raw]
  proxyRes.headers['set-cookie'] = list.map((cookie) =>
    String(cookie)
      .replace(/;\s*Secure/gi, '')
      .replace(/;\s*Domain=[^;]*/gi, ''),
  )
}

function apiProxy(): ProxyOptions {
  return {
    target: API_PROXY_TARGET,
    changeOrigin: true,
    secure: true,
    configure: (proxy) => {
      proxy.on('proxyRes', (proxyRes: IncomingMessage, _req: IncomingMessage, _res: ServerResponse) => {
        rewriteUpstreamCookies(proxyRes)
      })
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
