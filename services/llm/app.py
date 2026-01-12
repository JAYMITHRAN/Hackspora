"""FastAPI service that proxies chat requests to the configured Ollama runtime."""
from __future__ import annotations

import asyncio
import json
import os
import time
from datetime import datetime, timezone
from typing import Any, AsyncGenerator, Dict, List, Literal, Optional

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

load_dotenv()

app = FastAPI(title="AI CareerPath LLM Service")

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
HTTP_TIMEOUT = float(os.getenv("LLM_HTTP_TIMEOUT", "120"))
MAX_RETRIES = int(os.getenv("LLM_MAX_RETRIES", "3"))
RETRY_BACKOFF_SECONDS = float(os.getenv("LLM_RETRY_BACKOFF_SECONDS", "0.5"))

_http_client: Optional[httpx.AsyncClient] = None
_metrics_lock = asyncio.Lock()
_service_start = time.perf_counter()
_metrics: Dict[str, Any] = {
    "requests_total": 0,
    "requests_streaming": 0,
    "success_total": 0,
    "failure_total": 0,
    "total_latency_ms": 0.0,
    "avg_latency_ms": 0.0,
    "last_error": None,
    "last_error_at": None,
    "last_success_at": None,
}


def _utc_timestamp() -> str:
    return datetime.now(timezone.utc).isoformat()


async def _register_attempt(streaming: bool) -> None:
    async with _metrics_lock:
        _metrics["requests_total"] += 1
        if streaming:
            _metrics["requests_streaming"] += 1


async def _record_success(latency_ms: float) -> None:
    async with _metrics_lock:
        _metrics["success_total"] += 1
        _metrics["total_latency_ms"] += latency_ms
        successes = max(_metrics["success_total"], 1)
        _metrics["avg_latency_ms"] = _metrics["total_latency_ms"] / successes
        _metrics["last_success_at"] = _utc_timestamp()


async def _record_failure(message: str) -> None:
    async with _metrics_lock:
        _metrics["failure_total"] += 1
        _metrics["last_error"] = message
        _metrics["last_error_at"] = _utc_timestamp()


async def _get_client() -> httpx.AsyncClient:
    if _http_client is None:
        raise HTTPException(status_code=503, detail="HTTP client not initialized")
    return _http_client


@app.on_event("startup")
async def _startup() -> None:
    global _http_client
    _http_client = httpx.AsyncClient(timeout=httpx.Timeout(HTTP_TIMEOUT))


@app.on_event("shutdown")
async def _shutdown() -> None:
    global _http_client
    if _http_client is not None:
        await _http_client.aclose()
        _http_client = None


class Message(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    model: str = Field(..., description="Ollama model identifier")
    messages: List[Message]
    stream: bool = False
    options: Optional[Dict[str, Any]] = None


async def _proxy_stream(response: httpx.Response, start_time: float) -> StreamingResponse:
    async def iterator() -> AsyncGenerator[bytes, None]:
        try:
            async for chunk in response.aiter_bytes():
                yield chunk
            latency_ms = (time.perf_counter() - start_time) * 1000
            await _record_success(latency_ms)
        except Exception as exc:  # pragma: no cover - defensive logging hook
            await _record_failure(f"Streaming interrupted: {exc}")
            raise
        finally:
            await response.aclose()

    return StreamingResponse(iterator(), media_type="application/json")


@app.post("/api/chat")
async def chat(request: ChatRequest) -> Any:
    """Forward chat requests to Ollama with retries, streaming, and metrics."""

    await _register_attempt(request.stream)
    payload = request.model_dump(exclude_none=True)
    payload["stream"] = request.stream

    client = await _get_client()
    last_error = "Unable to reach upstream LLM"

    for attempt in range(1, MAX_RETRIES + 1):
        start_time = time.perf_counter()
        response: Optional[httpx.Response] = None
        try:
            response = await client.stream(
                "POST",
                f"{OLLAMA_BASE_URL}/api/chat",
                json=payload,
            )
            response.raise_for_status()

            if request.stream:
                return await _proxy_stream(response, start_time)

            await response.aread()
            data = response.json()
            await response.aclose()
            latency_ms = (time.perf_counter() - start_time) * 1000
            await _record_success(latency_ms)
            return data
        except (httpx.RequestError, httpx.HTTPStatusError, json.JSONDecodeError) as exc:
            last_error = f"Upstream error: {exc}"
        finally:
            if response is not None and response.is_closed is False and not request.stream:
                await response.aclose()

        if attempt < MAX_RETRIES:
            await asyncio.sleep(RETRY_BACKOFF_SECONDS * attempt)
            continue

        await _record_failure(last_error)
        raise HTTPException(status_code=502, detail=last_error)


async def _ping_upstream() -> bool:
    try:
        client = await _get_client()
    except HTTPException:
        return False

    try:
        response = await client.get(f"{OLLAMA_BASE_URL}/health", timeout=5.0)
        response.raise_for_status()
        return True
    except httpx.HTTPError:
        try:
            response = await client.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5.0)
            response.raise_for_status()
            return True
        except httpx.HTTPError:
            return False


@app.get("/health")
async def health() -> Dict[str, Any]:
    upstream_ok = await _ping_upstream()
    async with _metrics_lock:
        snapshot = {k: v for k, v in _metrics.items() if k != "total_latency_ms"}
    snapshot.update(
        {
            "status": "ok" if upstream_ok else "degraded",
            "upstream": "available" if upstream_ok else "unreachable",
            "uptime_seconds": round(time.perf_counter() - _service_start, 2),
            "upstream_base_url": OLLAMA_BASE_URL,
        }
    )
    return snapshot


@app.get("/metrics")
async def metrics() -> Dict[str, Any]:
    async with _metrics_lock:
        snapshot = dict(_metrics)
    snapshot.update(
        {
            "uptime_seconds": round(time.perf_counter() - _service_start, 2),
            "upstream_base_url": OLLAMA_BASE_URL,
        }
    )
    return snapshot
