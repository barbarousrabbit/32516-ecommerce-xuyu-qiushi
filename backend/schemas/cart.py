# Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
from pydantic import BaseModel, Field
from typing import List, Optional
from schemas.product import ProductOut


class CartItemAdd(BaseModel):
    product_id: int
    quantity: int = Field(default=1, ge=1)


class CartItemUpdate(BaseModel):
    quantity: int = Field(..., ge=1)


class CartItemOut(BaseModel):
    id: int
    product: ProductOut
    quantity: int

    model_config = {"from_attributes": True}


class CartOut(BaseModel):
    id: int
    items: List[CartItemOut] = []

    model_config = {"from_attributes": True}


class UserCartOut(BaseModel):
    user_id: int
    username: str
    cart: Optional[CartOut] = None

    model_config = {"from_attributes": True}
