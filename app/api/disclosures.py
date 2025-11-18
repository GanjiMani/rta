from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app import schemas, models
from app.deps import get_db

router = APIRouter()

@router.get("/regulatory-disclosures", response_model=List[schemas.investor_schemas.DisclosureResponse])
def get_disclosures(db: Session = Depends(get_db)):
    disclosures = db.query(models.Disclosure).all()
    return disclosures
