from datetime import datetime, timezone
import uuid
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    Date,
    ForeignKey,
    Text,
    Boolean,
)
from sqlalchemy.orm import relationship
from app.database.base import Base


def utcnow():
    return datetime.now(timezone.utc)


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=True)
    hashed_password = Column(String(255), nullable=True)
    annual_income = Column(Float, default=0.0, nullable=False)
    monthly_income = Column(Float, default=0.0, nullable=False)
    credit_score = Column(Integer, default=700, nullable=False)
    risk_profile = Column(String(50), default="moderate", nullable=False)  # conservative, moderate, aggressive
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

    # Relationships
    accounts = relationship("Account", back_populates="customer", cascade="all, delete-orphan")
    credit_cards = relationship("CreditCard", back_populates="customer", cascade="all, delete-orphan")
    loans = relationship("Loan", back_populates="customer", cascade="all, delete-orphan")
    investments = relationship("Investment", back_populates="customer", cascade="all, delete-orphan")
    savings_buckets = relationship("SavingsBucket", back_populates="customer", cascade="all, delete-orphan")
    chat_sessions = relationship("ChatSession", back_populates="customer", cascade="all, delete-orphan")


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False, index=True)
    account_number = Column(String(50), unique=True, nullable=False)
    account_type = Column(String(50), nullable=False)  # savings, checking
    balance = Column(Float, default=0.0, nullable=False)
    currency = Column(String(10), default="INR", nullable=False)
    status = Column(String(20), default="active", nullable=False)  # active, frozen, closed
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

    # Relationships
    customer = relationship("Customer", back_populates="accounts")
    transactions = relationship("Transaction", back_populates="account", cascade="all, delete-orphan")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    transaction_type = Column(String(20), nullable=False)  # debit, credit, transfer
    category = Column(String(100), nullable=False, index=True)  # Shopping, Food & Dining, Bills, etc.
    merchant_name = Column(String(150), nullable=True, index=True)  # Flipkart, Amazon, etc.
    beneficiary_name = Column(String(150), nullable=True, index=True)  # Rahul Sharma, etc.
    description = Column(String(255), nullable=True)
    timestamp = Column(DateTime(timezone=True), default=utcnow, nullable=False, index=True)
    status = Column(String(20), default="posted", nullable=False)  # posted, pending

    # Relationships
    account = relationship("Account", back_populates="transactions")


class CreditCard(Base):
    __tablename__ = "credit_cards"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False, index=True)
    card_number_last4 = Column(String(4), nullable=False)
    card_network = Column(String(50), default="Visa", nullable=False)  # Visa, Mastercard, RuPay
    credit_limit = Column(Float, nullable=False)
    available_credit = Column(Float, nullable=False)
    current_balance = Column(Float, default=0.0, nullable=False)
    due_date = Column(Date, nullable=False)
    minimum_due = Column(Float, default=0.0, nullable=False)
    reward_points = Column(Integer, default=0, nullable=False)
    apr = Column(Float, default=36.0, nullable=False)  # Annual Percentage Rate
    status = Column(String(20), default="active", nullable=False)

    # Relationships
    customer = relationship("Customer", back_populates="credit_cards")


class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False, index=True)
    loan_type = Column(String(50), nullable=False)  # mortgage, auto, personal
    principal_amount = Column(Float, nullable=False)
    remaining_balance = Column(Float, nullable=False)
    interest_rate = Column(Float, nullable=False)
    term_months = Column(Integer, nullable=False)
    monthly_emi = Column(Float, nullable=False)
    next_due_date = Column(Date, nullable=False)
    status = Column(String(20), default="active", nullable=False)

    # Relationships
    customer = relationship("Customer", back_populates="loans")


class Investment(Base):
    __tablename__ = "investments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False, index=True)
    asset_name = Column(String(150), nullable=False)  # Nifty 50 Index Fund, HDFC Bluechip, etc.
    asset_type = Column(String(50), nullable=False)  # mutual_fund, stock, fixed_deposit, gold, crypto
    quantity = Column(Float, default=1.0, nullable=False)
    purchase_price = Column(Float, nullable=False)
    current_value = Column(Float, nullable=False)
    returns_percentage = Column(Float, default=0.0, nullable=False)
    invested_date = Column(Date, nullable=False)

    # Relationships
    customer = relationship("Customer", back_populates="investments")


class SavingsBucket(Base):
    __tablename__ = "savings_buckets"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False, index=True)
    name = Column(String(100), nullable=False)  # Vacation, Emergency Fund, New Laptop
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0, nullable=False)
    target_date = Column(Date, nullable=False)
    monthly_contribution = Column(Float, default=0.0, nullable=False)
    status = Column(String(20), default="active", nullable=False)  # active, completed

    # Relationships
    customer = relationship("Customer", back_populates="savings_buckets")


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False, index=True)
    session_title = Column(String(255), default="Financial Assistant Chat", nullable=False)
    context_data = Column(Text, default="{}", nullable=False)  # JSON string for entity memory
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

    # Relationships
    customer = relationship("Customer", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan", order_by="ChatMessage.id")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(String(64), ForeignKey("chat_sessions.id"), nullable=False, index=True)
    role = Column(String(20), nullable=False)  # user, assistant, system, tool
    content = Column(Text, nullable=False)
    tool_calls = Column(Text, nullable=True)  # JSON string of tool calls
    tool_call_id = Column(String(64), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    # Relationships
    session = relationship("ChatSession", back_populates="messages")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_id = Column(Integer, nullable=True, index=True)
    action = Column(String(100), nullable=False)
    tool_name = Column(String(100), nullable=True)
    parameters = Column(Text, nullable=True)  # Sanitized JSON parameters
    status = Column(String(20), default="success", nullable=False)
    ip_address = Column(String(50), nullable=True)
    timestamp = Column(DateTime(timezone=True), default=utcnow, nullable=False)
