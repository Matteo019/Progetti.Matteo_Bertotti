"""Single-admin authentication: bcrypt-checked login, JWT kept in an httpOnly cookie."""

import hmac
import time
from collections import defaultdict, deque
from datetime import UTC, datetime, timedelta

import bcrypt
import jwt
from fastapi import Depends, HTTPException, Request, Response, status

from .config import Settings, get_settings

COOKIE_NAME = "sito_session"
ALGORITHM = "HS256"

# Brute-force guard: at most MAX_FAILURES failed logins per IP in WINDOW seconds
MAX_FAILURES = 5
WINDOW = 15 * 60
_failures: dict[str, deque[float]] = defaultdict(deque)

# Compared against when the username is wrong, so both paths cost one bcrypt check
_DUMMY_HASH = bcrypt.hashpw(b"dummy-password", bcrypt.gensalt()).decode()


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def _recent_failures(ip: str) -> deque[float]:
    attempts = _failures[ip]
    cutoff = time.monotonic() - WINDOW
    while attempts and attempts[0] < cutoff:
        attempts.popleft()
    return attempts


def check_rate_limit(ip: str) -> None:
    if len(_recent_failures(ip)) >= MAX_FAILURES:
        raise HTTPException(status.HTTP_429_TOO_MANY_REQUESTS, "Troppi tentativi, riprova tra qualche minuto")


def register_failure(ip: str) -> None:
    _recent_failures(ip).append(time.monotonic())


def reset_failures(ip: str) -> None:
    _failures.pop(ip, None)


def verify_credentials(username: str, password: str, settings: Settings) -> bool:
    if not settings.admin_password_hash:
        return False
    user_ok = hmac.compare_digest(username.encode(), settings.admin_username.encode())
    stored = settings.admin_password_hash if user_ok else _DUMMY_HASH
    try:
        pass_ok = bcrypt.checkpw(password.encode(), stored.encode())
    except ValueError:
        return False
    return user_ok and pass_ok


def issue_session(response: Response, username: str, settings: Settings) -> None:
    expires = datetime.now(UTC) + timedelta(hours=settings.session_hours)
    token = jwt.encode({"sub": username, "exp": expires}, settings.secret_key, algorithm=ALGORITHM)
    response.set_cookie(
        COOKIE_NAME,
        token,
        max_age=settings.session_hours * 3600,
        httponly=True,
        secure=settings.secure_cookie,
        samesite="strict",
        path="/api",
    )


def clear_session(response: Response, settings: Settings) -> None:
    response.delete_cookie(COOKIE_NAME, path="/api", secure=settings.secure_cookie, samesite="strict")


def current_admin(request: Request, settings: Settings = Depends(get_settings)) -> str:
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Non autenticato")
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Sessione non valida o scaduta") from None
    if payload.get("sub") != settings.admin_username:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Sessione non valida")
    return payload["sub"]
