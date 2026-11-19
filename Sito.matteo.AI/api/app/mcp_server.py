"""Read-only MCP server: lets AI assistants read my profile, projects and published posts.

Exposed over Streamable HTTP at https://matteobertotti.tech/mcp. No tool writes anything,
and drafts are never visible.
"""

from mcp.server.mcpserver import MCPServer
from mcp.server.mcpserver.exceptions import ToolError
from mcp.server.transport_security import TransportSecuritySettings
from sqlalchemy import select

from .db import SessionLocal
from .models import Post
from .profile import PROFILE, PROJECTS, SITE_URL

mcp = MCPServer(
    name="matteobertotti.tech",
    title="Matteo Augustinho Bertotti - portfolio",
    description="Profile, projects and posts of Matteo Augustinho Bertotti, Junior AI & Software Developer.",
    instructions=(
        "Read-only access to Matteo Augustinho Bertotti's portfolio. Use get_profile for experience, "
        "education, skills and contacts; list_projects for his projects; list_posts and get_post for "
        "the short Markdown posts he publishes on the site."
    ),
    website_url=SITE_URL,
    version="1.0.0",
)


def _post_dict(post: Post, full: bool = True) -> dict:
    body = post.body if full or len(post.body) <= 280 else post.body[:280] + "…"
    return {
        "id": post.id,
        "published_at": post.created_at.isoformat(),
        "body_markdown": body,
        "image_url": f"{SITE_URL}/api/uploads/{post.image}" if post.image else None,
    }


@mcp.tool()
def get_profile() -> dict:
    """Matteo's professional profile: headline, summary, experience, education, skills, languages, certifications and contacts."""
    return PROFILE


@mcp.tool()
def list_projects() -> list[dict]:
    """Matteo's portfolio projects with summary, tech stack, status and link."""
    return PROJECTS


@mcp.tool()
def list_posts(limit: int = 10, offset: int = 0) -> dict:
    """Published posts, newest first. Bodies longer than 280 characters are shortened: use get_post for the full text.

    Args:
        limit: how many posts to return (1-50)
        offset: how many of the newest posts to skip
    """
    limit = max(1, min(limit, 50))
    offset = max(0, offset)
    with SessionLocal() as db:
        posts = db.scalars(
            select(Post).where(Post.published.is_(True))
            .order_by(Post.created_at.desc(), Post.id.desc()).offset(offset).limit(limit)
        ).all()
        return {"posts": [_post_dict(p, full=False) for p in posts]}


@mcp.tool()
def get_post(post_id: int) -> dict:
    """Full Markdown text of one published post.

    Args:
        post_id: the id returned by list_posts
    """
    with SessionLocal() as db:
        post = db.get(Post, post_id)
        if post is None or not post.published:
            raise ToolError(f"Post {post_id} not found")
        return _post_dict(post)


def build_app():
    """Starlette app serving the MCP endpoint at /mcp (stateless: no session to keep per client)."""
    return mcp.streamable_http_app(
        streamable_http_path="/mcp",
        stateless_http=True,
        json_response=True,
        transport_security=TransportSecuritySettings(
            allowed_hosts=["matteobertotti.tech", "localhost:*", "127.0.0.1:*", "testserver"],
            allowed_origins=[SITE_URL, "http://localhost:*", "http://127.0.0.1:*"],
        ),
    )
