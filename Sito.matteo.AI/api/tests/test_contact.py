from unittest.mock import patch

GOOD = {"name": "Mario Rossi", "email": "mario@example.com", "message": "Ciao Matteo, vorrei parlarti di un progetto."}


def test_message_is_saved_and_listed_for_admin(admin):
    assert admin.post("/api/contact", json=GOOD).status_code == 202
    inbox = admin.get("/api/admin/messages").json()
    assert inbox["unread"] == 1
    assert inbox["items"][0]["email"] == "mario@example.com"
    assert inbox["items"][0]["read"] is False


def test_inbox_requires_login(client):
    assert client.get("/api/admin/messages").status_code == 401


def test_mark_read_and_delete(admin):
    admin.post("/api/contact", json=GOOD)
    msg_id = admin.get("/api/admin/messages").json()["items"][0]["id"]
    assert admin.patch(f"/api/admin/messages/{msg_id}", json={"read": True}).json()["read"] is True
    assert admin.get("/api/admin/messages").json()["unread"] == 0
    assert admin.delete(f"/api/admin/messages/{msg_id}").status_code == 204
    assert admin.get("/api/admin/messages").json()["items"] == []


def test_validation(client):
    assert client.post("/api/contact", json={**GOOD, "email": "non-una-email"}).status_code == 422
    assert client.post("/api/contact", json={**GOOD, "email": "a@b.it\nBcc: x@y.z"}).status_code == 422
    assert client.post("/api/contact", json={**GOOD, "message": "corto"}).status_code == 422
    assert client.post("/api/contact", json={**GOOD, "name": ""}).status_code == 422


def test_honeypot_pretends_success_but_stores_nothing(admin):
    assert admin.post("/api/contact", json={**GOOD, "website": "http://spam"}).status_code == 202
    assert admin.get("/api/admin/messages").json()["items"] == []


def test_rate_limit(client):
    for _ in range(5):
        assert client.post("/api/contact", json=GOOD).status_code == 202
    assert client.post("/api/contact", json=GOOD).status_code == 429


def test_email_notification_only_when_configured(client):
    with patch("app.routers.contact.smtplib.SMTP") as smtp:
        client.post("/api/contact", json=GOOD)
        smtp.assert_not_called()


def test_email_notification_sent_when_configured(client):
    from app.config import get_settings
    settings = get_settings()
    settings.smtp_host, settings.notify_email = "smtp.example.com", "me@example.com"
    try:
        with patch("app.routers.contact.smtplib.SMTP") as smtp:
            client.post("/api/contact", json=GOOD)
            sent = smtp.return_value.send_message.call_args[0][0]
            assert sent["Reply-To"] == "mario@example.com"
            assert "vorrei parlarti" in sent.get_content()
    finally:
        settings.smtp_host, settings.notify_email = "", ""
