# AI CareerPath Frontend

This package contains the Next.js application that powers the AI CareerPath user experience. It consumes the REST API exposed by the backend service and renders multi-lingual flows for assessments, job discovery, games, and resume insights.

## Tech Stack

- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS + Shadcn UI + Radix UI primitives
- i18next for translations and localized content

## Local Development

```bash
cd apps/frontend
pnpm install
cp .env.example .env.local   # if you maintain environment overrides
pnpm run dev
```

Visit `http://localhost:3000`. Update `NEXT_PUBLIC_API_BASE_URL` (if introduced) to point to the backend service.

## Build & Preview

```bash
pnpm run build
pnpm run start
```

## Linting

```bash
pnpm run lint
```

## Project Structure

- `app/` – App Router routes and layouts
- `components/` – Shared UI widgets (dashboard, gamification, chatbot, etc.)
- `lib/` – Utilities and API clients
- `public/` – Static assets and localization bundles
- `styles/` – Global CSS overrides

Refer to the monorepo README for how this package fits alongside the backend and LLM services.
