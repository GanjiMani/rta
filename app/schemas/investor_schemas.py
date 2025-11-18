# schemas.py
from pydantic import BaseModel, EmailStr, constr, Field,model_validator,root_validator,field_validator
from typing import Optional, List
from datetime import date, datetime

class BankBase(BaseModel):
    account_no: str
    ifsc: str
    branch: Optional[str]
    verified: Optional[bool] = False

class BankCreate(BaseModel):
    account_no: str
    ifsc: str
    branch: Optional[str] = None
    verified: Optional[bool] = False

class BankResponse(BankCreate):
    bank_id: int
    is_default: bool

    model_config = {"from_attributes": True}

class NomineeBase(BaseModel):
    name: str
    relation: Optional[str]
    pct: Optional[float] = 100

class NomineeCreate(NomineeBase):
    pass

class NomineeResponse(NomineeBase):
    nominee_id: int

    model_config = {
        "from_attributes": True,
    }

class InvestorBase(BaseModel):
    pan: constr(min_length=10, max_length=10)
    name: str
    dob: Optional[date]
    address: Optional[str]
    email: EmailStr
    mobile: Optional[str]
    kyc_status: Optional[str]="Pending"
    is_active: Optional[bool] = True

class InvestorCreate(InvestorBase):
    password: constr(min_length=6)

class InvestorUpdate(BaseModel):
    name: Optional[str] = None
    pan: Optional[constr(min_length=10, max_length=10)] = None
    dob: Optional[date] = None
    address: Optional[str] = None
    email: Optional[EmailStr] = None
    mobile: Optional[str] = None
    kyc_status: Optional[str] = None
    
class InvestorResponse(InvestorBase):
    banks: List[BankResponse] = []
    nominees: List[NomineeResponse] = []

    model_config = {
        "from_attributes": True,
    }

class TransactionBase(BaseModel):
    scheme_id: str
    folio_number: Optional[str]
    amount: float
    nav: float
    units: float
    date: Optional[datetime]
    status: Optional[str] = "Pending Payment"

class TransactionCreate(BaseModel):
    scheme_id: constr(min_length=1)
    plan: Optional[str]
    amount: float

class TransactionResponse(TransactionBase):
    txn_id: int
    date: datetime

    model_config = {
        "from_attributes": True,
    }

class RedemptionCreate(BaseModel):
    folio_number: str
    amount: Optional[float] = None
    units: Optional[float] = None
    bank: Optional[str] = None
    payment_mode: Optional[str] = None


class SIPRegistrationCreate(BaseModel):
    folio_number: Optional[str] = None
    scheme_id: constr(min_length=1)
    amount: float
    frequency: constr(min_length=1)
    start_date: date
    end_date: Optional[date] = None
    installments: Optional[int] = None
    bank: constr(min_length=1)
    mandate: constr(min_length=1)

class SIPRegistrationResponse(SIPRegistrationCreate):
    reg_id: str
    investor_id: int
    status: str
    date: datetime

    class Config:
        orm_mode = True

class SWPRegistrationCreate(BaseModel):
    folio_number: Optional[str] = None
    scheme_id:str
    amount: Optional[float] = None
    units: Optional[float] = None
    frequency: str
    start_date: date
    end_date: Optional[date] = None
    installments: Optional[int] = None
    bank: str
    mandate: str

    @model_validator(mode='before')
    def check_amount_or_units(cls, values):
        if not values.get('amount') and not values.get('units'):
            raise ValueError('Either amount or units must be provided')
        return values
    class Config:
        from_attributes = True

class SWPRegistrationResponse(BaseModel):
    reg_id: str
    status: str
    folio_number: Optional[str] = None
    scheme_id: str
    amount: float
    units: float
    frequency: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    installments: Optional[int] = None
    bank: str
    mandate: str

    class Config:
        from_attributes = True


class STPCreateSchema(BaseModel):
    from_scheme_id: constr(min_length=1)
    to_scheme_id: constr(min_length=1)
    amount: Optional[float] = None
    units: Optional[float] = None
    date: datetime

    @model_validator(mode='before')
    def check_amount_or_units(cls, values):
        if not values.get('amount') and not values.get('units'):
            raise ValueError('Either amount or units must be provided')
        return values
    
class SchemeResponse(BaseModel):
    scheme_id: str

class SipResponse(BaseModel):
    sip_id: int
    scheme_id: str
    amount: float
    date: datetime

    class Config:
        orm_mode = True

class FolioSummaryResponse(BaseModel):
    folio_number: str
    investor_id: int
    scheme_id: str
    total_units: float
    total_value: float
    last_nav: float
    updated_at: datetime

    class Config:
        orm_mode = True


class TransactionLedgerResponse(BaseModel):
    txn_id: int
    investor_id: int
    folio_number: str
    scheme_id: str
    txn_type: str
    amount: float
    units: float
    nav: float
    date: datetime
    status: str
    bank: str
    payment_mode: str

    class Config:
        orm_mode = True

class SwitchCreateSchema(BaseModel):
    from_scheme_id: constr(min_length=1)
    to_scheme_id: constr(min_length=1)
    amount: Optional[float] = None
    units: Optional[float] = None
    date: Optional[datetime] = None

    @model_validator(mode='after')
    def check_amount_or_units(cls, values):
        amount = values.amount
        units = values.units
        if (amount is None or amount <= 0) and (units is None or units <= 0):
            raise ValueError('Either amount or units must be provided and greater than zero')
        return values


