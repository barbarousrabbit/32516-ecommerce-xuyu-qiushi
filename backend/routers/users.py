# Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.user import User
from models.cart import ShoppingCart
from schemas.user import UserOut, UserUpdate, AdminUserCreate, AdminUserUpdate
from auth.jwt import get_current_user, require_admin, hash_password

router = APIRouter()


@router.get("/me", response_model=UserOut)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserOut)
def update_my_profile(
    data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updates = data.model_dump(exclude_unset=True)
    if "email" in updates and db.query(User).filter(User.email == updates["email"], User.id != current_user.id).first():
        raise HTTPException(status_code=400, detail="Email already in use")
    if "username" in updates and db.query(User).filter(User.username == updates["username"], User.id != current_user.id).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    for field, value in updates.items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db), _=Depends(require_admin)):
    return db.query(User).all()


@router.post("", status_code=status.HTTP_201_CREATED, response_model=UserOut)
def create_user(
    data: AdminUserCreate,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    user = User(
        username=data.username,
        email=data.email,
        password_hash=hash_password(data.password),
        role=data.role,
    )
    db.add(user)
    db.flush()

    # Every user needs a shopping cart
    db.add(ShoppingCart(user_id=user.id))
    db.commit()
    db.refresh(user)
    return user


@router.put("/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    data: AdminUserUpdate,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    updates = data.model_dump(exclude_unset=True)
    if "email" in updates and db.query(User).filter(User.email == updates["email"], User.id != user_id).first():
        raise HTTPException(status_code=400, detail="Email already in use")
    if "username" in updates and db.query(User).filter(User.username == updates["username"], User.id != user_id).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    for field, value in updates.items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}", status_code=204)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
