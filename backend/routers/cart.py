# Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

from database import get_db
from models.user import User
from models.cart import ShoppingCart, CartItem
from models.product import Product
from schemas.cart import CartItemAdd, CartItemUpdate, CartOut, UserCartOut, CheckoutResponse
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

    product = db.query(Product).filter(Product.id == data.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.stock <= 0:
        raise HTTPException(status_code=400, detail="Product is out of stock")

    existing = (
        db.query(CartItem)
        .filter(CartItem.cart_id == cart.id, CartItem.product_id == data.product_id)
        .first()
    )
    new_qty = (existing.quantity if existing else 0) + data.quantity
    if new_qty > product.stock:
        raise HTTPException(
            status_code=400,
            detail=f"Only {product.stock} in stock (you already have {existing.quantity if existing else 0} in cart)",
        )

    if existing:
        existing.quantity = new_qty
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

    product = db.query(Product).filter(Product.id == item.product_id).first()
    if product and data.quantity > product.stock:
        raise HTTPException(
            status_code=400,
            detail=f"Only {product.stock} in stock",
        )

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


@router.post("/checkout", status_code=200, response_model=CheckoutResponse)
def checkout(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cart = (
        db.query(ShoppingCart)
        .options(joinedload(ShoppingCart.items))
        .filter(ShoppingCart.user_id == current_user.id)
        .first()
    )
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Pass 1: lock rows and verify every item has enough stock
    locked = []
    for item in cart.items:
        product = (
            db.query(Product)
            .filter(Product.id == item.product_id)
            .with_for_update()
            .first()
        )
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"'{product.name}' only has {product.stock} in stock",
            )
        locked.append((item, product))

    # Pass 2: deduct stock and clear cart — both inside the same transaction
    for item, product in locked:
        product.stock -= item.quantity
        db.delete(item)

    db.commit()
    return {"message": "Order placed successfully"}
