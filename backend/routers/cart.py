# Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

from database import get_db
from models.user import User
from models.cart import ShoppingCart, CartItem
from models.product import Product
from schemas.cart import CartItemAdd, CartItemUpdate, CartOut, UserCartOut
from auth.jwt import get_current_user, require_admin

router = APIRouter()


@router.get("/all", response_model=List[UserCartOut])
def get_all_carts(db: Session = Depends(get_db), _=Depends(require_admin)):
    # Route defined before /me so FastAPI doesn't interpret "all" as {item_id}
    users = db.query(User).all()
    result = []
    for user in users:
        cart = (
            db.query(ShoppingCart)
            .options(joinedload(ShoppingCart.items).joinedload(CartItem.product))
            .filter(ShoppingCart.user_id == user.id)
            .first()
        )
        result.append(UserCartOut(user_id=user.id, username=user.username, cart=cart))
    return result


@router.get("/me", response_model=CartOut)
def get_my_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cart = db.query(ShoppingCart).filter(ShoppingCart.user_id == current_user.id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    return cart


@router.post("/items", status_code=201, response_model=CartOut)
def add_to_cart(
    data: CartItemAdd,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cart = db.query(ShoppingCart).filter(ShoppingCart.user_id == current_user.id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    if not db.query(Product).filter(Product.id == data.product_id).first():
        raise HTTPException(status_code=404, detail="Product not found")

    existing = (
        db.query(CartItem)
        .filter(CartItem.cart_id == cart.id, CartItem.product_id == data.product_id)
        .first()
    )
    if existing:
        existing.quantity += data.quantity
    else:
        db.add(CartItem(cart_id=cart.id, product_id=data.product_id, quantity=data.quantity))

    db.commit()
    db.refresh(cart)
    return cart


@router.put("/items/{item_id}", response_model=CartOut)
def update_cart_item(
    item_id: int,
    data: CartItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    cart = db.query(ShoppingCart).filter(
        ShoppingCart.id == item.cart_id,
        ShoppingCart.user_id == current_user.id,
    ).first()
    if not cart:
        raise HTTPException(status_code=403, detail="Not your cart")

    if data.quantity <= 0:
        db.delete(item)
    else:
        item.quantity = data.quantity

    db.commit()
    db.refresh(cart)
    return cart


@router.delete("/items/{item_id}", status_code=204)
def remove_cart_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    cart = db.query(ShoppingCart).filter(
        ShoppingCart.id == item.cart_id,
        ShoppingCart.user_id == current_user.id,
    ).first()
    if not cart:
        raise HTTPException(status_code=403, detail="Not your cart")

    db.delete(item)
    db.commit()
