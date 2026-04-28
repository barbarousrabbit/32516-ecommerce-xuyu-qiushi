# Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from routers import auth, users, products, cart

load_dotenv()

app = FastAPI(title="ShopCart API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CORS_ORIGIN", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,     prefix="/auth",     tags=["auth"])
app.include_router(users.router,    prefix="/users",    tags=["users"])
app.include_router(products.router, prefix="/products", tags=["products"])
app.include_router(cart.router,     prefix="/cart",     tags=["cart"])
