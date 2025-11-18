from sqlalchemy import Column, Integer, String, Date, Boolean, DateTime, ForeignKey, Float,Text
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime, date
from sqlalchemy import PrimaryKeyConstraint
import uuid

Base = declarative_base()

class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    role = Column(String(50), nullable=False)  # consider making this a foreign key for roles table later
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    
class SystemAlert(Base):
    __tablename__ = "system_alerts"
    id = Column(Integer, primary_key=True)
    alert_type = Column(String(50))
    message = Column(String(512))
    created_at = Column(DateTime, default=datetime.utcnow)

class RecentActivity(Base):
    __tablename__ = "recent_activity"
    id = Column(Integer, primary_key=True)
    action = Column(String(255))
    occurred_at = Column(DateTime, default=datetime.utcnow)