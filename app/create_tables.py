from models.investor_models import Base
from models.admin_models import Base
from db import engine

def create_tables():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    create_tables()
    print("Tables created in rta database successfully.")
