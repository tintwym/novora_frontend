# Novora Frontend

Primary **React + TypeScript** web client for Novora HRMS. Uses the Spring Boot API (session cookies + CSRF).

## Stack

- Vite 8 + React 19 + TypeScript
- React Router 7
- Fetch API with `credentials: 'include'` (no separate token store for cookie auth)

## Local development

1. Start the API (from repo root):

   ```bash
   ./scripts/run-backend-local.sh
   ```

2. Install and run the frontend:

   ```bash
   cd novora_frontend
   npm install
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173). Vite proxies `/api`, `/auth`, and `/actuator` to `http://localhost:8081`.

### Environment

Copy `.env.example` to `.env` if you need a custom API origin:

```bash
# Empty = same-origin (dev proxy or Vercel rewrites)
VITE_API_BASE_URL=
```

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Dev server on port 5173  |
| `npm run build`| Production build         |
| `npm run preview` | Preview production build |
| `npm run lint` | Oxlint                   |

## Project layout

```
src/
  api/           # HTTP client, endpoints, auth helpers
  auth/          # AuthProvider, route guards, session cache
  components/    # App shell, sidebar, top bar
  config/        # Navigation
  pages/         # Login, dashboard, module placeholders
  types/         # Shared TypeScript types
```

## Auth flow

- **No probe on fresh visit** — `/api/v1/me` is only called when a cached user or “Remember me” exists (avoids 401 noise on the login page).
- **Login** — POST `/api/v1/auth/login` after CSRF bootstrap.
- **Logout** — POST `/auth/logout`, clear local cache.

## Deployment

See `DEPLOY.md` at the repo root. Vercel builds this package via root `vercel.json` or `novora_frontend/vercel.json`.
