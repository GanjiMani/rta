from sqlalchemy.orm import Session
from passlib.context import CryptContext
from . import models
from datetime import date,datetime
from app.schemas.investor_schemas import InvestorCreate

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
print(pwd_context.hash("password123"))
def get_investor_by_email(db: Session, email: str):
    return db.query(models.investor_models.Investor).filter(models.investor_models.Investor.email == email).first()

def get_investor_by_pan(db: Session, pan: str):
    return db.query(models.investor_models.Investor).filter(models.investor_models.Investor.pan == pan).first()

def create_investor(db: Session, investor:InvestorCreate):
    raw_password = str(investor.password)
    truncated_password = raw_password[:72]  # bcrypt max length is 72 bytes/chars
    hashed_password = pwd_context.hash(truncated_password)
    db_investor = models.investor_models.Investor(
        pan=investor.pan,
        name=investor.name,
        dob=investor.dob,
        address=investor.address,
        email=investor.email,
        mobile=investor.mobile,
        hashed_password=hashed_password,
    )
    db.add(db_investor)
    db.commit()
    db.refresh(db_investor)
    return db_investor

def verify_password(plain_password, hashed_password):
    raw_password = str(plain_password)
    truncated_password = raw_password[:72]
    return pwd_context.verify(truncated_password, hashed_password)



def create_session(db: Session, investor_id: int, device: str, ip_address: str):
    session = models.investor_models.UserSession(
        investor_id=investor_id,
        device=device,
        ip_address=ip_address,
        created_at=datetime.utcnow(),
        last_active=datetime.utcnow(),
        is_active=True
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

def get_sessions_by_investor(db: Session, investor_id: int):
    return db.query(models.investor_models.UserSession).filter(
        models.investor_models.UserSession.investor_id == investor_id,
        models.investor_models.UserSession.is_active == True
    ).all()

def create_or_update_session(db: Session, investor_id: int, device: str, ip_address: str):
    existing_session = db.query(models.investor_models.UserSession).filter_by(
        investor_id=investor_id,
        device=device,
        ip_address=ip_address,
        is_active=True
    ).first()
    if existing_session:
        existing_session.last_active = datetime.utcnow()
        db.commit()
        return existing_session
    else:
        new_session = models.investor_models.UserSession(
            investor_id=investor_id,
            device=device,
            ip_address=ip_address,
            created_at=datetime.utcnow(),
            last_active=datetime.utcnow(),
            is_active=True
        )
        db.add(new_session)
        db.commit()
        db.refresh(new_session)
        return new_session


def deactivate_session(db: Session, session_id: str, investor_id: int):
    session = db.query(models.investor_models.UserSession).filter(
        models.investor_models.UserSession.id == session_id,
        models.investor_models.UserSession.investor_id == investor_id,
        models.investor_models.UserSession.is_active == True
    ).first()
    if session:
        session.is_active = False
        db.commit()
    return session