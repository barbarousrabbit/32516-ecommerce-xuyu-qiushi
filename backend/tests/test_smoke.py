# Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
"""
Smoke tests for the ShopCart API.

Prerequisites: MySQL running with the ecommerce database seeded.
Run from the backend/ directory:
    python -m pytest tests/ -v
"""
import sys
import os

# Ensure the backend package root is on the path when running from backend/
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import pytest
from fastapi.testclient import TestClient
from tests.conftest import requires_db
from main import app

client = TestClient(app)

ADMIN_EMAIL    = "admin@shopcart.com"
ADMIN_PASSWORD = "admin123"


# ── Helpers ────────────────────────────────────────────────────────────────────

def get_token(email: str, password: str) -> str:
    resp = client.post("/auth/login", json={"email": email, "password": password})
    return resp.json().get("access_token", "")


def auth_header(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


# ── Products (public) ──────────────────────────────────────────────────────────

@requires_db
def test_products_returns_list():
    resp = client.get("/products")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


@requires_db
def test_products_search_filters():
    resp = client.get("/products?q=headphones")
    assert resp.status_code == 200
    results = resp.json()
    assert all("headphones" in p["name"].lower() or "headphones" in (p["description"] or "").lower()
               for p in results)


@requires_db
def test_product_not_found():
    resp = client.get("/products/99999")
    assert resp.status_code == 404


# ── Auth ────────────────────────────────────────────────────────────────────────

@requires_db
def test_login_success():
    resp = client.post("/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["user"]["role"] == "admin"


@requires_db
def test_login_wrong_password():
    resp = client.post("/auth/login", json={"email": ADMIN_EMAIL, "password": "wrongpassword"})
    assert resp.status_code == 401


@requires_db
def test_login_unknown_email():
    resp = client.post("/auth/login", json={"email": "nobody@nowhere.com", "password": "anything"})
    assert resp.status_code == 401


# ── Auth guards (no token) ─────────────────────────────────────────────────────

def test_cart_requires_auth():
    resp = client.get("/cart/me")
    assert resp.status_code in (401, 403)


def test_checkout_requires_auth():
    resp = client.post("/cart/checkout")
    assert resp.status_code in (401, 403)


def test_admin_products_write_requires_auth():
    resp = client.post("/products", json={"name": "Test", "price": 9.99, "stock": 1})
    assert resp.status_code in (401, 403)


def test_admin_users_requires_auth():
    resp = client.get("/users")
    assert resp.status_code in (401, 403)


# ── Role guard (user cannot access admin routes) ───────────────────────────────

@requires_db
def test_user_cannot_access_admin_users(tmp_path):
    # Register a fresh user for this test
    unique_email = "smoketest_role@example.com"
    reg = client.post("/auth/register", json={
        "username": "smoketest_role",
        "email":    unique_email,
        "password": "smokepass1",
    })
    # Accept both 200 (first run) and 400 (already registered on re-run)
    assert reg.status_code in (200, 201, 400)

    if reg.status_code in (200, 201):
        token = reg.json()["access_token"]
    else:
        login = client.post("/auth/login", json={"email": unique_email, "password": "smokepass1"})
        token = login.json()["access_token"]

    resp = client.get("/users", headers=auth_header(token))
    assert resp.status_code == 403

    # Cleanup: remove test user so it doesn't appear in the admin Users page
    admin_token = get_token(ADMIN_EMAIL, ADMIN_PASSWORD)
    users = client.get("/users", headers=auth_header(admin_token)).json()
    test_user = next((u for u in users if u["email"] == unique_email), None)
    if test_user:
        client.delete(f"/users/{test_user['id']}", headers=auth_header(admin_token))


# ── Cart CRUD (happy path, requires seeded DB) ─────────────────────────────────

@requires_db
def test_cart_add_view_update_remove():
    token = get_token(ADMIN_EMAIL, ADMIN_PASSWORD)
    headers = auth_header(token)

    # Add product 1 to admin cart
    add = client.post("/cart/items", json={"product_id": 1, "quantity": 1}, headers=headers)
    assert add.status_code == 201
    cart = add.json()
    item = next((i for i in cart["items"] if i["product"]["id"] == 1), None)
    assert item is not None
    item_id = item["id"]

    # Update quantity
    upd = client.put(f"/cart/items/{item_id}", json={"quantity": 2}, headers=headers)
    assert upd.status_code == 200
    updated_item = next(i for i in upd.json()["items"] if i["id"] == item_id)
    assert updated_item["quantity"] == 2

    # Updating to zero should remove the item
    zero = client.put(f"/cart/items/{item_id}", json={"quantity": 0}, headers=headers)
    assert zero.status_code == 200
    assert next((i for i in zero.json()["items"] if i["id"] == item_id), None) is None

    # Add the product again so the explicit delete endpoint is covered too
    add_again = client.post("/cart/items", json={"product_id": 1, "quantity": 1}, headers=headers)
    assert add_again.status_code == 201
    item = next((i for i in add_again.json()["items"] if i["product"]["id"] == 1), None)
    assert item is not None
    item_id = item["id"]

    # Remove
    rem = client.delete(f"/cart/items/{item_id}", headers=headers)
    assert rem.status_code == 204
