# Novora Frontend

React + TypeScript + Vite admin SPA for Novora HRMS.

## Local development

```bash
npm install
npm run dev
```

Requires the backend on `http://127.0.0.1:8081` (Spring profile `local`). Vite proxies `/api` and `/auth`.

```bash
cd ../novora_backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

## Deploy to Vercel

1. Push this repo to GitHub (`tintwym/novora_frontend`).
2. In [Vercel](https://vercel.com) → **Add New Project** → import `novora_frontend`.
3. Settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Do not set** `VITE_API_BASE_URL` (leave empty — `vercel.json` proxies `/api` to Render)
4. Edit `vercel.json` if your Render API host is not `https://novora-backend.onrender.com`.
5. Deploy. Preferred production URL: `https://novora-hrms.vercel.app` (already allowlisted in backend CORS for direct API use).

### Backend checklist

- Render service **`novora-backend`** (Spring Boot from `novora_backend` repo) must be live — not the FastAPI “Smart Finance” stub.
- Confirm `https://novora-backend.onrender.com/api/auth/csrf` returns a JSON `token`.
- If you ever call the API host directly from the browser, set on Render:
  `APP_CORS_ADDITIONAL_ORIGIN_PATTERNS=https://novora-hrms.vercel.app`
