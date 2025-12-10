# StreamSphere – Cloudflare-Powered Streaming Hub

StreamSphere is a Netflix-style streaming experience that lets trusted creators upload content directly to Cloudflare R2, stores metadata in Cloudflare D1, and serves a polished viewing experience for the audience. Only users with the admin key can ingest new content; everyone else streams from Cloudflare’s edge network.

## Features

- Curated landing page with featured hero and rich video grid
- Secure uploader flow that generates signed R2 URLs and persists metadata to D1
- Watch page with adaptive UI, poster art, tags, and playback statistics
- Tailwind CSS styling with fully responsive layout and dark cinematic theme
- Mock dataset fallback so the UI works without Cloudflare credentials

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env.local` with the following values:

```bash
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_API_TOKEN=...
CLOUDFLARE_D1_DATABASE_ID=...
CLOUDFLARE_R2_BUCKET=...
CLOUDFLARE_R2_ACCESS_KEY_ID=...
CLOUDFLARE_R2_SECRET_ACCESS_KEY=...
CLOUDFLARE_R2_PUBLIC_URL=https://<bucket>.<account>.r2.dev
UPLOAD_ADMIN_KEY=choose-a-strong-secret
```

> All Cloudflare values can be generated from the Dashboard. The API token needs D1 (read/write) and R2 (edit) permissions scoped to the same account.

### 3. Run locally

```bash
npm run dev
```

Visit http://localhost:3000 to browse and stream. Open http://localhost:3000/upload to ingest new content.

## Deployment

The project targets Vercel. After configuring environment variables in the Vercel dashboard, deploy with:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-e1ea0998
```

Verify propagation:

```bash
curl https://agentic-e1ea0998.vercel.app
```

## Tech Stack

- Next.js 14 App Router
- React 18 + Server Components
- Tailwind CSS
- Cloudflare R2 (object storage for video assets)
- Cloudflare D1 (SQLite-compatible metadata store)
- TypeScript, Zod, AWS SDK (S3 compatibility helpers)

## Folder Structure

```
app/            # Routes, layouts, pages
components/     # Reusable UI blocks
lib/            # Cloudflare integration and shared logic
public/         # Static assets (if needed)
```

## Scripts

- `npm run dev` – local development
- `npm run build` – production build
- `npm start` – start production server
- `npm run lint` – lint with ESLint / Next rules

## Security Notes

- Keep `UPLOAD_ADMIN_KEY` secret; only share with uploaders.
- R2 bucket should be public or use Cloudflare Stream if DRM is required.
- Rotate API keys regularly and scope tokens to the minimum necessary permissions.

Enjoy building your Cloudflare-backed streaming platform!