class SwitchResponseSchema(BaseModel):
    redemption_txn_id: int
    purchase_txn_id: int
    switch_txn_id: int
    message: str

    model_config = {
        "from_attributes": True,
    }


class IDCWPreferenceBase(BaseModel):
    scheme_id: str
    preference: str

class IDCWPreferenceCreate(IDCWPreferenceBase):
    pass

class IDCWPreferenceResponse(IDCWPreferenceBase):
    pref_id: int

    model_config = {
        "from_attributes": True,
    }

class IDCWPreferenceUpdate(BaseModel):
    preference: Optional[str]

class UnclaimedAmountResponse(BaseModel):
    unclaimed_id: int
    txn_id: int
    scheme: str
    folio: str
    type: str
    amount: float
    unclaimed_since: date
    status: str
    description: str

    model_config = {
        "from_attributes": True,  # For compatibility with SQLAlchemy
    }


class CapitalGainRecord(BaseModel):
    Scheme: str
    Folio: str
    BuyDate: date
    SellDate: date
    BuyAmount: float
    SellAmount: float
    Gains: float
    Type: str  # "Long-term" or "Short-term"

    model_config = {
        "from_attributes": True,
    }

class ValuationReportRecord(BaseModel):
    scheme: str
    folio: str
    units: float
    nav: float
    value: float

    class Config:
        orm_mode = True

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: constr(min_length=6)

class TwoFAStatusResponse(BaseModel):
    enabled: bool

class SessionInfo(BaseModel):
    id: int
    device: str
    ip: str
    last_active: str  # ISO datetime string or datetime object

class SessionsResponse(BaseModel):
    sessions: list[SessionInfo]

class MandateBase(BaseModel):
    scheme: str
    type: str

class MandateCreate(MandateBase):
    created: date

class MandateResponse(MandateBase):
    id: int
    status: str
    created: date

    model_config = {
        "from_attributes": True,
    }

class ServiceRequestBase(BaseModel):
    type: str
    details: str

class ServiceRequestCreate(ServiceRequestBase):
    created: date

class ServiceRequestResponse(ServiceRequestBase):
    id: int
    status: str
    created: date

    model_config = {
        "from_attributes": True,
    }

class NotificationBase(BaseModel):
    title: str
    date: date
    read: bool

class NotificationResponse(NotificationBase):
    id: int
    model_config = {
        "from_attributes": True,
    }

class ComplaintBase(BaseModel):
    subject: str
    description: str
    status: str
    date: date

class ComplaintCreate(ComplaintBase):
    pass

class ComplaintResponse(ComplaintBase):
    id: int

    model_config = {
        "from_attributes": True,
    }

class SupportTicketBase(BaseModel):
    subject: str
    message: str
    status: str
    created: date

class SupportTicketCreate(SupportTicketBase):
    pass

class SupportTicketResponse(SupportTicketBase):
    id: int

    model_config = {
        "from_attributes": True,
    }


class DisclosureResponse(BaseModel):
    id: int
    title: str
    content: str

    model_config = {
        "from_attributes": True,
    }

class ClientBase(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    total_commission: int
    active: bool

class ClientResponse(ClientBase):
    model_config = {
        "from_attributes": True,
    }

class BaseTransaction(BaseModel):
    folio_number: str
    scheme_id: str
    amount: float
    units: float
    nav: float
    date: Optional[datetime] = None
    status: Optional[str]

class PurchaseRequest(BaseModel):
    scheme_id: constr(min_length=1)
    plan: constr(min_length=1)
    amount: float
    bank: constr(min_length=1)
    payment_mode: constr(min_length=1)

class PurchaseTransactionCreate(BaseTransaction):
    bank: Optional[str]
    payment_mode: Optional[str]

class RedemptionRequest(BaseModel):
    scheme_id: constr(min_length=1)
    amount: Optional[float]=None
    units: Optional[float]=None
    bank: constr(min_length=1)
    payment_mode: constr(min_length=1)

    @model_validator(mode="before")
    def check_amount_or_units(cls, values):
        if not values.get('amount') and not values.get('units'):
            raise ValueError('Either amount or units must be provided')
        return values

    class Config:
        from_attributes = True

class RedemptionTransactionCreate(BaseTransaction):
    bank: Optional[str]
    payment_mode: Optional[str]

    class Config:
        from_attributes = True


class SIPTransactionCreate(BaseTransaction):
    frequency: str
    bank: Optional[str]
    payment_mode: Optional[str]


class SWPTransactionCreate(BaseTransaction):
    frequency: str
    bank: Optional[str]
    payment_mode: Optional[str]


class STPTransactionCreate(BaseTransaction):
    from_scheme_id: str
    to_scheme_id: str


class SwitchTransactionCreate(STPTransactionCreate):
    pass


class TransactionLedgerResponse(BaseTransaction):
    txn_id: int
    investor_id: int
    txn_type: str
    model_config = {
        "from_attributes": True,
    }


class FolioSummaryResponse(BaseModel):
    folio_number: str
    investor_id: int
    scheme_id: str
    total_units: float
    total_value: float
    last_nav: float
    updated_at: datetime

class UserSessionResponse(BaseModel):
    id: str
    device: Optional[str]
    ip_address: Optional[str]
    created_at: datetime
    last_active: datetime
    is_active: bool

    model_config = {
        "from_attributes": True,
    }

class UserSessionCreate(BaseModel):
    device: Optional[str]
    ip_address: Optional[str]


