from fastapi import APIRouter, Depends, HTTPException, Request, Response, status

from ..auth import (
    check_rate_limit,
    clear_session,
    current_admin,
    issue_session,
    register_failure,
    reset_failures,
    verify_credentials,
)
from ..config import Settings, get_settings
from ..schemas import LoginIn, Me

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=Me)
def login(data: LoginIn, request: Request, response: Response, settings: Settings = Depends(get_settings)):
    ip = request.client.host if request.client else "unknown"
    check_rate_limit(ip)
    if not verify_credentials(data.username, data.password, settings):
        register_failure(ip)
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Credenziali non valide")
    reset_failures(ip)
    issue_session(response, settings.admin_username, settings)
    return Me(username=settings.admin_username)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response, settings: Settings = Depends(get_settings)):
    clear_session(response, settings)


@router.get("/me", response_model=Me)
def me(username: str = Depends(current_admin)):
    return Me(username=username)
