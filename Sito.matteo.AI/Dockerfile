# ─────────────────────────────────────────────
# Stage unico: serve i file statici con Nginx
# ─────────────────────────────────────────────
FROM nginx:1.27-alpine

# Rimuove la pagina di default di Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia tutti i file statici nella root di Nginx
COPY index.html        /usr/share/nginx/html/
COPY privacy.html      /usr/share/nginx/html/
COPY style.css         /usr/share/nginx/html/
COPY script.js         /usr/share/nginx/html/
COPY cookie-banner.css /usr/share/nginx/html/
COPY cookie-banner.js  /usr/share/nginx/html/
COPY notebook-steps.json /usr/share/nginx/html/
COPY images/           /usr/share/nginx/html/images/
COPY vendor/           /usr/share/nginx/html/vendor/

# Espone la porta interna (Nginx ascolta sulla 80,
# ma NON la pubblichiamo verso l'esterno: ci pensa il reverse proxy)
EXPOSE 80

# Avvia Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
