import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATABASE_URL = f"sqlite+aiosqlite:///{os.path.join(BASE_DIR, 'database.db')}"