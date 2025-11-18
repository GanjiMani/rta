from sqlalchemy import Column, Integer, String, Date, Boolean, DateTime, ForeignKey, Float,Text
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime, date
from sqlalchemy import PrimaryKeyConstraint
import uuid
Base = declarative_base()

class Investor(Base):
    __tablename__ = "investor_master"
    investor_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    pan = Column(String(10), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    dob = Column(Date, nullable=True)
    address = Column(String(255), nullable=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    mobile = Column(String(15), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    kyc_status = Column(String(20), default="Pending")
    is_active = Column(Boolean, default=True)
    reset_token = Column(String(36), unique=True, nullable=True)
    reset_token_expiry = Column(DateTime, nullable=True)
    # New column to track 2FA enabled status
    two_fa_enabled = Column(Boolean, default=False)

    banks = relationship("Bank", back_populates="investor")
    nominees = relationship("Nominee", back_populates="investor")
    transactions = relationship("TransactionLedger", back_populates="investor")
    folios = relationship("FolioSummary", back_populates="investor")
    documents = relationship("Document", back_populates="investor")
    mandates = relationship("Mandate", back_populates="investor")
    service_requests = relationship("ServiceRequest", back_populates="investor")
    notifications = relationship("Notification", back_populates="investor")
    complaints = relationship("Complaint", back_populates="investor")
    support_tickets = relationship("SupportTicket", back_populates="investor")
    sips = relationship("SIPTransaction", back_populates="investor")
    swps = relationship("SWPTransaction", back_populates="investor")
    stps = relationship("STPTransaction", back_populates="investor")
    switch_transactions=relationship("SwitchTransaction",back_populates="investor")

class Bank(Base):
    __tablename__ = "bank_master"
    bank_id = Column(Integer, primary_key=True, autoincrement=True)
    investor_id = Column(Integer, ForeignKey("investor_master.investor_id"))
    account_no = Column(String(20), nullable=False)
    ifsc = Column(String(20), nullable=False)
    branch = Column(String(100), nullable=True)
    verified = Column(Boolean, default=False)
    is_default = Column(Boolean, default=False)
    investor = relationship("Investor", back_populates="banks")

class Nominee(Base):
    __tablename__ = "nominee_master"
    nominee_id = Column(Integer, primary_key=True, autoincrement=True)
    investor_id = Column(Integer, ForeignKey("investor_master.investor_id"))
    name = Column(String(100), nullable=False)
    relation = Column(String(50), nullable=True)
    pct = Column(Float, default=100)

    investor = relationship("Investor", back_populates="nominees")


class IDCWPreference(Base):
    __tablename__ = "idcw_preferences"

    pref_id = Column(Integer, primary_key=True, autoincrement=True)
    investor_id = Column(Integer, ForeignKey("investor_master.investor_id"))
    scheme_id = Column(String(50), nullable=False)
    preference = Column(String(20), nullable=False)

    investor = relationship("Investor")


class UnclaimedAmount(Base):
    __tablename__ = "unclaimed_amounts"

    unclaimed_id = Column(Integer, primary_key=True, autoincrement=True)
    investor_id = Column(Integer, ForeignKey("investor_master.investor_id"))
    txn_id = Column(Integer, ForeignKey("transaction_ledger.txn_id"))
    amount = Column(Float)
    status = Column(String(50))
    start_date = Column(Date)

    investor = relationship("Investor")
    transaction = relationship("TransactionLedger")


class Scheme(Base):
    __tablename__ = "scheme_master"
    scheme_id = Column(String(50), primary_key=True)
    name = Column(String(100))
    # other fields...

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    investor_id = Column(Integer, ForeignKey("investor_master.investor_id"))
    filename = Column(String(255), nullable=False)
    path = Column(String(1024), nullable=False)  # File path or URL
    upload_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="Pending")  # Pending, Verified, Rejected, etc.
    document_type = Column(String(50))  # type of document for category

    investor = relationship("Investor", back_populates="documents")

class Mandate(Base):
    __tablename__ = "mandates"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    investor_id = Column(Integer, ForeignKey("investor_master.investor_id"))
    scheme = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False) # e.g., UPI, ECS, NetBanking
    status = Column(String(20), nullable=False, default="Pending") # Pending, Active, Revoked
    created = Column(Date, default=date.today)

    investor = relationship("Investor", back_populates="mandates")

class ServiceRequest(Base):
    __tablename__ = "service_requests"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    investor_id = Column(Integer, ForeignKey("investor_master.investor_id"))
    type = Column(String(255), nullable=False)
    details = Column(String(1024), nullable=False)
    status = Column(String(50), nullable=False, default="Open")
    created = Column(Date, default=date.today)

    investor = relationship("Investor", back_populates="service_requests")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    investor_id = Column(Integer, ForeignKey("investor_master.investor_id"))
    title = Column(String(255), nullable=False)
    date = Column(Date, default=date.today)
    read = Column(Boolean, default=False)

    investor = relationship("Investor", back_populates="notifications")

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    investor_id = Column(Integer, ForeignKey("investor_master.investor_id"))
    subject = Column(String(255), nullable=False)
    description = Column(String(1024), nullable=False)
    status = Column(String(20), nullable=False, default="Open")
    date = Column(Date, default=date.today)

    investor = relationship("Investor", back_populates="complaints")

class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    investor_id = Column(Integer, ForeignKey("investor_master.investor_id"))
    subject = Column(String(255), nullable=False)
    message = Column(String(2048), nullable=False)
    status = Column(String(20), nullable=False, default="Open")
    created = Column(Date, default=date.today)

    investor = relationship("Investor", back_populates="support_tickets")

class Disclosure(Base):
    __tablename__ = "disclosures"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False) 


