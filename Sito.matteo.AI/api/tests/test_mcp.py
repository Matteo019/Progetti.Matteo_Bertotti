import json

MCP_HEADERS = {"Accept": "application/json, text/event-stream", "Content-Type": "application/json"}


def _rpc(client, method, params=None, id_=1):
    r = client.post("/mcp", headers=MCP_HEADERS, json={"jsonrpc": "2.0", "id": id_, "method": method, "params": params or {}})
    assert r.status_code == 200, r.text
    return r.json()


def _call(client, name, arguments=None):
    result = _rpc(client, "tools/call", {"name": name, "arguments": arguments or {}})["result"]
    if result.get("isError"):
        return result, result["content"][0]["text"]
    return result, json.loads(result["content"][0]["text"])


def _init(client):
    return _rpc(client, "initialize", {
        "protocolVersion": "2025-06-18",
        "capabilities": {},
        "clientInfo": {"name": "test", "version": "1"},
    })


def test_mcp_lists_read_only_tools(client):
    _init(client)
    names = {t["name"] for t in _rpc(client, "tools/list")["result"]["tools"]}
    assert names == {"get_profile", "list_projects", "list_posts", "get_post"}


def test_mcp_profile(client):
    _init(client)
    _, profile = _call(client, "get_profile")
    assert profile["headline"] == "Junior AI & Software Developer"


def test_mcp_posts_hide_drafts(admin):
    admin.post("/api/admin/posts", json={"body": "bozza segreta", "published": False})
    pub = admin.post("/api/admin/posts", json={"body": "# Ciao\nprimo post", "published": True}).json()
    draft_id = admin.get("/api/admin/posts").json()["items"][1]["id"]

    _init(admin)
    _, listing = _call(admin, "list_posts")
    assert [p["id"] for p in listing["posts"]] == [pub["id"]]

    _, full = _call(admin, "get_post", {"post_id": pub["id"]})
    assert full["body_markdown"] == "# Ciao\nprimo post"

    result, message = _call(admin, "get_post", {"post_id": draft_id})
    assert result["isError"] is True and "not found" in message


def test_mcp_rejects_foreign_host(client):
    r = client.post("/mcp", headers={**MCP_HEADERS, "Host": "evil.example"},
                    json={"jsonrpc": "2.0", "id": 1, "method": "tools/list"})
    assert r.status_code in (400, 421)


def test_llms_txt(admin):
    admin.post("/api/admin/posts", json={"body": "## Nuovo progetto\ndettagli", "published": True})
    text = admin.get("/llms.txt").text
    assert text.startswith("# Matteo Augustinho Bertotti")
    assert "/mcp" in text and "Nuovo progetto" in text
