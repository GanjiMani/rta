from fastapi import APIRouter, Depends, HTTPException, status,Body,Request
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from app import investor_auth as jwt_utils
from app.schemas import investor_schemas
from app.models import investor_models
from app import investor_crud
from app import models
from app.deps import get_db
from passlib.context import CryptContext
import uuid
from app.utils.email_utils import send_reset_email
from datetime import datetime,date,timedelta

router = APIRouter()

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_investor(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    print("Received token:", token)
    payload = jwt_utils.decode_access_token(token)
    print("Decoded payload:", payload)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    investor_id = payload.get("sub")
    investor = db.query(models.investor_models.Investor).filter(models.investor_models.Investor.investor_id == investor_id).first()
    if not investor:
        raise HTTPException(status_code=404, detail="Investor not found")
    return investor

@router.post("/register", response_model=investor_schemas.InvestorResponse)
def register(investor: investor_schemas.InvestorCreate, db: Session = Depends(get_db)):
    existing_email = investor_crud.get_investor_by_email(db, investor.email)
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    existing_pan = investor_crud.get_investor_by_pan(db, investor.pan)
    if existing_pan:
        raise HTTPException(status_code=400, detail="PAN already registered")
    created_investor = investor_crud.create_investor(db, investor)
    return created_investor

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), request: Request = None, db: Session = Depends(get_db)):
    investor = investor_crud.get_investor_by_email(db, form_data.username) or investor_crud.get_investor_by_pan(db, form_data.username)
    if not investor or not investor_crud.verify_password(form_data.password, investor.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    device = request.headers.get("user-agent", "unknown")
    ip_address = request.client.host if request else "unknown"

    investor_crud.create_or_update_session(db, investor_id=investor.investor_id, device=device, ip_address=ip_address)

    access_token = jwt_utils.create_access_token(data={"sub": str(investor.investor_id), "role": "investor"})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/change-password")
def change_password(request: investor_schemas.PasswordChangeRequest, current_investor=Depends(get_current_investor), db: Session = Depends(get_db)):
    if not pwd_context.verify(request.current_password, current_investor.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")
    current_investor.hashed_password = pwd_context.hash(request.new_password)
    db.commit()
    return {"msg": "Password changed successfully"}

@router.get("/2fa-status", response_model=investor_schemas.TwoFAStatusResponse)
def get_2fa_status(current_investor=Depends(get_current_investor)):
    enabled = getattr(current_investor, "two_fa_enabled", False)
    return {"enabled": enabled}

@router.post("/2fa")
def enable_2fa(current_investor=Depends(get_current_investor), db: Session = Depends(get_db)):
    setattr(current_investor, "two_fa_enabled", True)
    db.commit()
    return {"msg": "2FA enabled"}

@router.delete("/2fa")
def disable_2fa(current_investor=Depends(get_current_investor), db: Session = Depends(get_db)):
    setattr(current_investor, "two_fa_enabled", False)
    db.commit()
    return {"msg": "2FA disabled"}

@router.get("/sessions", response_model=list[investor_schemas.UserSessionResponse])
def list_sessions(current_investor=Depends(get_current_investor), db: Session = Depends(get_db)):
    sessions = investor_crud.get_sessions_by_investor(db, current_investor.investor_id)
    return sessions

@router.delete("/sessions/{session_id}", status_code=204)
def sign_out_session(session_id: str, current_investor=Depends(get_current_investor), db: Session = Depends(get_db)):
    session = investor_crud.deactivate_session(db, session_id, current_investor.investor_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

@router.post("/auth/forgot-password")
def forgot_password(email_or_pan: str = Body(..., embed=True), request: Request = None, db: Session = Depends(get_db)):
    user = db.query(models.investor_models.Investor).filter(
        (models.investor_models.Investor.email == email_or_pan) | (models.investor_models.Investor.pan == email_or_pan.upper())
    ).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    token = str(uuid.uuid4())
    expiry = datetime.utcnow() + timedelta(hours=1)
    user.reset_token = token
    user.reset_token_expiry = expiry
    db.commit()

    # Construct reset URL
    base_url = str(request.base_url).rstrip("/")
    reset_link = f"{base_url}/reset-password?token={token}"

    # Send email
    send_reset_email(user.email, reset_link)

    return {"message": "Password reset instructions sent to your email"}

@router.post("/auth/reset-password")
def reset_password(token: str = Body(...), new_password: str = Body(...), db: Session = Depends(get_db)):
    user = db.query(models.investor_models.Investor).filter(
        models.investor_models.Investor.reset_token == token,
        models.investor_models.Investor.reset_token_expiry > datetime.utcnow()
    ).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
    user.hashed_password = pwd_context.hash(new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    db.commit()
    return {"message": "Password reset successfully"}
