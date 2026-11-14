# ─────────────────────────────────────────────
# Stage 1: build the pages with Vite
# ─────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ─────────────────────────────────────────────
# Stage 2: Nginx serves the pages and forwards /api to the .NET backend
# ─────────────────────────────────────────────
FROM nginx:1.27-alpine

RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# Internal port: exposed by Nginx Proxy Manager, not by the router
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
