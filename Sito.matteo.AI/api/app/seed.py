"""First posts of the site, inserted once when the posts table is still empty.

After that the posts live only in the database and are managed from /admin:
editing this file does not change posts that already exist.
"""

import shutil
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from .config import Settings
from .models import Post

SEED_IMAGES = Path(__file__).parent / "seed_images"


def _at(year: int, month: int, day: int, utc_offset: int) -> datetime:
    """Noon, Italian time (offset +1 in winter, +2 in summer: no tz database needed in the slim image)."""
    return datetime(year, month, day, 12, 0, tzinfo=timezone(timedelta(hours=utc_offset)))


SEED_POSTS = [
    {
        "created_at": _at(2025, 10, 26, 1),
        "body": (
            "## Si parte! 🎓\n\n"
            "Oggi inizia il mio percorso all'**ITS Digital Academy \"Mario Volpato\"** nel corso "
            "*Artificial Intelligence Developer and Data Analyst*.\n\n"
            "Sono contentissimo di intraprendere questa strada: due anni per imparare a costruire "
            "software e soluzioni con l'Intelligenza Artificiale. Non vedo l'ora di cominciare! 🚀"
        ),
    },
    {
        "created_at": _at(2026, 2, 10, 1),
        "body": (
            "## 🎮 ITSCyberGame 2026 | La nostra squadra in azione 🎮\n\n"
            "Stiamo partecipando all'ITSCyberGame organizzato da "
            "[Fondazione Edulife ETS](https://www.linkedin.com/company/fondazione-edulife/) e "
            "[Cybersecurity National Lab](https://www.linkedin.com/company/cybersecnatlab/), "
            "una competizione di team che mette alla prova problem solving e collaborazione.\n\n"
            "Per presentare la nostra squadra in modo diverso, ho creato un video usando:\n"
            "- Canva per l'editing\n"
            "- AI tools per generazione e animazione degli avatar\n"
            "- Sperimentazione con colori e sound design\n\n"
            "L'obiettivo? Mostrare che dietro le competenze tecniche ci sono persone creative che sanno "
            "lavorare insieme. Ogni membro del team porta qualcosa di unico, e questo video è il mio modo "
            "di celebrare quello che stiamo costruendo.\n\n"
            "Nello sviluppo software, saper comunicare un'idea in modo chiaro conta quanto saper scrivere codice. "
            "Anche se la cybersecurity non è il mio campo principale, esperienze come questa sviluppano soft "
            "skills essenziali: teamwork, pensiero laterale e capacità di adattarsi a contesti nuovi.\n\n"
            "In bocca al lupo a noi! 🚀"
        ),
    },
    {
        "created_at": _at(2026, 6, 15, 2),
        "body": (
            "## Nuovo inizio in Metline! 💼\n\n"
            "Sono stato assunto da **Metline** (Gruppo Maestrale) e sono contentissimo di iniziare questo "
            "percorso di apprendistato.\n\n"
            "Non vedo l'ora di mettere in pratica tutto ciò che ho imparato in questo primo anno di ITS."
        ),
    },
    {
        "created_at": _at(2026, 8, 3, 2),
        "image_file": "homeserver.webp",
        "body": (
            "## Il mio sito ora gira sul mio server 🖥️\n\n"
            "Da oggi questo portfolio non è più su Netlify: è ospitato su un **home server Linux** "
            "che ho configurato da zero.\n\n"
            "- **Ubuntu Server** con i servizi isolati in container **Docker**\n"
            "- **Deploy automatico** con GitHub Actions e un runner self-hosted: a ogni push su `main` "
            "il sito si ricostruisce e va online da solo\n"
            "- **Cloudflare Tunnel** per esporlo su internet senza aprire porte sul router\n"
            "- **Tailscale** e chiavi SSH per gestirlo da remoto in sicurezza\n\n"
            "Una bella palestra di Linux, networking e CI/CD: ogni volta che aprite questa pagina, "
            "la state chiedendo a una macchina che sta a casa mia 😄"
        ),
    },
    {
        "created_at": _at(2026, 11, 13, 1),
        "image_file": "sfscon-2026.webp",
        "body": (
            "## SFSCON 2026 al NOI Techpark 🐧\n\n"
            "Giornata super stimolante alla **SFSCON** (South Tyrol Free Software Conference) al NOI Techpark "
            "insieme ai miei compagni dell'ITS Digital Academy \"Mario Volpato\"!\n\n"
            "Oltre ai talk principali (come quello molto interessante di Mozilla.ai sulla governance e la "
            "trasparenza dei dati nell'IA), la parte migliore è stata confrontarsi direttamente con i team negli "
            "stand sulle loro architetture software, soluzioni AI e progetti Open Source.\n\n"
            "Uscire dall'aula e parlare faccia a faccia con chi sviluppa queste tecnologie sul campo è sempre il "
            "modo migliore per crescere. Grazie all'ITS per l'opportunità!"
        ),
    },
]


def seed_posts(db: Session, settings: Settings) -> int:
    """Inserts SEED_POSTS if there are no posts yet; returns how many were added."""
    if db.scalar(select(func.count()).select_from(Post)):
        return 0

    for item in SEED_POSTS:
        image = None
        if item.get("image_file"):
            image = f"{uuid.uuid4().hex}.webp"
            settings.upload_dir.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(SEED_IMAGES / item["image_file"], settings.upload_dir / image)
        db.add(Post(body=item["body"], image=image, published=True, created_at=item["created_at"]))
    db.commit()
    return len(SEED_POSTS)
