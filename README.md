# PixelRack

A web app that turns photos of your Hot Wheels into pixel art sprites and displays them across themed scenes: a wooden rack, a virtual garage, and a Japanese convenience store car park, for collectors who don't have shelf space to show off everything they own.

**Live site:** pixelrack.vercel.app
**API:** (add your Render URL once deployed)/api/health
**Demo video:** (link)

> Photo transformation, the step that redraws your photo as pixel art, is switched off by default in this deployment. Accounts, the collection, the rack, and both scenes all work fully. See [Demo mode](#demo-mode) below for why, and how to turn it back on.

![The PixelRack starting page](PixelRack_Documentation/screenshots/starting-page.webp)

## What it does

- Register, sign in, and keep a personal Hot Wheels collection, scoped per account
- Browse your whole collection on a wooden rack, sortable and filterable
- Place cars into themed scenes, a virtual garage and a 7-Eleven Japan car park, and trigger a small click interaction
- Upload a photo to generate a pixel-art sprite through a Gemini redraw plus a `sharp` resize step, currently switched off by default

## Built with

React and Vite on the front end, Express and PostgreSQL on the back end, with Neon Auth for accounts. The client is on Vercel, the API on Render, and the database and auth on Neon.

## Demo mode

PixelRack does not ship a client-side mock backend. Every deployment, including this one, talks to a real Express API and a real Neon Postgres database. There is no `VITE_USE_MOCK_API` switch and no `localStorage` fallback, because accounts and saved placements are the whole point of the app.

What is switched off by default instead is one expensive feature: photo transformation. `PIXELATION_ENABLED` on the server defaults to `false`, so a deployment that forgets to set it stays closed rather than open.

| `PIXELATION_ENABLED` | What happens |
|---|---|
| `false` (default) | `POST /api/cars/upload` returns `503` with `code: "FEATURE_DISABLED"` before the file is even accepted. The client reads this from `/api/config` at runtime and shows an "In Development" badge instead of pretending the button works. |
| `true` | The upload endpoint calls Gemini to redraw the photo as pixel art, then `sharp` to fit it to a 96x72 sprite. Needs `GEMINI_API_KEY` and billing enabled on the Google Cloud project. |

Everything else works with the flag off. Gemini image generation has no free tier, roughly $0.04 per upload, so leaving it off by default is what stops an open endpoint on the public internet from spending real money.

Vercel serves the client as static files and cannot run Node, so the API and the database can never live there. They go somewhere else:

| Piece | Used here |
|---|---|
| API | Render (`render.yaml` at the repo root) |
| Database and auth | Neon, Postgres plus Neon Auth |

## Running it yourself

**Prerequisites:** Node 22.18 or newer, a Neon account (free tier is enough), and the Neon CLI (`npm i -g neon@latest`).

```bash
git clone https://github.com/rxikou/Pixel-Rack.git
cd Pixel-Rack

cd client && npm install && cd ..
cd server && npm install && cd ..

neon login
neon link            # writes the repo-root .env.local
neon deploy          # provisions auth, regenerates .env.local

cp server/.env.example server/.env
cp client/.env.example client/.env
# then set VITE_NEON_AUTH_URL in client/.env to match NEON_AUTH_BASE_URL in .env.local

cd server
npx prisma migrate deploy
npx prisma generate
node prisma/seed.js   # seeds the three environments: rack, garage, konbini
cd ..
```

Two terminals:

```bash
cd server && npm run dev    # API on http://localhost:5000
cd client && npm run dev    # UI on http://localhost:5173
```

Check the API on its own before you blame the client:

```bash
curl http://localhost:5000/api/health         # is the process alive
curl http://localhost:5000/api/config         # which features are enabled
curl http://localhost:5000/api/environments   # is the database reachable
```


## Deploying

**Client, to Vercel.** `client/vercel.json` already declares the Vite framework, build command, and SPA rewrite. Two one-time steps:

1. Import the repo in Vercel with the project root set to `client`.
2. Add `VITE_API_URL` and `VITE_NEON_AUTH_URL` under the project's Environment Variables, then redeploy. Vercel redeploys automatically on every push to `main` after that, no workflow file needed.

**API, to Render.** `render.yaml` at the repo root is a Render blueprint: point Render at the repo and it reads `rootDir: server` from the file automatically. Set the variables marked `sync: false` in the file (`DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_JWKS_URL`, `CORS_ORIGINS`) in the Render dashboard, since they are not committed.

Two steps here are easy to miss and both fail confusingly:

- `CORS_ORIGINS` on the API must be set to the deployed client URL.
- The deployed client URL must be added as a trusted domain in Neon Auth, or sign-in fails with an origin error while everything else looks fine.

Full walkthrough: [`PixelRack_Documentation/deployment.md`](PixelRack_Documentation/deployment.md).

## Project structure

```
PixelRack/
├── client/                      React + Vite front end
│   └── src/
│       ├── api/                 API wrappers and the auth client
│       ├── components/          Reusable UI
│       ├── pages/                One file per route
│       └── index.css             Tailwind @theme tokens
├── server/                      Express API
│   ├── prisma/                  Schema, migrations, seed
│   └── src/
│       ├── controllers/          Request handlers
│       ├── middleware/           Auth, uploads, feature flags
│       └── routes/               Route definitions
├── PixelRack_Documentation/     Project documentation
├── render.yaml                  Render blueprint for the API
└── neon.ts                      Neon CLI project config
```

## Architecture

The React client, on Vercel, calls the Express API, on Render, over HTTPS, sending a Neon Auth JWT in the `Authorization` header on every authenticated request. The API verifies that token against Neon's JWKS endpoint, then reads and writes Postgres, on Neon, through Prisma. When `PIXELATION_ENABLED` is true, an upload also calls Gemini to redraw the photo before the API serves the result back from local disk.

## What I would do next

- Move uploaded images off local disk (`server/temp_uploads`) onto S3 or similar, since they do not survive a Render redeploy
- Write the automated tests `audit.md` calls for: Vitest and React Testing Library on the client, Jest and Supertest on the server. Neither exists yet
- Turn photo transformation back on behind a usage cap instead of leaving it fully off, so the real feature is demoable without an open-ended billing risk

## Author

Seane Karl S. Garcia. CS-401, APSI, Holy Angel University.

## Licence

MIT
