import os
import sys

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.auth_seed import init_db_and_seed_users

if __name__ == "__main__":
    print("Running user seed script...")
    init_db_and_seed_users()
    print("Seed process completed.")
