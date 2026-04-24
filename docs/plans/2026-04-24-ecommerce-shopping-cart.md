# E-commerce Shopping Cart — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task.

**Goal:** Build a full-stack single-page e-commerce app with product browsing, shopping cart, JWT auth, live search, and admin dashboard — fulfilling all 32516 Assignment 2 rubric criteria.

**Architecture:** React SPA (single `index.html`) talks to a FastAPI REST backend via fetch calls centralised in `services/`. FastAPI protects routes with a JWT `Depends` middleware. MySQL stores 3 core entities (users, products, cart).

**Tech Stack:** React 18 + Vite + React Router v6 · FastAPI · SQLAlchemy · MySQL 8 · python-jose · passlib/bcrypt

**Rubric checklist this plan satisfies:**
- SPA (one .html file) ✓
- CRUD on 3 entities ✓
- JWT + bcrypt ✓
- Live search ✓
- Admin role + view all carts ✓
- Meaningful commits throughout ✓
- No hardcoded credentials ✓

---

## Phase 1 — Database

### Task 1: Write the database schema

**Files:**
- Create: `database/schema.sql`

**Step 1: Write schema.sql**

```sql
CREATE DATABASE IF NOT EXISTS ecommerce CHARACTER SET utf8mb4;
USE ecommerce;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE shopping_cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (cart_id) REFERENCES shopping_cart(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_product (cart_id, product_id)
);
```

**Step 2: Apply to MySQL**
```bash
mysql -u root -p < database/schema.sql
```
Expected: no errors, `ecommerce` database visible in `SHOW DATABASES;`

**Step 3: Write seed data**

File: `database/seed.sql`

```sql
USE ecommerce;

-- Admin user (password: admin123)
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@shop.com', '$2b$12$placeholderHashReplaceAfterSetup', 'admin');

-- Sample products
INSERT INTO products (name, description, price, stock, image_url) VALUES
('Wireless Headphones', 'Noise-cancelling over-ear headphones', 79.99, 50, 'https://placehold.co/300x200?text=Headphones'),
('Mechanical Keyboard', 'RGB backlit mechanical keyboard', 129.99, 30, 'https://placehold.co/300x200?text=Keyboard'),
('USB-C Hub', '7-in-1 USB-C hub with HDMI and PD', 49.99, 100, 'https://placehold.co/300x200?text=USB+Hub'),
('Webcam HD', '1080p webcam with built-in mic', 59.99, 75, 'https://placehold.co/300x200?text=Webcam'),
('Monitor Stand', 'Adjustable aluminium monitor stand', 39.99, 60, 'https://placehold.co/300x200?text=Stand');
```

**Step 4: Commit**
```bash
git add database/
git commit -m "feat: add database schema and seed data"
```

---

## Phase 2 — Backend Foundation

### Task 2: FastAPI project setup

**Files:**
- Create: `backend/requirements.txt`
- Create: `backend/database.py`
- Create: `backend/main.py`
- Create: `backend/.env` (not committed — copy from `.env.example`)

**Step 1: Write requirements.txt**

```
fastapi==0.111.0
uvicorn[standard]==0.29.0
sqlalchemy==2.0.29
pymysql==1.1.0
python-dotenv==1.0.1
passlib[bcrypt]==1.7.4
python-jose[cryptography]==3.3.0
python-multipart==0.0.9
```

**Step 2: Install dependencies**
```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate   # Windows Git Bash
pip install -r requirements.txt
```

**Step 3: Write database.py**

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv
import os

load_dotenv()

DB_URL = (
    f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}"
    f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
)

