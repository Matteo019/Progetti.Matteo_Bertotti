# ─────────────────────────────────────────────
# Stage 1: build the React app with Vite
# ─────────────────────────────────────────────
FROM node:24-alpine AS build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build \
    # Unknown URLs get the app shell with a real 404 status (see nginx.conf)
    && cp dist/index.html dist/404.html

# ─────────────────────────────────────────────
# Stage 2: serve it with Nginx (and forward /api to the backend)
# ─────────────────────────────────────────────
FROM nginx:1.27-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
