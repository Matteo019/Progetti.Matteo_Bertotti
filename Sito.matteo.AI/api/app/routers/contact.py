"""Contact form: public submit, admin inbox, optional email notification."""

import logging
import smtplib
import time
from collections import defaultdict, deque
from email.message import EmailMessage

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..auth import current_admin
from ..config import Settings, get_settings
from ..db import get_db
from ..models import ContactMessage
from ..schemas import ContactIn, ContactOut, ContactPage, ReadIn

log = logging.getLogger(__name__)

public = APIRouter(prefix="/api/contact", tags=["contact"])
admin = APIRouter(prefix="/api/admin/messages", tags=["admin"], dependencies=[Depends(current_admin)])

# At most MAX_PER_WINDOW messages per IP every WINDOW seconds (kept in memory, IP never stored)
MAX_PER_WINDOW = 5
WINDOW = 60 * 60
_sent: dict[str, deque[float]] = defaultdict(deque)


def _allow(ip: str) -> bool:
    now = time.monotonic()
    times = _sent[ip]
    while times and times[0] < now - WINDOW:
        times.popleft()
    if len(times) >= MAX_PER_WINDOW:
        return False
    times.append(now)
    return True


def notify_by_email(msg: ContactOut, settings: Settings) -> None:
    """Emails a copy of the message, if SMTP is configured. Failures are logged, never shown to the visitor."""
    if not (settings.smtp_host and settings.notify_email):
        return
    mail = EmailMessage()
    mail["Subject"] = "Nuovo messaggio dal sito"
    mail["From"] = settings.smtp_from or settings.smtp_user or settings.notify_email
    mail["To"] = settings.notify_email
    # The address is validated (no spaces or newlines), so it is safe as a header
    mail["Reply-To"] = msg.email
    mail.set_content(f"Da: {msg.name} <{msg.email}>\n\n{msg.message}\n")
    try:
        if settings.smtp_port == 465:
            server = smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, timeout=15)
        else:
            server = smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15)
            server.starttls()
        with server:
            if settings.smtp_user:
                server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(mail)
    except (smtplib.SMTPException, OSError):
        log.exception("Invio email di notifica non riuscito (il messaggio è comunque salvato)")


@public.post("", status_code=status.HTTP_202_ACCEPTED)
def send_message(
    data: ContactIn,
    request: Request,
    background: BackgroundTasks,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
):
    # A bot filled in the hidden field: answer as if it worked, store nothing
    if data.website:
        return {"status": "ok"}

    ip = request.client.host if request.client else "unknown"
    if not _allow(ip):
        raise HTTPException(status.HTTP_429_TOO_MANY_REQUESTS, "Troppi messaggi, riprova più tardi")

    msg = ContactMessage(name=data.name.strip(), email=data.email.strip(), message=data.message.strip())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    background.add_task(notify_by_email, ContactOut.model_validate(msg), settings)
    return {"status": "ok"}


@admin.get("", response_model=ContactPage)
def list_messages(db: Session = Depends(get_db)):
    items = db.scalars(select(ContactMessage).order_by(ContactMessage.created_at.desc(), ContactMessage.id.desc())).all()
    unread = db.scalar(select(func.count()).select_from(ContactMessage).where(ContactMessage.read.is_(False))) or 0
    return ContactPage(items=items, unread=unread)


@admin.patch("/{message_id}", response_model=ContactOut)
def mark_read(message_id: int, data: ReadIn, db: Session = Depends(get_db)):
    msg = db.get(ContactMessage, message_id)
    if msg is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Messaggio non trovato")
    msg.read = data.read
    db.commit()
    db.refresh(msg)
    return msg


@admin.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message(message_id: int, db: Session = Depends(get_db)):
    msg = db.get(ContactMessage, message_id)
    if msg is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Messaggio non trovato")
    db.delete(msg)
    db.commit()
