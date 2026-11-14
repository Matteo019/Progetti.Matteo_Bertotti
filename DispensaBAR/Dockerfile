# ─────────────────────────────────────────────
# Stage 1: build Vite (le chiavi Supabase servono in fase di build)
# ─────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
RUN if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then \
      echo "ERRORE: mancano VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY nel file .env accanto a docker-compose.yaml"; \
      exit 1; \
    fi \
 && npm run build

# ─────────────────────────────────────────────
# Stage 2: serve i file statici con Nginx
# ─────────────────────────────────────────────
FROM nginx:1.27-alpine

RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# Porta interna: la espone il reverse proxy (Nginx Proxy Manager), non il router
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
