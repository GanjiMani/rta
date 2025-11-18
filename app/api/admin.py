from fastapi import APIRouter, Depends, HTTPException, status, Security
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from app.schemas.admin_schemas import (
    AdminUserCreate,
    AdminUserResponse,
    AdminUserLogin,
    AdminDashboardResponse,
    KpiStat,
    RecentActivityItem,
    SystemAlertItem,
    FundFlowDataItem,
    ReconciliationDataItem,
)
from app.admin_crud import (
    get_admin_by_email,
    create_admin_user,
    verify_password,
    get_current_admin,
)
from app.deps import get_db
from app.admin_auth import create_access_token

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/admin/login")

async def get_current_admin_user(
    token: str = Security(oauth2_scheme),
    db: Session = Depends(get_db),
):
    return get_current_admin(db, token)

@router.post("/register", response_model=AdminUserResponse)
def register_admin(admin: AdminUserCreate, db: Session = Depends(get_db)):
    existing_admin = get_admin_by_email(db, admin.email)
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )
    new_admin = create_admin_user(db, admin)
    return new_admin

@router.post("/login")
def login_admin(login_data: AdminUserLogin, db: Session = Depends(get_db)):
    admin = get_admin_by_email(db, login_data.email)
    if not admin or not verify_password(login_data.password, admin.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": str(admin.id), "role": admin.role})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/admindashboard", response_model=AdminDashboardResponse)
def get_admin_dashboard(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin_user),
):
    # Dummy data for demonstration
    stats = [
        KpiStat(name="Pending Approvals", value="128", icon="CheckCircle", color="text-blue-600"),
        KpiStat(name="Transactions Today", value="5,432", icon="Activity", color="text-green-600"),
        KpiStat(name="NAV Uploaded", value="42 Funds", icon="BarChart3", color="text-purple-600"),
        KpiStat(name="System Alerts", value="3", icon="AlertTriangle", color="text-red-600", link="/admin/alerts"),
    ]

    recent_activity = [
        RecentActivityItem(id=1, action="Approved SIP setup", time="2 min ago"),
        RecentActivityItem(id=2, action="Uploaded NAV for ABC Equity Fund", time="10 min ago"),
        RecentActivityItem(id=3, action="Flagged exception in redemption", time="30 min ago"),
    ]

    fund_flow = [
        FundFlowDataItem(day="Mon", inflow=4000, outflow=2400),
        FundFlowDataItem(day="Tue", inflow=3000, outflow=1398),
        FundFlowDataItem(day="Wed", inflow=2000, outflow=9800),
        FundFlowDataItem(day="Thu", inflow=2780, outflow=3908),
        FundFlowDataItem(day="Fri", inflow=1890, outflow=4800),
    ]

    reconciliation = [
        ReconciliationDataItem(name="Matched", value=85),
        ReconciliationDataItem(name="Exceptions", value=15),
    ]

    system_alerts = [
        SystemAlertItem(id=1, type="critical", msg="Reconciliation failed for XYZ Fund (₹12.3 Cr mismatch)."),
        SystemAlertItem(id=2, type="warning", msg="3 IDCW payouts overdue beyond SEBI timeline."),
        SystemAlertItem(id=3, type="critical", msg="Unauthorized login attempt detected (Admin ID: A102)."),
        SystemAlertItem(id=4, type="warning", msg="NAV upload pending for 2 schemes today."),
    ]

    return AdminDashboardResponse(
        role=current_admin.role,
        stats=stats,
        recent_activity=recent_activity,
        fund_flow=fund_flow,
        reconciliation=reconciliation,
        system_alerts=system_alerts,
    )