class Client(Base):
    __tablename__ = "clients"

    id = Column(String(20), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    total_commission = Column(Integer, nullable=False, default=0)
    active = Column(Boolean, nullable=False, default=True)

class PurchaseTransaction(Base):
    __tablename__ = "purchase_transactions"
    txn_id = Column(Integer, primary_key=True, autoincrement=True)
    investor_id = Column(Integer, ForeignKey("investor_master.investor_id"))
    folio_number = Column(String(50), ForeignKey("folio_summary.folio_number"))
    scheme_id = Column(String(50))
    amount = Column(Float)
    units = Column(Float)
    nav = Column(Float)
    date = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="Pending Payment")
    bank = Column(String(100))
    payment_mode = Column(String(50))
    investor = relationship("Investor")
    folio = relationship("FolioSummary")

class RedemptionTransaction(Base):
    __tablename__ = "redemption_transactions"
    txn_id = Column(Integer, primary_key=True, autoincrement=True)
    investor_id = Column(Integer, ForeignKey("investor_master.investor_id"))
    folio_number = Column(String(50))
    scheme_id = Column(String(50))
    amount = Column(Float)
    units = Column(Float)
    nav = Column(Float)
    date = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="Pending")
    bank = Column(String(100))
    payment_mode = Column(String(50))
    txn_type = Column(String(50)) 

class SIPTransaction(Base):
    __tablename__ = "sip_transactions"
    txn_id = Column(Integer, primary_key=True, autoincrement=True)
    reg_id = Column(String(20), unique=True, index=True)
    investor_id = Column(Integer, ForeignKey("investor_master.investor_id"))
    folio_number = Column(String(50))
    scheme_id = Column(String(50))
    amount = Column(Float)
    frequency = Column(String(20))
    start_date = Column(DateTime)
    end_date = Column(DateTime, nullable=True)
    installments = Column(Integer, nullable=True)
    bank = Column(String(100))
    mandate = Column(String(50))
    status = Column(String(20), default="Pending")
    date = Column(DateTime, default=datetime.utcnow)

    investor = relationship("Investor", back_populates="sips")

