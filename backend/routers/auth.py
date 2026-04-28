# Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from models.cart import ShoppingCart
from schemas.user import UserRegister, UserLogin, UserOut, Token
from auth.jwt import hash_password, verify_password, create_token

router = APIRouter()


@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=Token)
def register(data: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    user = User(
        username=data.username,
        email=data.email,
        password_hash=hash_password(data.password),
    )
    db.add(user)
    db.flush()  # get user.id before commit so we can link the cart

    cart = ShoppingCart(user_id=user.id)
    db.add(cart)
    db.commit()
    db.refresh(user)

    token = create_token({"sub": str(user.id)})
    return Token(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=Token)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_token({"sub": str(user.id)})
    return Token(access_token=token, user=UserOut.model_validate(user))
