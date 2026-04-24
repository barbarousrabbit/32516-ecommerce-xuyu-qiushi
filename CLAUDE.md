# 32516 Assignment 2 — E-commerce Shopping Cart

## Project Info
- **Subject**: 32516 Internet Programming, UTS 2026 Semester 1
- **Members**: Xuyu Zhang (26025395), Qiushi Huang (25668904)
- **GitHub**: https://github.com/barbarousrabbit/32516-ecommerce-xuyu-qiushi
- **Qiushi GitHub username**: qiushihuang-beep
- **Due**: 24 May 2026 by 23:59
- **Credentials**: stored locally in Claude memory — see `project_credentials.md` (never commit tokens)

## Language Policy
- **README.md**: Full English — all sections, descriptions, and comments must be in English
- **All source code files**: English only — variable names, function names, comments, commit messages
- **No Chinese characters** in any source file (`.jsx`, `.js`, `.py`, `.css`, `.sql`, `.md` inside `frontend/` or `backend/`)

## Author Signature — MANDATORY
Every source code file must begin with an author header comment declaring both group members and student IDs.

| File type | Format |
|-----------|--------|
| Python (`.py`) | `# Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)` |
| JavaScript / JSX (`.js`, `.jsx`) | `// Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)` |
| CSS (`.css`) | `/* Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904) */` |
| SQL (`.sql`) | `-- Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)` |

**Rule**: Add this as the very first line of every new file created. No exceptions.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + React Router v6 |
| Styling | CSS Modules (plain CSS, no extra libraries) |
| Backend | FastAPI (Python 3.11+) |
| Database | MySQL 8 |
| Auth | JWT (python-jose) + password hashing (passlib/bcrypt) |

## Folder Structure
```
/
  frontend/
    src/
      components/    Reusable UI pieces (Button, Modal, SearchBar…)
      pages/         One file per route (HomePage, LoginPage, CartPage…)
      hooks/         Custom React hooks (useAuth, useSearch…)
      services/      All fetch/API calls — NO fetch() inside components
      context/       React Context (AuthContext for login state)
    index.html       The ONE and ONLY html file (SPA requirement)
  backend/
    routers/         One file per entity (users.py, products.py, cart.py)
    models/          SQLAlchemy ORM models
    schemas/         Pydantic request/response schemas
    auth/            JWT token logic (create, verify, decode)
    database.py      DB session and engine setup
    main.py          FastAPI app entry point, CORS config
  database/
    schema.sql       All CREATE TABLE statements
    seed.sql         Sample data for testing
  docs/
    Assignment 2 Requirements.docx   ← original brief (reference)
    Assignment 2 Rubric.docx         ← marking rubric (reference)
    plans/
      2026-04-24-ecommerce-shopping-cart.md      ← English implementation plan
      2026-04-24-ecommerce-shopping-cart_cn.md   ← Chinese translation (read only)
      分工说明.docx                               ← Chinese workload allocation (.docx)
  README.md
  .gitignore
  CLAUDE.md          ← this file
```

## The Three Entities (CRUD required for all)
| Entity | Table | Who can access |
|--------|-------|----------------|
| User | `users` | Admin: CRUD all users; User: own profile |
| Product | `products` | Admin: CRUD; User: Read only |
| Shopping Cart | `shopping_cart` + `cart_items` | User: own cart CRUD; Admin: read all |

## Workload Allocation (Option B — Feature Split)

### Xuyu Zhang (26025395) — Auth + Cart + Project Foundation

| Area | Files |
|------|-------|
| Project setup | `backend/main.py`, `backend/database.py`, `backend/requirements.txt`, `frontend/src/main.jsx`, `frontend/src/App.jsx` |
| Auth (frontend) | `frontend/src/context/AuthContext.jsx`, `frontend/src/services/api.js`, `frontend/src/services/authService.js`, `frontend/src/pages/LoginPage.jsx`, `frontend/src/pages/RegisterPage.jsx` |
| Auth (backend) | `backend/auth/jwt.py`, `backend/routers/auth.py`, `backend/models/user.py`, `backend/schemas/user.py` |
| Cart (frontend) | `frontend/src/services/cartService.js`, `frontend/src/pages/CartPage.jsx`, `frontend/src/pages/ProfilePage.jsx`, `frontend/src/components/Navbar.jsx` |
| Cart (backend) | `backend/routers/cart.py`, `backend/models/cart.py`, `backend/schemas/cart.py` |

