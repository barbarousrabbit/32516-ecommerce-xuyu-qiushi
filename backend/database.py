# Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv
import os

load_dotenv()

_host = os.getenv("DB_HOST", "localhost")
_port = os.getenv("DB_PORT", "3306")
_name = os.getenv("DB_NAME", "ecommerce")
_user = os.getenv("DB_USER", "root")
_pass = os.getenv("DB_PASSWORD", "")

DATABASE_URL = f"mysql+pymysql://{_user}:{_pass}@{_host}:{_port}/{_name}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