engine = create_engine(DB_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

**Step 4: Write main.py**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, users, products, cart

app = FastAPI(title="E-commerce API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,     prefix="/auth",     tags=["auth"])
app.include_router(users.router,    prefix="/users",    tags=["users"])
app.include_router(products.router, prefix="/products", tags=["products"])
app.include_router(cart.router,     prefix="/cart",     tags=["cart"])
```

**Step 5: Verify server starts**
```bash
uvicorn main:app --reload
```
Expected: `Application startup complete` at `http://localhost:8000/docs`

**Step 6: Commit**
```bash
git add backend/requirements.txt backend/database.py backend/main.py
git commit -m "chore: set up FastAPI project with DB connection and CORS"
```

---

### Task 3: User model, schema, and JWT auth

**Files:**
- Create: `backend/models/user.py`
- Create: `backend/schemas/user.py`
- Create: `backend/auth/jwt.py`
- Create: `backend/routers/auth.py`

**Step 1: Write models/user.py**

```python
from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP, func
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum("user", "admin"), default="user", nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
```

**Step 2: Write schemas/user.py**

```python
from pydantic import BaseModel, EmailStr
from typing import Literal

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    role: str
    model_config = {"from_attributes": True}

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
```

**Step 3: Write auth/jwt.py**

```python
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer_scheme = HTTPBearer()

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=EXPIRE_MINUTES)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin only")
    return current_user
```

**Step 4: Write routers/auth.py**

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.cart import ShoppingCart
from schemas.user import UserRegister, UserLogin, Token, UserOut
from auth.jwt import hash_password, verify_password, create_token

router = APIRouter()

@router.post("/register", response_model=Token, status_code=201)
def register(body: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(400, "Email already registered")
    user = User(
        username=body.username,
        email=body.email,
        password_hash=hash_password(body.password),
    )
    db.add(user)
    db.flush()
    cart = ShoppingCart(user_id=user.id)
    db.add(cart)
    db.commit()
    db.refresh(user)
    token = create_token({"sub": user.id})
    return Token(access_token=token, user=UserOut.model_validate(user))

@router.post("/login", response_model=Token)
def login(body: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials")
    token = create_token({"sub": user.id})
    return Token(access_token=token, user=UserOut.model_validate(user))
```

**Step 5: Verify in Swagger**
- Open `http://localhost:8000/docs`
- Test `POST /auth/register` → expect 201 + token
- Test `POST /auth/login` → expect 200 + token

**Step 6: Commit**
```bash
git add backend/models/user.py backend/schemas/user.py backend/auth/jwt.py backend/routers/auth.py
git commit -m "feat: implement JWT register and login with bcrypt"
```

---

### Task 4: Products and Cart models + CRUD routes

**Files:**
- Create: `backend/models/product.py`
- Create: `backend/models/cart.py`
- Create: `backend/schemas/product.py`
- Create: `backend/schemas/cart.py`
- Create: `backend/routers/products.py`
- Create: `backend/routers/cart.py`
- Create: `backend/routers/users.py`

**Step 1: Write models/product.py**

```python
from sqlalchemy import Column, Integer, String, Text, Numeric, TIMESTAMP, func
from database import Base

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    price = Column(Numeric(10, 2), nullable=False)
    stock = Column(Integer, default=0)
    image_url = Column(String(255))
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
```

**Step 2: Write models/cart.py**

```python
from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP, UniqueConstraint, func
from sqlalchemy.orm import relationship
from database import Base

class ShoppingCart(Base):
    __tablename__ = "shopping_cart"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    items = relationship("CartItem", back_populates="cart", cascade="all, delete")

class CartItem(Base):
    __tablename__ = "cart_items"
    id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey("shopping_cart.id", ondelete="CASCADE"))
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"))
    quantity = Column(Integer, default=1)
    cart = relationship("ShoppingCart", back_populates="items")
    product = relationship("Product")
    __table_args__ = (UniqueConstraint("cart_id", "product_id"),)
```

**Step 3: Write schemas/product.py**

```python
from pydantic import BaseModel
from typing import Optional
from decimal import Decimal

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal
    stock: int = 0
    image_url: Optional[str] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    stock: Optional[int] = None
    image_url: Optional[str] = None

class ProductOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: Decimal
    stock: int
    image_url: Optional[str]
    model_config = {"from_attributes": True}
```

**Step 4: Write schemas/cart.py**

```python
from pydantic import BaseModel
from typing import List
from schemas.product import ProductOut

class CartItemAdd(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemOut(BaseModel):
    id: int
    product: ProductOut
    quantity: int
    model_config = {"from_attributes": True}

class CartOut(BaseModel):
    id: int
    items: List[CartItemOut]
    model_config = {"from_attributes": True}

class UserCartOut(BaseModel):
    user_id: int
    username: str
    cart: CartOut
```

**Step 5: Write routers/products.py**

```python
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models.product import Product
from schemas.product import ProductCreate, ProductUpdate, ProductOut
from auth.jwt import get_current_user, require_admin

router = APIRouter()

@router.get("", response_model=List[ProductOut])
def list_products(q: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Product)
    if q:
        query = query.filter(Product.name.ilike(f"%{q}%"))
    return query.all()

@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(404, "Product not found")
    return product

@router.post("", response_model=ProductOut, status_code=201, dependencies=[Depends(require_admin)])
def create_product(body: ProductCreate, db: Session = Depends(get_db)):
    product = Product(**body.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.put("/{product_id}", response_model=ProductOut, dependencies=[Depends(require_admin)])
def update_product(product_id: int, body: ProductUpdate, db: Session = Depends(get_db)):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(404, "Product not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product

@router.delete("/{product_id}", status_code=204, dependencies=[Depends(require_admin)])
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(404, "Product not found")
    db.delete(product)
    db.commit()
```

**Step 6: Write routers/cart.py**

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from database import get_db
from models.user import User
from models.cart import ShoppingCart, CartItem
from schemas.cart import CartItemAdd, CartItemUpdate, CartOut, UserCartOut
from auth.jwt import get_current_user, require_admin

router = APIRouter()

@router.get("/me", response_model=CartOut)
def get_my_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart = db.query(ShoppingCart).filter(ShoppingCart.user_id == current_user.id).first()
    return cart

@router.post("/items", response_model=CartOut, status_code=201)
def add_item(body: CartItemAdd, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart = db.query(ShoppingCart).filter(ShoppingCart.user_id == current_user.id).first()
    existing = db.query(CartItem).filter(
        CartItem.cart_id == cart.id, CartItem.product_id == body.product_id
    ).first()
    if existing:
        existing.quantity += body.quantity
    else:
        db.add(CartItem(cart_id=cart.id, product_id=body.product_id, quantity=body.quantity))
    db.commit()
    db.refresh(cart)
    return cart

@router.put("/items/{item_id}", response_model=CartOut)
def update_item(item_id: int, body: CartItemUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.get(CartItem, item_id)
    if not item:
        raise HTTPException(404, "Item not found")
    if body.quantity <= 0:
        db.delete(item)
    else:
        item.quantity = body.quantity
    db.commit()
    cart = db.query(ShoppingCart).filter(ShoppingCart.user_id == current_user.id).first()
    db.refresh(cart)
    return cart

@router.delete("/items/{item_id}", status_code=204)
def remove_item(item_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.get(CartItem, item_id)
    if not item:
        raise HTTPException(404, "Item not found")
    db.delete(item)
    db.commit()

@router.get("/all", response_model=List[UserCartOut], dependencies=[Depends(require_admin)])
def all_carts(db: Session = Depends(get_db)):
    carts = db.query(ShoppingCart).options(
        joinedload(ShoppingCart.items).joinedload(CartItem.product)
    ).all()
    result = []
    for cart in carts:
        user = db.get(User, cart.user_id)
        result.append(UserCartOut(user_id=user.id, username=user.username, cart=CartOut.model_validate(cart)))
    return result
```

**Step 7: Write routers/users.py**

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.user import User
from schemas.user import UserOut
from auth.jwt import get_current_user, require_admin

router = APIRouter()

@router.get("/me", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("", response_model=List[UserOut], dependencies=[Depends(require_admin)])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.delete("/{user_id}", status_code=204, dependencies=[Depends(require_admin)])
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    db.delete(user)
    db.commit()
```

**Step 8: Verify all routes in Swagger at `http://localhost:8000/docs`**

**Step 9: Commit**
```bash
git add backend/models/ backend/schemas/ backend/routers/
git commit -m "feat: add product, cart, and user CRUD routes with admin protection"
```

---

## Phase 3 — Frontend Foundation

### Task 5: Vite + React setup with routing

**Files:**
- Create: `frontend/` (Vite scaffold)
- Modify: `frontend/src/main.jsx`
- Create: `frontend/src/App.jsx`

**Step 1: Scaffold the React app**
```bash
cd frontend
npm create vite@latest . -- --template react
npm install
npm install react-router-dom
```

**Step 2: Write src/main.jsx**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
)
```

**Step 3: Write src/App.jsx**

```jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CartPage from './pages/CartPage'
import ProfilePage from './pages/ProfilePage'
import AdminProductsPage from './pages/AdminProductsPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminCartsPage from './pages/AdminCartsPage'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { user } = useAuth()
  return user?.role === 'admin' ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
        <Route path="/admin/carts" element={<AdminRoute><AdminCartsPage /></AdminRoute>} />
      </Routes>
    </>
  )
}
```

**Step 4: Commit**
```bash
git add frontend/
git commit -m "chore: scaffold React app with Vite and configure all routes"
```

---

### Task 6: AuthContext and API service layer

**Files:**
- Create: `frontend/src/context/AuthContext.jsx`
- Create: `frontend/src/services/api.js`
- Create: `frontend/src/services/authService.js`
- Create: `frontend/src/services/productService.js`
- Create: `frontend/src/services/cartService.js`

**Step 1: Write context/AuthContext.jsx**

```jsx
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  function login(userData, token) {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
```

**Step 2: Write services/api.js**

```js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request(method, path, body = null) {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  })

  if (res.status === 204) return null
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Request failed')
  return data
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  delete: (path) => request('DELETE', path),
}
```

**Step 3: Write services/authService.js**

```js
import { api } from './api'
export const register = (data) => api.post('/auth/register', data)
export const login = (data) => api.post('/auth/login', data)
```

**Step 4: Write services/productService.js**

```js
import { api } from './api'
export const getProducts = (q = '') => api.get(`/products${q ? `?q=${encodeURIComponent(q)}` : ''}`)
export const createProduct = (data) => api.post('/products', data)
export const updateProduct = (id, data) => api.put(`/products/${id}`, data)
export const deleteProduct = (id) => api.delete(`/products/${id}`)
```

**Step 5: Write services/cartService.js**

```js
import { api } from './api'
export const getMyCart = () => api.get('/cart/me')
export const addToCart = (productId, quantity = 1) => api.post('/cart/items', { product_id: productId, quantity })
export const updateCartItem = (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity })
export const removeCartItem = (itemId) => api.delete(`/cart/items/${itemId}`)
export const getAllCarts = () => api.get('/cart/all')
```

**Step 6: Commit**
```bash
git add frontend/src/context/ frontend/src/services/
git commit -m "feat: add AuthContext and centralised API service layer"
```

---

## Phase 4 — Frontend Pages

### Task 7: Navbar + Login + Register pages

**Files:**
- Create: `frontend/src/components/Navbar.jsx`
- Create: `frontend/src/pages/LoginPage.jsx`
- Create: `frontend/src/pages/RegisterPage.jsx`

**Step 1: Write components/Navbar.jsx**

```jsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#1a1a2e', color: '#fff' }}>
      <Link to="/" style={{ color: '#fff', fontWeight: 'bold' }}>🛒 ShopApp</Link>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
        {user ? (
          <>
            <Link to="/cart" style={{ color: '#fff' }}>Cart</Link>
            <Link to="/profile" style={{ color: '#fff' }}>{user.username}</Link>
            {user.role === 'admin' && <Link to="/admin/products" style={{ color: '#ffd700' }}>Admin</Link>}
            <button onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff' }}>Login</Link>
            <Link to="/register" style={{ color: '#fff' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
```

**Step 2: Write pages/LoginPage.jsx**

```jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login } from '../services/authService'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { login: setAuth } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const data = await login(form)
      setAuth(data.user, data.access_token)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto', padding: '2rem' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input placeholder="Email" type="email" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input placeholder="Password" type="password" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} required />
        <button type="submit">Login</button>
      </form>
      <p>No account? <Link to="/register">Register</Link></p>
    </div>
  )
}
```

**Step 3: Write pages/RegisterPage.jsx** — same structure as LoginPage, call `register()`, fields: username + email + password.

**Step 4: Verify in browser — login redirects to `/`, errors show inline (no blank screen)**

**Step 5: Commit**
```bash
git add frontend/src/components/Navbar.jsx frontend/src/pages/LoginPage.jsx frontend/src/pages/RegisterPage.jsx
git commit -m "feat: add Navbar, LoginPage, and RegisterPage"
```

---

### Task 8: HomePage with live search

**Files:**
- Create: `frontend/src/pages/HomePage.jsx`
- Create: `frontend/src/components/ProductCard.jsx`
- Create: `frontend/src/hooks/useSearch.js`

**Step 1: Write hooks/useSearch.js**

```js
import { useState, useEffect } from 'react'
import { getProducts } from '../services/productService'

export function useSearch() {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    const timer = setTimeout(async () => {
      try {
        const data = await getProducts(query)
        setProducts(data)
      } catch {
        setError('Failed to load products. Please try again.')
      } finally {
        setLoading(false)
      }
    }, 300) // 300ms debounce
    return () => clearTimeout(timer)
  }, [query])

  return { query, setQuery, products, loading, error }
}
```

**Step 2: Write components/ProductCard.jsx**

```jsx
import { useAuth } from '../context/AuthContext'
import { addToCart } from '../services/cartService'
import { useState } from 'react'

export default function ProductCard({ product, onAdded }) {
  const { user } = useAuth()
  const [msg, setMsg] = useState('')

  async function handleAdd() {
    if (!user) { setMsg('Please login to add to cart'); return }
    try {
      await addToCart(product.id)
      setMsg('Added!')
      setTimeout(() => setMsg(''), 2000)
      if (onAdded) onAdded()
    } catch (err) {
      setMsg(err.message)
    }
  }

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', width: 220 }}>
      <img src={product.image_url} alt={product.name} style={{ width: '100%', borderRadius: 4 }} />
      <h3 style={{ margin: '0.5rem 0' }}>{product.name}</h3>
      <p style={{ color: '#666', fontSize: 14 }}>{product.description}</p>
      <p style={{ fontWeight: 'bold' }}>${product.price}</p>
      <p style={{ fontSize: 12, color: product.stock > 0 ? 'green' : 'red' }}>
        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
      </p>
      <button onClick={handleAdd} disabled={product.stock === 0} style={{ cursor: 'pointer', width: '100%' }}>
        Add to Cart
      </button>
      {msg && <p style={{ fontSize: 12, color: msg === 'Added!' ? 'green' : 'red' }}>{msg}</p>}
    </div>
  )
}
```

**Step 3: Write pages/HomePage.jsx**

```jsx
import { useSearch } from '../hooks/useSearch'
import ProductCard from '../components/ProductCard'

