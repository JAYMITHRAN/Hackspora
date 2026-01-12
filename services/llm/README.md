# LLM Service

This FastAPI proxy isolates all interactions with the Ollama runtime so the rest of the stack treats it as a resilient black box.

## Prerequisites

- Python 3.10+
- [Ollama](https://ollama.ai/) running locally or remotely (defaults to `http://localhost:11434`)
- A downloaded model such as `llama3.2:1b`

## Features

- Automatic retries with exponential backoff before surfacing errors to the Node backend
- Optional streaming support (set `stream: true` in the request payload)
- `/health` endpoint checks the upstream Ollama runtime so the Node server can short-circuit when the model is unreachable
- `/metrics` endpoint exposes request counts, latency averages, and last error timestamps for lightweight monitoring

## Setup

```bash
cd services/llm
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # update OLLAMA_BASE_URL / retry settings if needed
```

### Configuration

Environment variable | Description | Default
---|---|---
`OLLAMA_BASE_URL` | Address of the Ollama runtime the proxy should call | `http://localhost:11434`
`LLM_HTTP_TIMEOUT` | Timeout (seconds) for upstream calls | `120`
`LLM_MAX_RETRIES` | Number of retry attempts before surfacing a 502 | `3`
`LLM_RETRY_BACKOFF_SECONDS` | Base delay (seconds); actual delay = base * attempt | `0.5`

## Run the service

Expose the proxy on `11435` so it does not conflict with the Ollama default port:

```bash
uvicorn app:app --host 0.0.0.0 --port 11435
```

Point `LLM_SERVICE_BASE_URL` in `apps/backend/.env` to `http://localhost:11435` (or the appropriate host/port). All chat/job/assessment requests will then flow through this proxy before reaching Ollama.

## Monitoring endpoints

- `GET /health` &rarr; quick status plus last success/error timestamps
- `GET /metrics` &rarr; cumulative counters (total requests, streaming requests, avg latency, failures)

Both endpoints return JSON so the Node service can poll them to detect outages.
