# Dispensa Bar — architettura e deploy

Tutto gira sul tuo home server, senza servizi esterni:

```
Cloudflare Tunnel → Nginx Proxy Manager → dispensa-bar (Nginx: pagine + /api)
                                                └─ /api → dispensa-api (ASP.NET Core, .NET 10)
                                                              └─ dispensa-db (PostgreSQL 17)
```

- `DispensaBAR/` — frontend (HTML/CSS/JS, build con Vite). `js/api.js` parla con il backend.
- `DispensaBAR/api/Dispensa.Api/` — backend:
  - `Program.cs` — configurazione (database, cookie di login, limiti di tentativi, CSRF)
  - `Data/` — tabelle (`Entities.cs`), `AppDb.cs` (Entity Framework), account demo
  - `Endpoints/` — un file per area: auth, utenti, categorie/posizioni, prodotti, storico
- `DispensaBAR/api/Dispensa.Api.Tests/` — test automatici (`dotnet test`)

Le tabelle vengono create da sole al primo avvio (`EnsureCreated`).
Il primo utente che si registra diventa admin; gli altri restano in attesa di approvazione.

## Sviluppo in locale

```bash
cd DispensaBAR/api && dotnet run --project Dispensa.Api --urls http://localhost:5033 --Demo:Enabled=true
```

```bash
cd DispensaBAR && npm install && npm run dev
```

In locale il backend usa un file SQLite (`dispensa-dev.db`), Vite inoltra `/api` al backend.

## Una volta sola, sul server

1. **File `.env`** accanto a `docker-compose.yaml`:

   ```bash
   cd ~/github/Progetti.Matteo_Bertotti/DispensaBAR
   cp .env.example .env
   nano .env   # POSTGRES_PASSWORD lunga e casuale: openssl rand -base64 24
   ```

   Senza `.env` il workflow salta la Dispensa con un avviso, il sito viene comunque pubblicato.

2. **Primo avvio** (oppure fai un push):

   ```bash
   docker compose up -d --build
   ```

3. **Cloudflare Tunnel** — *Public Hostname* `dispensabar.matteobertotti.tech` → Nginx Proxy Manager.

4. **Nginx Proxy Manager** — *Proxy Host* `dispensabar.matteobertotti.tech` → `http` → `dispensa-bar` → porta `80`.

## Account demo (admin / admin)

Attivo di default per chi prova l'app dal portfolio. Può gestire prodotti, categorie e posizioni,
ma **non** gli utenti (non vede le email reali, non approva, non cancella, non cambia password).
Usa lo stesso database dei dati reali: se la Dispensa serve davvero a un bar, valuta di spegnerlo
con `DEMO_ENABLED=false` nel `.env` (poi `docker compose up -d`).

## Password dimenticata

Non ci sono più email: l'admin assegna una nuova password da **Admin → Utenti → Nuova password**.

## Backup del database

```bash
docker exec dispensa-db pg_dump -U dispensa dispensa > dispensa-$(date +%F).sql
```
