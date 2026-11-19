from io import BytesIO

from PIL import Image


def _png(size=(40, 30)) -> bytes:
    buf = BytesIO()
    Image.new("RGB", size, "green").save(buf, "PNG")
    return buf.getvalue()


def test_health(client):
    assert client.get("/api/health").json() == {"status": "ok"}


def test_login_wrong_password(client):
    r = client.post("/api/auth/login", json={"username": "admin", "password": "nope"})
    assert r.status_code == 401


def test_login_rate_limited_after_repeated_failures(client):
    for _ in range(5):
        client.post("/api/auth/login", json={"username": "admin", "password": "nope"})
    r = client.post("/api/auth/login", json={"username": "admin", "password": "correct-password"})
    assert r.status_code == 429


def test_admin_routes_require_login(client):
    assert client.get("/api/admin/posts").status_code == 401
    assert client.post("/api/admin/posts", json={"body": "x"}).status_code == 401
    assert client.get("/api/auth/me").status_code == 401


def test_session_cookie_is_httponly_and_strict(client):
    r = client.post("/api/auth/login", json={"username": "admin", "password": "correct-password"})
    cookie = r.headers["set-cookie"].lower()
    assert "httponly" in cookie and "samesite=strict" in cookie and "path=/api" in cookie


def test_tampered_session_is_rejected(client):
    client.cookies.set("sito_session", "not-a-jwt", path="/api")
    assert client.get("/api/auth/me").status_code == 401


def test_logout(admin):
    assert admin.get("/api/auth/me").json() == {"username": "admin"}
    admin.post("/api/auth/logout")
    admin.cookies.clear()
    assert admin.get("/api/auth/me").status_code == 401


def test_drafts_are_hidden_from_public(admin):
    admin.post("/api/admin/posts", json={"body": "bozza", "published": False})
    admin.post("/api/admin/posts", json={"body": "**pubblico**", "published": True})

    public = admin.get("/api/posts").json()
    assert public["total"] == 1
    assert public["items"][0]["body"] == "**pubblico**"
    assert admin.get("/api/admin/posts").json()["total"] == 2


def test_public_list_is_newest_first_and_paginated(admin):
    for i in range(3):
        admin.post("/api/admin/posts", json={"body": f"post {i}", "published": True})
    page = admin.get("/api/posts", params={"limit": 2}).json()
    assert page["total"] == 3
    assert [p["body"] for p in page["items"]] == ["post 2", "post 1"]
    rest = admin.get("/api/posts", params={"limit": 2, "offset": 2}).json()
    assert [p["body"] for p in rest["items"]] == ["post 0"]


def test_update_and_delete(admin):
    post = admin.post("/api/admin/posts", json={"body": "uno"}).json()
    r = admin.put(f"/api/admin/posts/{post['id']}", json={"body": "due", "published": True})
    assert r.status_code == 200 and r.json()["body"] == "due" and r.json()["published"] is True

    assert admin.delete(f"/api/admin/posts/{post['id']}").status_code == 204
    assert admin.put(f"/api/admin/posts/{post['id']}", json={"body": "x"}).status_code == 404


def test_body_validation(admin):
    assert admin.post("/api/admin/posts", json={"body": ""}).status_code == 422
    assert admin.post("/api/admin/posts", json={"body": "x" * 5001}).status_code == 422


def test_upload_converts_to_webp_and_is_served(admin):
    r = admin.post("/api/admin/uploads", files={"file": ("foto.png", _png(), "image/png")})
    assert r.status_code == 201
    name = r.json()["image"]
    assert name.endswith(".webp")

    img = admin.get(f"/api/uploads/{name}")
    assert img.status_code == 200 and img.headers["content-type"] == "image/webp"

    post = admin.post("/api/admin/posts", json={"body": "con foto", "image": name, "published": True})
    assert post.status_code == 201


def test_upload_rejects_non_images(admin):
    r = admin.post("/api/admin/uploads", files={"file": ("x.png", b"<script>alert(1)</script>", "image/png")})
    assert r.status_code == 400


def test_post_rejects_unknown_or_malicious_image_names(admin):
    for name in ["../../etc/passwd", "a" * 32 + ".webp"]:
        r = admin.post("/api/admin/posts", json={"body": "x", "image": name})
        assert r.status_code == 422


def test_uploads_path_traversal(client):
    assert client.get("/api/uploads/..%2F..%2Fetc%2Fpasswd").status_code == 404


def test_replacing_image_deletes_old_file(admin):
    first = admin.post("/api/admin/uploads", files={"file": ("a.png", _png(), "image/png")}).json()["image"]
    second = admin.post("/api/admin/uploads", files={"file": ("b.png", _png(), "image/png")}).json()["image"]
    post = admin.post("/api/admin/posts", json={"body": "x", "image": first}).json()
    admin.put(f"/api/admin/posts/{post['id']}", json={"body": "x", "image": second})
    assert admin.get(f"/api/uploads/{first}").status_code == 404
    assert admin.get(f"/api/uploads/{second}").status_code == 200


def test_seed_runs_only_on_empty_table(client):
    from app.config import get_settings
    from app.db import SessionLocal
    from app.seed import SEED_POSTS, seed_posts

    with SessionLocal() as db:
        assert seed_posts(db, get_settings()) == len(SEED_POSTS)
        assert seed_posts(db, get_settings()) == 0

    page = client.get("/api/posts", params={"limit": 50}).json()
    assert page["total"] == len(SEED_POSTS)
    assert "SFSCON" in page["items"][0]["body"]  # newest first
    assert "home server" in page["items"][1]["body"]
    image = page["items"][0]["image"]
    assert client.get(f"/api/uploads/{image}").status_code == 200


def test_admin_can_set_post_date(admin):
    post = admin.post("/api/admin/posts", json={"body": "vecchio", "published": True,
                                                "created_at": "2025-10-26T12:00:00+01:00"}).json()
    assert post["created_at"].startswith("2025-10-26")
    updated = admin.put(f"/api/admin/posts/{post['id']}", json={"body": "vecchio", "published": True,
                                                                 "created_at": "2025-11-01T12:00:00+01:00"}).json()
    assert updated["created_at"].startswith("2025-11-01")
