"""API для статей журнала и сохранений пользователей"""
import json
import os
import re
import psycopg2
from datetime import datetime

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Authorization",
}

def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def json_response(data, status=200):
    return {"statusCode": status, "headers": {**CORS_HEADERS, "Content-Type": "application/json"}, "body": json.dumps(data, ensure_ascii=False, default=str)}

def error(msg, status=400):
    return json_response({"error": msg}, status)

def get_user_from_token(event):
    import jwt as pyjwt
    auth = event.get("headers", {}).get("X-Authorization", "")
    if not auth.startswith("Bearer "):
        return None
    token = auth[7:]
    payload = pyjwt.decode(token, os.environ["JWT_SECRET"], algorithms=["HS256"])
    return payload

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    text = re.sub(r"^-+|-+$", "", text)
    return text[:80] + "-" + datetime.now().strftime("%Y%m%d%H%M%S")

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    action = (event.get("queryStringParameters") or {}).get("action", "")
    method = event.get("httpMethod", "GET")
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    # GET /articles — список опубликованных статей из БД
    if action == "list" and method == "GET":
        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
            SELECT a.id, a.slug, a.title, a.lead, a.category, a.image_url,
                   a.read_time, a.published_at, u.name as author_name
            FROM articles_db a
            JOIN users u ON a.author_id = u.id
            WHERE a.status = 'published'
            ORDER BY a.published_at DESC
        """)
        rows = cur.fetchall()
        cols = ["id","slug","title","lead","category","image_url","read_time","published_at","author_name"]
        articles = [dict(zip(cols, r)) for r in rows]
        conn.close()
        return json_response({"articles": articles})

    # GET /article?slug=xxx — одна статья
    if action == "get" and method == "GET":
        slug = (event.get("queryStringParameters") or {}).get("slug", "")
        if not slug:
            return error("slug required")
        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
            SELECT a.id, a.slug, a.title, a.lead, a.category, a.image_url,
                   a.content, a.read_time, a.published_at, u.name as author_name, u.avatar_url
            FROM articles_db a
            JOIN users u ON a.author_id = u.id
            WHERE a.slug = %s AND a.status = 'published'
        """, (slug,))
        row = cur.fetchone()
        conn.close()
        if not row:
            return error("not found", 404)
        cols = ["id","slug","title","lead","category","image_url","content","read_time","published_at","author_name","author_avatar"]
        return json_response({"article": dict(zip(cols, row))})

    # POST /save — сохранить статью
    if action == "save" and method == "POST":
        user = get_user_from_token(event)
        if not user:
            return error("unauthorized", 401)
        slug = body.get("slug")
        if not slug:
            return error("slug required")
        conn = get_db()
        cur = conn.cursor()
        cur.execute("INSERT INTO saved_articles (user_id, article_slug) VALUES (%s, %s) ON CONFLICT DO NOTHING", (user["sub"], slug))
        conn.commit()
        conn.close()
        return json_response({"ok": True})

    # POST /unsave — убрать из сохранённых
    if action == "unsave" and method == "POST":
        user = get_user_from_token(event)
        if not user:
            return error("unauthorized", 401)
        slug = body.get("slug")
        conn = get_db()
        cur = conn.cursor()
        cur.execute("UPDATE saved_articles SET user_id = user_id WHERE user_id = %s AND article_slug = %s", (user["sub"], slug))
        conn.commit()
        conn.close()
        return json_response({"ok": True})

    # GET /saved — список сохранённых
    if action == "saved" and method == "GET":
        user = get_user_from_token(event)
        if not user:
            return error("unauthorized", 401)
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT article_slug FROM saved_articles WHERE user_id = %s ORDER BY saved_at DESC", (user["sub"],))
        rows = cur.fetchall()
        conn.close()
        return json_response({"slugs": [r[0] for r in rows]})

    # POST /publish — создать/сохранить статью
    if action == "publish" and method == "POST":
        user = get_user_from_token(event)
        if not user:
            return error("unauthorized", 401)
        title = body.get("title", "").strip()
        if not title:
            return error("title required")
        slug = slugify(title)
        lead = body.get("lead", "")
        category = body.get("category", "Традиции")
        image_url = body.get("image_url", "")
        content = body.get("content", [])
        status = body.get("status", "draft")
        read_time = max(1, len(json.dumps(content)) // 1000)
        if status not in ("draft", "pending", "published"):
            status = "draft"
        published_at = datetime.now() if status == "published" else None

        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO articles_db (author_id, slug, title, lead, category, image_url, content, status, read_time, published_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, slug
        """, (user["sub"], slug, title, lead, category, image_url, json.dumps(content), status, read_time, published_at))
        row = cur.fetchone()
        conn.commit()
        conn.close()
        return json_response({"id": row[0], "slug": row[1]})

    # PUT /update — обновить статью
    if action == "update" and method == "PUT":
        user = get_user_from_token(event)
        if not user:
            return error("unauthorized", 401)
        article_id = body.get("id")
        if not article_id:
            return error("id required")
        title = body.get("title", "").strip()
        lead = body.get("lead", "")
        category = body.get("category", "Традиции")
        image_url = body.get("image_url", "")
        content = body.get("content", [])
        status = body.get("status", "draft")
        read_time = max(1, len(json.dumps(content)) // 1000)
        published_at_sql = "NOW()" if status == "published" else "published_at"

        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
            UPDATE articles_db
            SET title=%s, lead=%s, category=%s, image_url=%s, content=%s, status=%s, read_time=%s, updated_at=NOW()
            WHERE id=%s AND author_id=%s
            RETURNING id, slug
        """, (title, lead, category, image_url, json.dumps(content), status, read_time, article_id, user["sub"]))
        row = cur.fetchone()
        conn.commit()
        conn.close()
        if not row:
            return error("not found or forbidden", 403)
        return json_response({"id": row[0], "slug": row[1]})

    # GET /my-articles — статьи текущего автора
    if action == "my-articles" and method == "GET":
        user = get_user_from_token(event)
        if not user:
            return error("unauthorized", 401)
        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
            SELECT id, slug, title, category, status, read_time, created_at, published_at
            FROM articles_db
            WHERE author_id = %s
            ORDER BY updated_at DESC
        """, (user["sub"],))
        rows = cur.fetchall()
        cols = ["id","slug","title","category","status","read_time","created_at","published_at"]
        conn.close()
        return json_response({"articles": [dict(zip(cols, r)) for r in rows]})

    # GET /pending-articles — список статей на модерацию (только admin)
    if action == "pending-articles" and method == "GET":
        user = get_user_from_token(event)
        if not user:
            return error("unauthorized", 401)
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT role FROM users WHERE id = %s", (int(user["sub"]),))
        row = cur.fetchone()
        if not row or row[0] != "admin":
            conn.close()
            return error("forbidden", 403)
        cur.execute("""
            SELECT a.id, a.slug, a.title, a.lead, a.category, a.image_url,
                   a.read_time, a.created_at, u.name as author_name, u.avatar_url as author_avatar
            FROM articles_db a
            JOIN users u ON a.author_id = u.id
            WHERE a.status = 'pending'
            ORDER BY a.created_at ASC
        """)
        rows = cur.fetchall()
        cols = ["id","slug","title","lead","category","image_url","read_time","created_at","author_name","author_avatar"]
        conn.close()
        return json_response({"articles": [dict(zip(cols, r)) for r in rows]})

    # POST /approve — одобрить статью (только admin)
    if action == "approve" and method == "POST":
        user = get_user_from_token(event)
        if not user:
            return error("unauthorized", 401)
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT role FROM users WHERE id = %s", (int(user["sub"]),))
        row = cur.fetchone()
        if not row or row[0] != "admin":
            conn.close()
            return error("forbidden", 403)
        article_id = body.get("id")
        if not article_id:
            conn.close()
            return error("id required")
        cur.execute("""
            UPDATE articles_db
            SET status = 'published', published_at = NOW(), updated_at = NOW()
            WHERE id = %s
            RETURNING id, slug
        """, (int(article_id),))
        row = cur.fetchone()
        conn.commit()
        conn.close()
        if not row:
            return error("article not found", 404)
        return json_response({"ok": True, "slug": row[1]})

    # POST /reject — отклонить статью (только admin)
    if action == "reject" and method == "POST":
        user = get_user_from_token(event)
        if not user:
            return error("unauthorized", 401)
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT role FROM users WHERE id = %s", (int(user["sub"]),))
        row = cur.fetchone()
        if not row or row[0] != "admin":
            conn.close()
            return error("forbidden", 403)
        article_id = body.get("id")
        reason = body.get("reason", "")
        if not article_id:
            conn.close()
            return error("id required")
        cur.execute("""
            UPDATE articles_db
            SET status = 'draft', updated_at = NOW()
            WHERE id = %s
            RETURNING id
        """, (int(article_id),))
        row = cur.fetchone()
        conn.commit()
        conn.close()
        if not row:
            return error("article not found or already processed", 404)
        return json_response({"ok": True})

    return error("unknown action", 404)