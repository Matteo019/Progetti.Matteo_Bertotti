# Sito: struttura e deploy

```
Sito.matteo.AI/
├── frontend/      React (Vite, JavaScript): pagine, post, pannello /admin
├── api/           FastAPI + PostgreSQL: post, login admin, upload immagini, server MCP, /llms.txt
├── nginx.conf     serve la build React e inoltra /api, /mcp, /llms.txt all'API
└── docker-compose.yaml   web (nginx) + api + db, rete interna; solo "web" è su proxy-net
```

## Prima del primo deploy (una volta sola, sul server)

Il deploy fallisce, lasciando online il sito attuale, finché non esiste `Sito.matteo.AI/.env`.

1. Crea il file partendo dall'esempio:
   ```bash
   cd ~/github/Progetti.Matteo_Bertotti/Sito.matteo.AI
   cp .env.example .env
   ```
2. Genera la `SECRET_KEY`:
   ```bash
   python3 -c "import secrets; print(secrets.token_urlsafe(48))"
   ```
3. Genera l'hash della password admin (la password non viene mai salvata in chiaro). Serve `bcrypt`:
   ```bash
   pip install bcrypt && python3 api/tools/hash_password.py
   ```
   Lo script stampa la riga `ADMIN_PASSWORD_HASH=...` con i `$` già raddoppiati per Docker Compose.
4. Scegli una `POSTGRES_PASSWORD` lunga e casuale, poi `chmod 600 .env`.
5. (Facoltativo) Notifiche del modulo contatti: compila le variabili `SMTP_*` e `NOTIFY_EMAIL`.
   Senza, i messaggi vengono comunque salvati e li leggi in `/admin` → Messaggi.

Nginx Proxy Manager continua a puntare al container `backend-vetrina:80`: non serve cambiare nulla lì.

## Sviluppo in locale

```bash
# API (http://localhost:8000/api/docs)
cd api
python -m venv .venv && .venv/Scripts/pip install -r requirements-dev.txt
# serve un Postgres, oppure SQLite per provare:
DATABASE_URL=sqlite:///./dev.db SECRET_KEY=<32+ caratteri> SECURE_COOKIE=false \
ADMIN_PASSWORD_HASH='<hash>' UPLOAD_DIR=./uploads .venv/Scripts/uvicorn app.main:app --reload

# Frontend (http://localhost:5173, /api viene inoltrato all'API)
cd frontend && npm install && npm run dev
```

Test dell'API: `cd api && .venv/Scripts/python -m pytest`.

## SEO e AI

- URL canonici scritti da nginx nell'HTML di `/` e `/privacy`; `www` reindirizzato al dominio senza www.
- Gli URL che non esistono rispondono con un vero 404 (prima ogni percorso restituiva la home).
- Vecchi URL (`/index.html`, `/privacy.html`, il vecchio nome del CV) reindirizzati con 301.
- `robots.txt` e `sitemap.xml` in `frontend/public`.
- Il deploy costruisce le immagini **prima** di sostituire i container, così il sito non resta giù (5xx) durante la build.
- Server MCP in sola lettura su `https://matteobertotti.tech/mcp` (Streamable HTTP): tool `get_profile`,
  `list_projects`, `list_posts`, `get_post`. Riassunto testuale per le AI su `/llms.txt`.
  Il profilo per le AI sta in `api/app/profile.py`: va aggiornato insieme ai testi del sito e al CV.
