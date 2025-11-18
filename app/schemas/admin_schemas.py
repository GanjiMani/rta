from pydantic import BaseModel, EmailStr
from typing import List

class AdminUserBase(BaseModel):
    name: str
    email: EmailStr
    role: str


class AdminUserCreate(AdminUserBase):
    password: str


class AdminUserResponse(AdminUserBase):
    id: int

    class Config:
        from_attributes = True  # Pydantic v2 ORM mode replacement

class AdminUserLogin(BaseModel):
    email: EmailStr
    password: str


class KpiStat(BaseModel):
    name: str
    value: str
    icon: str  # Could be enum or string to identify UI icon class
    color: str
    link: str | None = None

class RecentActivityItem(BaseModel):
    id: int
    action: str
    time: str

class SystemAlertItem(BaseModel):
    id: int
    type: str
    msg: str

class FundFlowDataItem(BaseModel):
    day: str
    inflow: int
    outflow: int

class ReconciliationDataItem(BaseModel):
    name: str
    value: int

class AdminDashboardResponse(BaseModel):
    role: str
    stats: List[KpiStat]
    recent_activity: List[RecentActivityItem]
    fund_flow: List[FundFlowDataItem]
    reconciliation: List[ReconciliationDataItem]
    system_alerts: List[SystemAlertItem]
