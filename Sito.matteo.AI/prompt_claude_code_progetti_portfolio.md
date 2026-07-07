# Prompt per Claude Code — Sezione "Progetti" del portfolio

## Contesto
Sito portfolio statico (HTML/CSS/JS vanilla, no framework), file principali: `index.html`, `style.css`, `script.js`, `cookie-banner.js/css`. Ha già una CSP rigida in `index.html`:
```
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; form-action 'self' mailto: tel:;
```

## Obiettivo generale
Sostituire l'attuale sezione "Progetti" (che oggi ha una sola card che rimanda al repository GitHub) con **tre card di progetto**, ognuna delle quali apre un **popup modale** che mostra il progetto reale **senza mai far uscire l'utente dal sito**. Nessun redirect a domini esterni: tutto avviene dentro un overlay.

I tre progetti:
1. **Metline Chatbox** (da deployare) — popup con "mini browser" incorporato che carica l'app reale via iframe.
2. **Sito magazzino alcolico bar** (già online) — stesso meccanismo di popup con iframe.
3. **Notebook interattivo guidato** (pulizia/analisi CSV) — popup con step predefiniti: pannello codice a sinistra, pannello grafico a destra, bottone "Esegui" per avanzare.

⚠️ **IMPORTANTE — modalità di lavoro**: prima di scrivere qualsiasi codice, fai un'analisi completa dell'architettura attuale (struttura HTML/CSS/JS esistente, come sono definite le project-card, come funziona il preloader/cursor/canvas per capire eventuali conflitti z-index), esponi il piano dettagliato, e **aspetta la mia conferma esplicita prima di implementare**. Non procedere con modifiche al codice finché non confermo.

---

## Feature 1 & 2 — Popup "mini browser" per Metline Chatbox e sito magazzino

### Perché serve un accorgimento particolare
Dato che controllo io entrambi i domini/hosting di questi due progetti, possiamo far sì che i loro server rispondano con header che **autorizzano esplicitamente** l'embedding da parte del dominio del portfolio (altrimenti il browser blocca l'iframe di default). Serve intervenire su due lati:

- **Lato progetti target (Metline Chatbox e sito magazzino):**
  - Impostare `Content-Security-Policy: frame-ancestors 'self' https://<dominio-portfolio>;` (sostituisce il vecchio `X-Frame-Options`, che comunque va rimosso o allineato se presente, perché se settato a `DENY`/`SAMEORIGIN` vince e blocca comunque l'iframe).
  - Verificare che non ci siano altri meccanismi anti-framing lato JS (es. "frame-busting" script tipo `if (top !== self) top.location = self.location`).

- **Lato portfolio:**
  - Aggiornare la CSP di `index.html` aggiungendo `frame-src 'self' https://<dominio-chatbox> https://<dominio-magazzino>;` (attualmente manca del tutto, quindi gli iframe sarebbero bloccati anche lato mio).

Segnalami se preferisci che ti indichi anche le righe di config server-side (nginx/Apache/FastAPI middleware ecc. — dimmi come sono deployati i due progetti) per gli header sopra.

### Comportamento del popup
- Card cliccabile nella sezione Progetti → apre overlay modale full-screen (coerente con lo stile dark/cream del sito).
- Dentro il modale: una piccola "barra indirizzo" statica (sola lettura, mostra l'URL del progetto, non editabile — non è un vero browser, è un frame guidato) + iframe che carica l'app reale.
- Stato di caricamento (skeleton/spinner) mentre l'iframe carica.
- Pulsante chiusura (X) e chiusura anche con tasto ESC e click fuori dal modale.
- Gestione errore: se l'iframe non carica (es. progetto non ancora deployato — caso di Metline Chatbox), mostrare un messaggio elegante "Progetto in fase di deploy" invece di un iframe vuoto/rotto, con eventualmente uno screenshot statico come placeholder.
- Accessibilità minima: focus trap dentro il modale, `aria-modal="true"`, chiusura via tastiera.

---

## Feature 3 — Notebook interattivo guidato (pulizia/analisi CSV)

Ho già il codice Python di pulizia/analisi. Voglio una **sandbox guidata**, non un vero esecutore Python nel browser: step predefiniti in sequenza, ognuno con un bottone "Esegui questo step" che rivela il risultato.

### Struttura dati
Per ogni step del notebook, preparare in anticipo (offline, non a runtime):
- Il codice sorgente dello step (da mostrare con syntax highlighting, sola lettura).
- L'output visivo corrispondente: grafico già generato (immagine statica ottimizzata, es. PNG/SVG esportato da matplotlib/seaborn) oppure, se preferibile, dati già pronti da passare a una libreria di charting client-side (es. Chart.js) per un grafico "vivo" ma coi dati pre-calcolati.
- Una breve descrizione testuale di cosa fa quello step.

Questo va organizzato in un file dati (es. `notebook-steps.json`) separato dal codice del sito, così è facile aggiungere/modificare step senza toccare la logica del popup.

### Comportamento del popup
- Layout a due colonne dentro il modale: **codice a sinistra** (sola lettura, syntax highlighting via libreria leggera tipo Prism.js, caricata rispettando la CSP `script-src 'self'` — quindi va servita in self-hosting, non da CDN esterno), **output/grafico a destra**.
- Sotto/sopra: indicatore di avanzamento step (es. "Step 2 di 6") e bottone "Esegui questo step →".
- Al click: transizione (fade/slide) che rivela il grafico a destra corrispondente allo step corrente, poi abilita il passaggio allo step successivo.
- Possibilità di tornare indietro tra gli step già eseguiti.
- Nessuna esecuzione reale di codice: è chiaro fin da subito (a livello di codice, non necessariamente comunicato esplicitamente all'utente) che è una sandbox "a step guidati" con contenuti pre-calcolati.

---

## Vincoli tecnici trasversali
- Rispettare e aggiornare la CSP esistente in `index.html` per ogni nuova risorsa introdotta (font, script, iframe) — niente CDN esterni non whitelistati, preferire self-hosting delle librerie (coerente con `script-src 'self'`).
- Coerenza stilistica con il tema esistente (font Oswald/Outfit/Space Mono, palette dark/cream, cursor custom, animazioni fade-in già presenti).
- Deve funzionare sia in italiano che in inglese (il sito ha `data-i18n` per la traduzione — i nuovi testi vanno integrati nello stesso sistema).
- Mobile responsive: i tre popup devono essere usabili anche su schermi piccoli (per il notebook a due colonne, prevedere uno stack verticale sotto una certa breakpoint).

## Ordine di implementazione suggerito
1. Analisi struttura attuale + piano dettagliato (attendere mia conferma).
2. Componente modale generico riutilizzabile (base per tutti e tre i popup).
3. Popup "mini browser" (iframe) per magazzino alcolico (già online → testabile subito).
4. Stesso popup per Metline Chatbox (con placeholder finché non è deployato).
5. Popup notebook guidato con dati di esempio, poi integrazione dei miei step reali.

## Deliverable atteso da questa sessione
Non scrivere codice finché non hai esposto il piano e io non confermo. Prima analizza, poi proponi, poi implementa a step confermati uno alla volta.
