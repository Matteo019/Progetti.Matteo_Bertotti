from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, status
from fastapi.responses import FileResponse, PlainTextResponse
from sqlalchemy import select

from .config import get_settings
from .db import Base, SessionLocal, engine
from .images import image_path, is_valid_name
from .mcp_server import build_app as build_mcp_app
from .mcp_server import mcp
from .models import Post
from .profile import PROFILE, PROJECTS, SITE_URL
from .routers import auth, posts
from .seed import seed_posts


@asynccontextmanager
async def lifespan(_: FastAPI):
    settings = get_settings()
    if not settings.secret_key or len(settings.secret_key) < 32:
        raise RuntimeError("SECRET_KEY mancante o troppo corta (minimo 32 caratteri)")
    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    # Creates missing tables; schema changes will move to Alembic migrations
    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        seed_posts(db, settings)
    async with mcp.session_manager.run():
        yield


mcp_app = build_mcp_app()

app = FastAPI(
    title="Sito Matteo Bertotti API",
    lifespan=lifespan,
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    redoc_url=None,
)

app.include_router(auth.router)
app.include_router(posts.public)
app.include_router(posts.admin)


@app.get("/api/health", tags=["health"])
def health():
    return {"status": "ok"}


@app.get("/api/uploads/{name}", tags=["posts"])
def get_upload(name: str):
    path = image_path(name, get_settings())
    if not is_valid_name(name) or not path.is_file():
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Immagine non trovata")
    return FileResponse(path, media_type="image/webp", headers={"Cache-Control": "public, max-age=31536000, immutable"})


@app.get("/llms.txt", response_class=PlainTextResponse, tags=["ai"])
def llms_txt():
    """Plain-text summary for AI crawlers (llmstxt.org format)."""
    p = PROFILE
    lines = [
        f"# {p['name']}",
        "",
        f"> {p['headline']} based in {p['location']}. {p['summary']}",
        "",
        f"Machine-readable access: MCP server (Streamable HTTP) at {SITE_URL}/mcp "
        "with the tools get_profile, list_projects, list_posts and get_post.",
        "",
        "## Experience",
        *[f"- {e['role']}{' at ' + e['company'] if e.get('company') else ''} ({e['period']})" for e in p["experience"]],
        "",
        "## Projects",
        *[f"- {pr['name']}: {pr['summary']}{' ' + pr['url'] if pr.get('url') else ''}" for pr in PROJECTS],
        "",
        "## Skills",
        *[f"- {k.replace('_', ' / ').title()}: {', '.join(v)}" for k, v in p["skills"].items()],
        "",
        "## Contacts",
        *[f"- {k}: {v}" for k, v in p["contacts"].items()],
    ]
    with SessionLocal() as db:
        posts = db.scalars(
            select(Post).where(Post.published.is_(True)).order_by(Post.created_at.desc()).limit(10)
        ).all()
    if posts:
        lines += ["", "## Latest posts"]
        for post in posts:
            first_line = post.body.strip().splitlines()[0].lstrip("# ").strip()
            lines.append(f"- {post.created_at.date().isoformat()}: {first_line[:160]}")
    return "\n".join(lines) + "\n"


# Last: everything not matched above may be the MCP endpoint (/mcp)
app.mount("/", mcp_app)
