from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from databases import Database
import os

# Change these values to match your actual database credentials and name
ASYNC_DATABASE_URL = os.getenv(
    "ASYNC_DATABASE_URL",
    "mysql+aiomysql://root:password@localhost:3306/rta"
)
SYNC_DATABASE_URL = os.getenv(
    "SYNC_DATABASE_URL",
    "mysql+pymysql://root:password@localhost:3306/rta"
)

# Async database instance for use with FastAPI async endpoints
database = Database(ASYNC_DATABASE_URL)

# SQLAlchemy engine/session for sync operations (migrations, ORM, etc)
engine = create_engine(SYNC_DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

metadata = MetaData()
