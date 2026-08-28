# Novora Frontend

Next.js + React + TypeScript admin app for Novora HRMS.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Requires the backend on `http://127.0.0.1:8081` (Spring profile `local`). Next.js rewrites `/api` and `/auth` via `API_PROXY_TARGET` (default `http://127.0.0.1:8081`).

```bash
cd ../backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com) → your project → **Settings → General → Build & Development Settings**.
3. **Critical — turn off the old Vite override:**
   - **Framework Preset:** Next.js (disable override if it shows “Other” or “Vite”)
   - **Output Directory:** leave **completely empty** and **turn off Override** if the toggle is on  
     (An old value of `dist` causes: `The Next.js output directory "dist" was not found`)
   - **Build Command:** leave default (`next build`) or empty with override off
4. **Environment variables** (optional): `API_PROXY_TARGET=https://novora-backend-wiem.onrender.com`  
   (If unset, production auto-uses Render via `next.config.ts` when `VERCEL=1`.)
5. **Do not set** `NEXT_PUBLIC_API_BASE_URL`.
6. Redeploy with **Clear build cache** (Deployments → ⋯ → Redeploy → clear cache).
7. Preferred production URL: `https://novora-hrms.vercel.app` (already allowlisted in backend CORS).

### Backend checklist (Render + Neon only)

- Stack: **Vercel (UI) → Render (Spring API) → Neon (Postgres)**. No Supabase.
- Render service must be live with Neon `DB_URL` / `DB_USERNAME` / `DB_PASSWORD`.
- Confirm `https://novora-backend-wiem.onrender.com/api/auth/csrf` returns a JSON `token`.
- If the Render URL changes, update `next.config.ts` (`renderApi`) or set `API_PROXY_TARGET` on Vercel.
- CORS on Render: `APP_CORS_ADDITIONAL_ORIGIN_PATTERNS=https://novora-hrms.vercel.app`
