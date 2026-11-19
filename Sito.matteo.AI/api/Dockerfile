FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

# Unprivileged user; uploads live in a volume mounted on /data/uploads
RUN useradd --system --uid 10001 api && mkdir -p /data/uploads && chown -R api /data
USER api

EXPOSE 8000
# Only the web container talks to the API (internal network), so its forwarded IP is trusted
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers", "--forwarded-allow-ips", "*"]
