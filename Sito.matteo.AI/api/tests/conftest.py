import os
import sys
import tempfile
from pathlib import Path

import bcrypt
import pytest

# Settings are read at import time, so the test environment is set up first
_tmp = Path(tempfile.mkdtemp(prefix="sito-api-tests-"))
os.environ.update(
    DATABASE_URL=f"sqlite:///{(_tmp / 'test.db').as_posix()}",
    SECRET_KEY="test-secret-key-that-is-long-enough-1234",
    ADMIN_USERNAME="admin",
    ADMIN_PASSWORD_HASH=bcrypt.hashpw(b"correct-password", bcrypt.gensalt(4)).decode(),
    SECURE_COOKIE="false",
    UPLOAD_DIR=str(_tmp / "uploads"),
)
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient  # noqa: E402

from app import auth  # noqa: E402
from app.db import Base, engine  # noqa: E402
from app.main import app  # noqa: E402


@pytest.fixture(scope="session")
def _running_app():
    # The MCP session manager can start only once per process, so the app lifespan runs once
    with TestClient(app) as c:
        yield c


@pytest.fixture
def client(_running_app):
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    auth._failures.clear()
    _running_app.cookies.clear()
    yield _running_app


@pytest.fixture
def admin(client):
    r = client.post("/api/auth/login", json={"username": "admin", "password": "correct-password"})
    assert r.status_code == 200
    return client
