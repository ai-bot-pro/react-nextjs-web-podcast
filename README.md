<div align="center">
    <img src="./public/an_AI_podcast_1400.jpg" alt="AI Podcast">
</div>

# AI Podcast (Web)

**Languages:** [English](README.md) | [简体中文](README_CN.md)

- [Apple Podcasts — AI Podcast](https://podcasts.apple.com/us/podcast/ai-podcast/id1798858172)

## Overview

A [Next.js](https://nextjs.org/) site for browsing and playing **AI-generated podcast** episodes. Episode metadata and listings are served from **Cloudflare D1**; audio and artwork URLs typically point to **R2** (or other HTTPS hosts). Content can originate from PDFs, web pages, text, images, audio, and video, then be turned into podcasts via multimodal or chained LLM pipelines.

To **generate** episodes and maintain the publishing pipeline, use the companion repo: [github.com/ai-bot-pro/podcast](https://github.com/ai-bot-pro/podcast.git) (or the `podcast/` package in this monorepo, if you use it locally).

## Features

- Home page with latest episodes, pagination, and an in-page audio player  
- Episode detail route: `/podcast/[pid]`  
- RSS feed: `/api/rss` (fetches a hosted `rss.xml` when available, otherwise builds a feed from D1)  
- Edge route handlers (`runtime = 'edge'`) for low-latency API responses on Cloudflare Pages  

## Tech stack

- Next.js 15, React 18, TypeScript, Tailwind CSS  
- Deploy target: [Cloudflare Pages](https://pages.cloudflare.com/) with [`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages)  
- **D1** binding `PODCAST_DB` for the `podcast` table  
- **R2** binding `PODCAST_BUCKET` in `wrangler.toml` (reserved for assets; URLs in DB may already point at public R2 URLs)  

## Prerequisites

- Node.js 18.18+ (recommended for Next.js 15)  
- npm, pnpm, or yarn  
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) (installed locally via devDependencies) and a Cloudflare account for production deploy  

## Getting started

Install dependencies:

```bash
npm install
```

### Cloudflare bindings (`wrangler.toml`)

1. Create (or select) a **D1** database and an **R2** bucket in the Cloudflare dashboard.  
2. Update `wrangler.toml`: set `database_id` for `PODCAST_DB` and align `bucket_name` / bindings with your account.  
3. In the Pages project settings, attach the same **D1** and **R2** bindings so production matches local config.  
4. After changing bindings, regenerate types:

```bash
npm run cf-typegen
```

### Local D1 schema and sample data

The file [`data/podcast.sql`](data/podcast.sql) defines the `podcast` table and includes sample rows. Comments at the top show how to apply it to a **local** D1 database with Wrangler, for example:

```bash
npx wrangler d1 execute podcast_hub --local --file=./data/podcast.sql
```

Adjust the database name to match your `wrangler.toml` (`database_name`).

### Development server

This project uses `setupDevPlatform()` from `@cloudflare/next-on-pages` in [`next.config.mjs`](next.config.mjs) so D1 and other bindings can be used during `next dev`. See the [recommended dev workflow](https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md#recommended-development-workflow) and periodically run **preview** (below) to validate the Pages build.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Pages build and local preview

```bash
npm run pages:build
npm run preview
```

`preview` runs `pages:build` then `wrangler pages dev` against the build output.

## npm scripts

| Script | Description |
|--------|-------------|
| `dev` | Next.js development server with Cloudflare dev bindings |
| `build` | Standard Next.js production build |
| `start` | Start Next.js server (Node deployment; not the primary path for Pages) |
| `lint` | Run ESLint |
| `pages:build` | Build for Cloudflare Pages via `@cloudflare/next-on-pages` |
| `preview` | `pages:build` + `wrangler pages dev` |
| `deploy` | Download `rss.xml` into `public/`, then `pages:build`, then `wrangler pages deploy` |
| `rss-xml` | `wget` remote `rss.xml` into `public/rss.xml` (used by `deploy`) |
| `cf-typegen` | Generate `env.d.ts` from `wrangler.toml` (`CloudflareEnv`) |

## API routes

| Method / path | Purpose |
|---------------|---------|
| `POST /api/get-latest-podcasts` | JSON body: `{ "page": number, "limit": number }` — paginated published episodes from D1 |
| `GET /api/get-podcast?id=<pid>` | Single episode by `pid` |
| `GET /api/rss` | RSS XML (proxy or D1 fallback) |

The `/rss` page redirects to `/api/rss`.

## Deploy to Cloudflare Pages

1. Ensure `wrangler.toml` and dashboard bindings match (D1, R2).  
2. Run:

```bash
npm run deploy
```

This refreshes `public/rss.xml` from the configured URL, builds with `next-on-pages`, and deploys via Wrangler. Set Pages project name / account as required by your Wrangler login.

## Project layout (high level)

- `src/app/` — App Router pages and route handlers  
- `src/components/` — UI including player and cards  
- `src/models/podcast.ts` — D1 queries  
- `data/podcast.sql` — Schema and optional seed data for local D1  

---

Bootstrapped with Cloudflare [`c3`](https://developers.cloudflare.com/pages/get-started/c3) for Next.js on Pages.
