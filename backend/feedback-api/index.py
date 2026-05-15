"""API для обратной связи и подписок"""
import json
import os
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

def handler(event: dict, context) -> dict:
    """Обработчик обратной связи и подписок"""
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

    # --- Отправить обращение (публичный) ---
    if action == "send" and method == "POST":
        msg_type = body.get("type", "question")
        name = (body.get("name") or "").strip()[:255]
        email = (body.get("email") or "").strip()[:255]
        subject = (body.get("subject") or "").strip()[:500]
        message = (body.get("message") or "").strip()

        if not message:
            return error("Сообщение не может быть пустым")

        db = get_db()
        cur = db.cursor()
        cur.execute(
            "INSERT INTO feedback (type, name, email, subject, message) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (msg_type, name or None, email or None, subject or None, message)
        )
        new_id = cur.fetchone()[0]
        db.commit()
        cur.close()
        db.close()
        return json_response({"ok": True, "id": new_id})

    # --- Список обращений (только админ) ---
    if action == "list" and method == "GET":
        user = get_user_from_token(event)
        if not user or user.get("role") != "admin":
            return error("Нет доступа", 403)

        status_filter = (event.get("queryStringParameters") or {}).get("status", "")
        db = get_db()
        cur = db.cursor()
        if status_filter:
            cur.execute(
                "SELECT id, type, name, email, subject, message, status, admin_notes, created_at FROM feedback WHERE status = %s ORDER BY created_at DESC",
                (status_filter,)
            )
        else:
            cur.execute(
                "SELECT id, type, name, email, subject, message, status, admin_notes, created_at FROM feedback ORDER BY created_at DESC"
            )
        rows = cur.fetchall()
        cols = ["id", "type", "name", "email", "subject", "message", "status", "admin_notes", "created_at"]
        items = [dict(zip(cols, r)) for r in rows]
        cur.close()
        db.close()
        return json_response({"items": items})

    # --- Обновить статус обращения (только админ) ---
    if action == "update-status" and method == "POST":
        user = get_user_from_token(event)
        if not user or user.get("role") != "admin":
            return error("Нет доступа", 403)

        item_id = body.get("id")
        new_status = body.get("status", "")
        admin_notes = body.get("admin_notes", "")

        if not item_id or new_status not in ("new", "in_progress", "done", "spam"):
            return error("Неверные параметры")

        db = get_db()
        cur = db.cursor()
        cur.execute(
            "UPDATE feedback SET status = %s, admin_notes = %s, updated_at = NOW() WHERE id = %s",
            (new_status, admin_notes or None, item_id)
        )
        db.commit()
        cur.close()
        db.close()
        return json_response({"ok": True})

    # --- Получить одно обращение (только админ) ---
    if action == "get" and method == "GET":
        user = get_user_from_token(event)
        if not user or user.get("role") != "admin":
            return error("Нет доступа", 403)

        item_id = (event.get("queryStringParameters") or {}).get("id")
        if not item_id:
            return error("Не указан id")

        db = get_db()
        cur = db.cursor()
        cur.execute(
            "SELECT id, type, name, email, subject, message, status, admin_notes, created_at FROM feedback WHERE id = %s",
            (int(item_id),)
        )
        row = cur.fetchone()
        cur.close()
        db.close()
        if not row:
            return error("Не найдено", 404)
        cols = ["id", "type", "name", "email", "subject", "message", "status", "admin_notes", "created_at"]
        return json_response({"item": dict(zip(cols, row))})

    # --- Подписка (публичный, опционально авторизованный) ---
    if action == "subscribe" and method == "POST":
        name = (body.get("name") or "").strip()[:255]
        email = (body.get("email") or "").strip()[:255]
        plan = (body.get("plan") or "").strip()[:50]
        amount = body.get("amount", 0)
        message = (body.get("message") or "").strip()

        if not email or not plan:
            return error("Email и план обязательны")

        # Получаем user_id если пользователь авторизован
        user_id = None
        try:
            user_data = get_user_from_token(event)
            if user_data:
                user_id = user_data.get("user_id")
        except Exception:
            pass

        db = get_db()
        cur = db.cursor()
        cur.execute(
            "INSERT INTO subscriptions (name, email, plan, amount, message, user_id) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
            (name or None, email, plan, int(amount), message or None, user_id)
        )
        new_id = cur.fetchone()[0]
        db.commit()
        cur.close()
        db.close()
        return json_response({"ok": True, "id": new_id})

    # --- Список подписок (только админ) ---
    if action == "subscriptions" and method == "GET":
        user = get_user_from_token(event)
        if not user or user.get("role") != "admin":
            return error("Нет доступа", 403)

        db = get_db()
        cur = db.cursor()
        cur.execute(
            "SELECT id, name, email, plan, amount, status, message, user_id, confirmed_at, created_at "
            "FROM subscriptions ORDER BY created_at DESC"
        )
        rows = cur.fetchall()
        cols = ["id", "name", "email", "plan", "amount", "status", "message", "user_id", "confirmed_at", "created_at"]
        items = [dict(zip(cols, r)) for r in rows]
        cur.close()
        db.close()
        return json_response({"items": items})

    # --- Подтвердить подписку и присвоить роль (только админ) ---
    if action == "confirm-subscription" and method == "POST":
        admin = get_user_from_token(event)
        if not admin or admin.get("role") != "admin":
            return error("Нет доступа", 403)

        sub_id = body.get("id")
        if not sub_id:
            return error("Не указан id подписки")

        db = get_db()
        cur = db.cursor()

        # Получаем подписку
        cur.execute("SELECT id, user_id, plan, email FROM subscriptions WHERE id = %s", (int(sub_id),))
        row = cur.fetchone()
        if not row:
            cur.close()
            db.close()
            return error("Подписка не найдена", 404)

        _, user_id, plan, email = row

        # Обновляем статус подписки
        cur.execute(
            "UPDATE subscriptions SET status = 'confirmed', confirmed_at = NOW() WHERE id = %s",
            (int(sub_id),)
        )

        # Если есть user_id — присваиваем роль
        if user_id:
            role = plan if plan in ("reader", "friend", "expert") else "reader"
            cur.execute("UPDATE users SET role = %s WHERE id = %s", (role, user_id))

        db.commit()
        cur.close()
        db.close()
        return json_response({"ok": True, "user_updated": bool(user_id)})

    # --- Отклонить подписку (только админ) ---
    if action == "reject-subscription" and method == "POST":
        admin = get_user_from_token(event)
        if not admin or admin.get("role") != "admin":
            return error("Нет доступа", 403)

        sub_id = body.get("id")
        if not sub_id:
            return error("Не указан id подписки")

        db = get_db()
        cur = db.cursor()
        cur.execute("UPDATE subscriptions SET status = 'rejected' WHERE id = %s", (int(sub_id),))
        db.commit()
        cur.close()
        db.close()
        return json_response({"ok": True})

    return error("Неизвестное действие", 404)