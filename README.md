# E-commerce Shopping Cart

A single-page e-commerce application where users can browse products, manage a personal shopping cart, and complete purchases. Administrators can manage products, view all users, and monitor shopping activity.

Built for UTS 32516 Internet Programming — Assignment 2.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + React Router v6 |
| Backend | FastAPI (Python 3.11) |
| Database | MySQL 8 |
| Auth | JWT + bcrypt |

---

## Features

- User registration and login (JWT authentication)
- Browse and live-search products (live filtering as you type)
- Add / update / remove items in shopping cart with stock validation
- Checkout flow: order confirmation modal, clears cart on placement
- User profile management (edit username and email)
- Admin: full CRUD on products (create, inline edit, delete)
- Admin: full CRUD on users (create, inline edit role, delete)
- Admin: view all users' shopping carts with expandable item lists

---

## Folder Structure

```
/
  frontend/          React SPA (single index.html)
    src/
      components/    Reusable UI components
      pages/         Page-level components
      hooks/         Custom React hooks
      services/      API fetch functions
      context/       Auth context (global login state)
  backend/           FastAPI REST API
    routers/         Route handlers per entity
    models/          SQLAlchemy database models
    schemas/         Pydantic request/response models
    auth/            JWT logic
  database/          SQL schema and seed data
```

---

## How to Run

### Prerequisites
- Node.js 18+
- Python 3.11+
- MySQL 8

### Backend
```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate    # Git Bash / WSL
# .venv\Scripts\Activate.ps1   # PowerShell
pip install -r requirements.txt
cp .env.example .env            # fill in DB credentials
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env            # set VITE_API_URL
npm run dev
```

### Database
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

---

## Workload Allocation

### Xuyu Zhang (26025395) — Auth + Cart + Project Foundation
| Area | Files |
|------|-------|
| Project setup | `backend/main.py`, `backend/database.py`, `backend/requirements.txt`, `frontend/src/main.jsx`, `frontend/src/App.jsx` |
| User auth (frontend) | `frontend/src/context/AuthContext.jsx`, `frontend/src/services/api.js`, `frontend/src/services/authService.js`, `frontend/src/pages/LoginPage.jsx`, `frontend/src/pages/RegisterPage.jsx` |
| User auth (backend) | `backend/auth/jwt.py`, `backend/routers/auth.py`, `backend/models/user.py`, `backend/schemas/user.py` |
| Shopping cart (frontend) | `frontend/src/services/cartService.js`, `frontend/src/services/userService.js`, `frontend/src/pages/CartPage.jsx`, `frontend/src/pages/ProfilePage.jsx`, `frontend/src/components/Navbar.jsx` |
| Shopping cart (backend) | `backend/routers/cart.py`, `backend/models/cart.py`, `backend/schemas/cart.py` |

### Qiushi Huang (25668904) — Products + Admin + Database
| Area | Files |
|------|-------|
| Database design | `database/schema.sql`, `database/seed.sql` |
| Products (frontend) | `frontend/src/pages/HomePage.jsx`, `frontend/src/components/ProductCard.jsx`, `frontend/src/hooks/useSearch.js`, `frontend/src/services/productService.js` |
| Products (backend) | `backend/routers/products.py`, `backend/models/product.py`, `backend/schemas/product.py` |
| Admin panel (frontend) | `frontend/src/pages/AdminProductsPage.jsx`, `frontend/src/pages/AdminUsersPage.jsx`, `frontend/src/pages/AdminCartsPage.jsx`, `frontend/src/components/AdminSidebar.jsx` |
| Admin panel (backend) | `backend/routers/users.py` |

---

## Group Members
- Xuyu Zhang (26025395)
- Qiushi Huang (25668904)
