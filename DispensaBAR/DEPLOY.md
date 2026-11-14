# Deploy della Dispensa sull'home server

La Dispensa gira in un container Nginx (`dispensa-bar`) sulla rete Docker `proxy-net`, come il portfolio.
Il workflow `.github/workflows/deploy.yml` la ricostruisce a ogni push su `main`.

## Una volta sola, sul server

1. **Chiavi Supabase** — accanto a `docker-compose.yaml`:

   ```bash
   cd ~/github/Progetti.Matteo_Bertotti/DispensaBAR
   cp .env.example .env
   nano .env   # VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (Supabase → Project Settings → API)
   ```

   Senza `.env` il workflow salta la Dispensa con un avviso, il sito viene comunque pubblicato.

2. **Primo avvio** (oppure fai un push):

   ```bash
   docker compose up -d --build
   ```

3. **Cloudflare Tunnel** — aggiungi un *Public Hostname* `dispensa.matteobertotti.tech` che punta a Nginx Proxy Manager
   (lo stesso servizio usato per il portfolio).

4. **Nginx Proxy Manager** — nuovo *Proxy Host*:
   - Domain: `dispensa.matteobertotti.tech`
   - Forward: `http` → `dispensa-bar` → porta `80`

5. **Supabase** → Authentication → URL Configuration:
   - *Site URL*: `https://dispensa.matteobertotti.tech`
   - *Redirect URLs*: aggiungi `https://dispensa.matteobertotti.tech/**`

   Serve per i link di conferma registrazione e di recupero password.

## Nel portfolio

Già fatto: la card in `Sito.matteo.AI/index.html` e la `frame-src` della CSP puntano a
`https://dispensa.matteobertotti.tech/`. Finché l'indirizzo non è attivo, il popup mostrerà un errore di caricamento.

## Note

- L'app usa percorsi assoluti (`/css/...`, `/js/...`): va servita alla radice di un sottodominio, non in una sottocartella.
- La anon key di Supabase finisce comunque nel JavaScript pubblicato (è pensata per questo): la sicurezza dei dati
  dipende dalle policy RLS su Supabase, non dal nasconderla.
