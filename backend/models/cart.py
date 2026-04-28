# Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class ShoppingCart(Base):
    __tablename__ = "shopping_cart"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")


class CartItem(Base):
    __tablename__ = "cart_items"

    id         = Column(Integer, primary_key=True, index=True)
    cart_id    = Column(Integer, ForeignKey("shopping_cart.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id",      ondelete="CASCADE"), nullable=False)
    quantity   = Column(Integer, nullable=False, default=1)

    cart    = relationship("ShoppingCart", back_populates="items")
    product = relationship("Product")

    __table_args__ = (
        UniqueConstraint("cart_id", "product_id", name="unique_cart_product"),
    )