### Qiushi Huang (25668904) — Products + Admin + Database

| Area | Files |
|------|-------|
| Database | `database/schema.sql`, `database/seed.sql` |
| Products (frontend) | `frontend/src/pages/HomePage.jsx`, `frontend/src/components/ProductCard.jsx`, `frontend/src/hooks/useSearch.js`, `frontend/src/services/productService.js` |
| Products (backend) | `backend/routers/products.py`, `backend/models/product.py`, `backend/schemas/product.py` |
| Admin (frontend) | `frontend/src/pages/AdminProductsPage.jsx`, `frontend/src/pages/AdminUsersPage.jsx`, `frontend/src/pages/AdminCartsPage.jsx` |
| Admin (backend) | `backend/routers/users.py` |

## Assignment Must-Haves (check before submitting)
- [ ] Only ONE `.html` file in the entire project (`frontend/index.html`)
- [ ] All four CRUD operations exist on all three entities
- [ ] JWT stored in `localStorage`, sent via `Authorization: Bearer <token>` header
- [ ] Passwords hashed with bcrypt — never stored in plaintext
- [ ] Live search: product list filters as user types (no submit button needed)
- [ ] Admin role: `role` field in `users` table, backend checks on protected routes
- [ ] Admin page: view all users' shopping carts
- [ ] Error handling: API failures show a friendly message, not a blank/broken screen
- [ ] README includes: description, tech stack, how to run, folder structure, workload split

## Git Rules (affects Individual — Professional Practices score)
- **Commit often**: after every completed feature or meaningful change
- **Commit message format**: `type: short description`
  - Types: `feat` `fix` `style` `refactor` `docs` `chore`
  - Examples: `feat: add product search bar`, `fix: jwt token expiry bug`
  - Bad examples (will lose marks): `update`, `fix`, `stuff`, `aaa`
- **No secrets in code**: all passwords / DB credentials go in `.env` files (already in `.gitignore`)
- **Branch strategy**: `main` = stable working code; `feature/<name>` = work in progress

## Commit Identity Rules — MANDATORY
Each member's files MUST be committed and pushed under their own GitHub identity. This is how the grader verifies individual contribution.

### Committing Xuyu Zhang's files (default)
```bash
git config user.name "Xuyu Zhang"
git config user.email "barbarousrabbit@gmail.com"
git add <xuyu's files>
git commit -m "feat: ..."
# push with Xuyu's token (stored in ~/.claude/.mcp.json)
```

### Committing Qiushi Huang's files
```bash
# Step 1 — switch identity
git config user.name "Qiushi Huang"
git config user.email "Qiushi.Huang@student.uts.edu.au"

# Step 2 — commit
git add <qiushi's files>
git commit -m "feat: ..."

# Step 3 — push with Qiushi's token (stored in Claude memory: project_credentials.md)

# Step 4 — switch back immediately
git config user.name "Xuyu Zhang"
git config user.email "barbarousrabbit@gmail.com"
```

### Why this matters
GitHub records both `author` and `committer` per commit. If Qiushi's files are pushed with Xuyu's token, GitHub shows "authored by Qiushi, committed by Xuyu" — the grader can see this discrepancy. Using the correct token ensures author = committer = the right person, with no trace of the other.

### File ownership reference
See `docs/plans/分工说明.docx` — Section 六 for the complete file-to-owner mapping.

## Code Conventions
### Frontend (React)
- Component files: `PascalCase.jsx` (e.g., `ProductCard.jsx`)
- Variables/functions: `camelCase`
- API base URL in `.env`: `VITE_API_URL=http://localhost:8000` — never hardcode
- Never call `fetch()` directly in a component — always go through `services/`
- Use `useState` for UI state; `useContext` for auth; `useEffect` for data fetching on mount

### Backend (Python/FastAPI)
- All files, functions, variables: `snake_case`
- Follow PEP 8 (max line length 88)
- Every route must have a Pydantic response model
- Auth dependency: use `Depends(get_current_user)` to protect routes
- Environment variables via `python-dotenv` → never hardcode DB password

## How to Run (local dev)
```bash
# Backend
cd backend
python -m venv .venv && source .venv/Scripts/activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev

# Database
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

## Key Files to Edit Most Often
- Adding a new page → `frontend/src/pages/`
- Adding an API call → `frontend/src/services/`
- Adding a new route (backend) → `backend/routers/`
- Changing DB schema → `backend/models/` + update `database/schema.sql`
