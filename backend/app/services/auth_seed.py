from sqlalchemy.orm import Session
from app.core.base import Base
from app.core.database import engine, SessionLocal
from app.core.security import get_password_hash
from app.models.user import User


def init_db_and_seed_users():
    # Ensure all tables (including users) are created
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        user_count = db.query(User).count()
        if user_count == 0:
            demo_admin = User(
                username="admin",
                email="admin@fra.gov.in",
                hashed_password=get_password_hash("admin123"),
                role="admin",
                is_active=True,
            )
            demo_officer = User(
                username="officer",
                email="officer@fra.gov.in",
                hashed_password=get_password_hash("officer123"),
                role="officer",
                is_active=True,
            )
            db.add(demo_admin)
            db.add(demo_officer)
            db.commit()
            print("Successfully initialized users table and seeded demo accounts (admin, officer).")
    except Exception as e:
        db.rollback()
        print(f"User seed error: {e}")
    finally:
        db.close()
