# AI CareerPath Backend

This Express service exposes REST endpoints that orchestrate all business logic and broker calls to the isolated LLM service.

## Available Endpoints

- `GET /health` – Basic readiness probe
- `GET /api` – Connectivity check endpoint
- `POST /api` – Accepts user profile payloads and returns structured guidance from the LLM
- `GET /api/job/:role` – Returns generated job listings for a requested role

## Environment Variables

Copy `.env.example` to `.env` and adjust values as needed.

- `PORT` – HTTP port (defaults to `5000`)
- `FRONTEND_ORIGIN` – Comma-separated list of allowed origins for CORS
- `LLM_SERVICE_BASE_URL` – Base URL of the Python LLM service (`http://localhost:11435` is the default)

## Local Development

```bash
cd apps/backend
pnpm install
cp .env.example .env
pnpm run dev
```

## Production Start

```bash
pnpm run start
```

The backend only communicates with the LLM service via HTTP, so you can swap models or hosting environments without touching the frontend.
