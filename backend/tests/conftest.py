# Authors: Xuyu Zhang (26025395), Qiushi Huang (25668904)
"""
Pytest configuration — auto-detects MySQL availability.
Tests marked with @requires_db are skipped when MySQL is not running.
"""
import os
import pytest
from dotenv import load_dotenv

load_dotenv()


def _mysql_reachable() -> bool:
    """Return True if the ecommerce database is up and reachable."""
    try:
        from sqlalchemy import create_engine, text
        host     = os.getenv("DB_HOST", "localhost")
        port     = os.getenv("DB_PORT", "3306")
        user     = os.getenv("DB_USER", "root")
        password = os.getenv("DB_PASSWORD", "")
        name     = os.getenv("DB_NAME", "ecommerce")
        url = f"mysql+pymysql://{user}:{password}@{host}:{port}/{name}"
        eng = create_engine(url, connect_args={"connect_timeout": 2})
        with eng.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False


# Evaluated once per pytest session — skip DB tests if MySQL is not running
_DB_UP = _mysql_reachable()

requires_db = pytest.mark.skipif(
    not _DB_UP,
    reason="MySQL not running or DB not seeded. Run: mysql -u root -p < database/schema.sql && mysql -u root -p < database/seed.sql",
)