class SWPTransaction(Base):
    __tablename__ = "swp_transactions"
    txn_id = Column(Integer, primary_key=True, autoincrement=True)
    reg_id = Column(String(20), unique=True, index=True)
    investor_id = Column(Integer, ForeignKey("investor_master.investor_id"))
    folio_number = Column(String(50))
    scheme_id = Column(String(50))
    amount = Column(Float)
    units = Column(Float)
    nav = Column(Float)
    frequency = Column(String(20))
    start_date = Column(Date)           # Add this column
    end_date = Column(Date, nullable=True)  # If applicable
    installments = Column(Integer, nullable=True)
    date = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="Pending")
    bank = Column(String(100))
    payment_mode = Column(String(50))

    investor = relationship("Investor", back_populates="swps")

    @property
    def mandate(self):
        return self.payment_mode

class STPTransaction(Base):
    __tablename__ = "stp_transactions"
    txn_id = Column(Integer, primary_key=True, autoincrement=True)
    investor_id = Column(Integer, ForeignKey("investor_master.investor_id"))
    folio_number = Column(String(50))
    from_scheme_id = Column(String(50))
    to_scheme_id = Column(String(50))
    amount = Column(Float)
    units = Column(Float)
    nav = Column(Float)
    date = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="Pending")

    investor = relationship("Investor", back_populates="stps")

class SwitchTransaction(Base):
    __tablename__ = "switch_transactions"
    txn_id = Column(Integer, primary_key=True, autoincrement=True)
    investor_id = Column(Integer, ForeignKey("investor_master.investor_id"))
    folio_number = Column(String(50))
    from_scheme_id = Column(String(50))
    to_scheme_id = Column(String(50))
    amount = Column(Float)
    units = Column(Float)
    nav = Column(Float)
    date = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="Pending")
    investor = relationship("Investor", back_populates="switch_transactions")

class TransactionLedger(Base):
    __tablename__ = "transaction_ledger"
    txn_id = Column(Integer, primary_key=True, autoincrement=True)
    investor_id = Column(Integer, ForeignKey("investor_master.investor_id"))
    folio_number = Column(String(50), ForeignKey("folio_summary.folio_number"))
    scheme_id = Column(String(50))
    txn_type = Column(String(50)) 
    amount = Column(Float)
    units = Column(Float)
    nav = Column(Float)
    date = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20))
    bank = Column(String(100))
    payment_mode = Column(String(50))
    investor = relationship("Investor", back_populates="transactions")
    folio = relationship("FolioSummary", back_populates="ledgers")

class FolioSummary(Base):
    __tablename__ = "folio_summary"

    folio_number = Column(String(50), primary_key=True)
    investor_id = Column(Integer, ForeignKey("investor_master.investor_id"))
    scheme_id = Column(String(50))
    total_units = Column(Float, default=0)
    total_value = Column(Float, default=0)
    last_nav = Column(Float, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow)
    investor = relationship("Investor", back_populates="folios")
    ledgers = relationship("TransactionLedger", back_populates="folio")

class CapitalGains(Base):
    __tablename__ = "capital_gains"

    id = Column(Integer, primary_key=True, autoincrement=True)
    investor_id = Column(Integer, ForeignKey("investor_master.investor_id"))
    scheme_id = Column(String(50))
    folio_number = Column(String(50))
    buy_date = Column(Date)
    sell_date = Column(Date)
    buy_amount = Column(Float)
    sell_amount = Column(Float)
    gains = Column(Float)
    gain_type = Column(String(20))  # "Long-term" or "Short-term"
    created_at = Column(DateTime, default=datetime.utcnow)

    investor = relationship("Investor")

class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    investor_id = Column(Integer, ForeignKey("investor_master.investor_id"), nullable=False)
    device = Column(String(255))
    ip_address = Column(String(45))
    created_at = Column(DateTime, default=datetime.utcnow)
    last_active = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    investor = relationship("Investor")