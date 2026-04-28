# Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id            = Column(Integer, primary_key=True, index=True)
    username      = Column(String(50),  unique=True, nullable=False)
    email         = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role          = Column(Enum("user", "admin"), nullable=False, default="user")
    created_at    = Column(TIMESTAMP, server_default=func.now())
