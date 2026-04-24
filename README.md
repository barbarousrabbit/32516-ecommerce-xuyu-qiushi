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
- Browse and live-search products
- Add / update / remove items in shopping cart
- View order summary and checkout
- Admin: manage products (CRUD)
- Admin: view all users and their shopping carts

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
source .venv/Scripts/activate   # Windows
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

| Member | Responsibilities |
|--------|----------------|
| Xuyu Zhang (20625395) | TBD |
| Qiushi Huang | TBD |

*To be updated as development progresses.*

---

## Group Members
- Xuyu Zhang (20625395)
- Qiushi Huang
