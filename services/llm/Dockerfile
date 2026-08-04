FROM python:3.11-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1

COPY services/llm/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY services/llm .

EXPOSE 11435

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "11435"]