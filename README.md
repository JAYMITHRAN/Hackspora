# Hackspora Monorepo

The project is now organized as a modular monorepo so the frontend, backend, and LLM runtime can evolve independently while sharing a single source of truth.

## Directory Layout

| Path | Description |
| --- | --- |
| `apps/frontend` | Next.js 14 client that renders the AI CareerPath experience |
| `apps/backend` | Express API that validates input, aggregates data, and talks to the LLM service |
| `services/llm` | FastAPI wrapper around Ollama (or any compatible chat model) |

`pnpm-workspace.yaml` wires both Node services into the same dependency graph, while the Python code lives under `services/` with its own virtual environment.

## Prerequisites

- Node.js 18+
- pnpm 9+
- Python 3.10+
- Ollama with the `llama3.2:1b` model (or update the model name)

## Bootstrap Checklist

1. **Install Node dependencies**
   ```bash
   pnpm install --filter ai-careerpath-frontend
   pnpm install --filter ai-careerpath-backend
   ```
2. **Configure environment files**
   - `apps/frontend/.env.example` → `.env.local`
   - `apps/backend/.env.example` → `.env`
   - `services/llm/.env.example` → `.env`
3. **Create a Python virtual environment for the LLM service**
   ```bash
   cd services/llm
   python -m venv .venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```
4. **Run the services** (in separate terminals)
   ```bash
   # LLM proxy (defaults to port 11435)
   cd services/llm && uvicorn app:app --host 0.0.0.0 --port 11435

   # Backend API
   cd apps/backend && pnpm run dev

   # Frontend
   cd apps/frontend && pnpm run dev
   ```

Update `LLM_SERVICE_BASE_URL` in the backend `.env` to point at the LLM proxy (`http://localhost:11435`). If you expose Ollama directly, simply replace the URL.

## Deploying

Because each layer is isolated, you can deploy them separately:

- **Frontend** → Vercel, Netlify, or any static hosting that supports Next.js
- **Backend** → Node-friendly runtime (Render, Fly.io, Azure App Service, etc.)
- **LLM Service** → GPU VM, managed container, or an on-prem Ollama host

Keep the contracts between layers (REST endpoints + JSON payloads) stable to upgrade components without cross-cutting changes.