export default function HomePage() {
  const { query, setQuery, products, loading, error } = useSearch()

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Products</h1>
      <input
        type="search"
        placeholder="Search products..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ padding: '0.5rem 1rem', width: 300, marginBottom: '1.5rem', fontSize: 16 }}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
      {!loading && products.length === 0 && <p>No products found.</p>}
    </main>
  )
}
```

**Step 4: Verify live search — type in box, product list updates without page reload**

**Step 5: Commit**
```bash
git add frontend/src/hooks/useSearch.js frontend/src/components/ProductCard.jsx frontend/src/pages/HomePage.jsx
git commit -m "feat: add HomePage with live search and ProductCard"
```

---

### Task 9: CartPage and ProfilePage

**Files:**
- Create: `frontend/src/pages/CartPage.jsx`
- Create: `frontend/src/pages/ProfilePage.jsx`

**Step 1: Write pages/CartPage.jsx**

```jsx
import { useState, useEffect } from 'react'
import { getMyCart, updateCartItem, removeCartItem } from '../services/cartService'

export default function CartPage() {
  const [cart, setCart] = useState(null)
  const [error, setError] = useState('')

  async function load() {
    try { setCart(await getMyCart()) }
    catch { setError('Failed to load cart.') }
  }
  useEffect(() => { load() }, [])

  async function handleUpdate(itemId, qty) {
    try { setCart(await updateCartItem(itemId, qty)) }
    catch (err) { setError(err.message) }
  }

  async function handleRemove(itemId) {
    try { await removeCartItem(itemId); load() }
    catch (err) { setError(err.message) }
  }

  const total = cart?.items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0) ?? 0

  return (
    <main style={{ padding: '2rem', maxWidth: 700, margin: '0 auto' }}>
      <h1>My Cart</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {cart?.items.length === 0 && <p>Your cart is empty.</p>}
      {cart?.items.map(item => (
        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #eee', padding: '1rem 0' }}>
          <img src={item.product.image_url} alt={item.product.name} style={{ width: 60, borderRadius: 4 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 'bold' }}>{item.product.name}</p>
            <p>${item.product.price}</p>
          </div>
          <input type="number" min="1" value={item.quantity}
            onChange={e => handleUpdate(item.id, Number(e.target.value))}
            style={{ width: 60 }} />
          <button onClick={() => handleRemove(item.id)}>Remove</button>
        </div>
      ))}
      {cart?.items.length > 0 && <p style={{ fontWeight: 'bold', textAlign: 'right' }}>Total: ${total.toFixed(2)}</p>}
    </main>
  )
}
```

**Step 2: Write pages/ProfilePage.jsx** — fetch `/users/me`, display username, email, role.

**Step 3: Commit**
```bash
git add frontend/src/pages/CartPage.jsx frontend/src/pages/ProfilePage.jsx
git commit -m "feat: add CartPage and ProfilePage"
```

---

### Task 10: Admin pages

**Files:**
- Create: `frontend/src/pages/AdminProductsPage.jsx`
- Create: `frontend/src/pages/AdminUsersPage.jsx`
- Create: `frontend/src/pages/AdminCartsPage.jsx`

**AdminProductsPage** — list all products + form to create + edit inline + delete button.
**AdminUsersPage** — list all users (id, username, email, role) + delete button.
**AdminCartsPage** — list all users with their cart items and totals.

Each page: show error message if API call fails (no blank screen).

**Commit after all three:**
```bash
git add frontend/src/pages/Admin*.jsx
git commit -m "feat: add Admin pages for products, users, and cart management"
```

---

## Phase 5 — Polish and Submit

### Task 11: Error boundaries and loading states

- Wrap all API calls with try/catch (already done above — verify all pages)
- Add a loading spinner component for any fetch that takes time
- Ensure no page shows a blank screen on API failure
- Verify admin-only pages redirect non-admin users (already handled by `AdminRoute`)

**Commit:**
```bash
git commit -m "fix: ensure all API failures show user-friendly error messages"
```

---

### Task 12: Generate real admin password hash + finalise seed data

```bash
cd backend
python3 -c "from passlib.context import CryptContext; print(CryptContext(schemes=['bcrypt']).hash('admin123'))"
```
Copy the output hash → replace the placeholder in `database/seed.sql` → re-run seed.

**Commit:**
```bash
git add database/seed.sql
git commit -m "chore: update seed data with real bcrypt admin password hash"
```

---

### Task 13: Complete README workload section

Update `README.md` — fill in the Workload Allocation table with each member's actual files.

```bash
git add README.md
git commit -m "docs: complete README with final workload allocation"
```

---

### Task 14: Export database and final checks

```bash
mysqldump -u root -p ecommerce > database/schema_export.sql
```

**Final checklist (from CLAUDE.md):**
- [ ] Only ONE `.html` file exists (`frontend/index.html`)
- [ ] All CRUD operations work for users, products, cart
- [ ] JWT login/logout works; protected routes redirect unauthenticated users
- [ ] Live search filters products as you type
- [ ] Admin can view all carts at `/admin/carts`
- [ ] No `.env` file committed (check `git status`)
- [ ] All commit messages are meaningful

```bash
git add database/schema_export.sql
git commit -m "chore: add final database export for submission"
```

---

### Task 15: Record video demo (≤3 minutes)

**Script:**
1. Show home page — products loaded, type in search box → list filters live
2. Register a new user → redirected to home
3. Add 2-3 products to cart → go to Cart page → update quantity → remove one
4. Logout → Login as admin → go to Admin → show products CRUD → show all carts

Submit GitHub link + video link on Canvas.

---

## Summary

| Phase | Tasks | Est. Time |
|-------|-------|-----------|
| Database | 1 | 1 day |
| Backend foundation | 2–3 | 2 days |
| Backend CRUD | 4 | 2 days |
| Frontend foundation | 5–6 | 2 days |
| Frontend pages | 7–10 | 4 days |
| Polish + submit | 11–15 | 2 days |
| **Total** | **15 tasks** | **~13 days** |
