from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.models.admin_models import AdminUser
from app.schemas.admin_schemas import AdminUserCreate
from fastapi import HTTPException, status
from jose import JWTError, jwt

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
SECRET_KEY = "HscgyKJGyu8hjhuHJ"  # Use env var in production
ALGORITHM = "HS256"

def get_admin_by_email(db: Session, email: str):
    return db.query(AdminUser).filter(AdminUser.email == email).first()

def create_admin_user(db: Session, admin: AdminUserCreate):
    hashed_password = pwd_context.hash(admin.password)
    db_admin = AdminUser(
        name=admin.name,
        email=admin.email,
        role=admin.role,
        hashed_password=hashed_password,
    )
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)
def get_current_admin(db: Session, token: str) -> AdminUser:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        role: str = payload.get("role")
        allowed_roles = {"admin", "RTA CEO"}  # Add all permitted admin-like roles here
        if user_id is None or role not in allowed_roles:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    admin = db.query(AdminUser).filter(AdminUser.id == int(user_id)).first()
    if admin is None:
        raise credentials_exception

    return admin
