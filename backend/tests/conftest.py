import asyncio
import os
import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from app.analytics.affordability import AffordabilityEngine
from app.analytics.forecasting import CashflowForecaster
from app.database.base import Base
from app.database.session import get_db
from app.main import app
from app.repositories.account_repo import AccountRepository
from app.repositories.audit_repo import AuditRepository
from app.repositories.chat_repo import ChatRepository
from app.repositories.credit_card_repo import CardRepository
from app.repositories.customer_repo import CustomerRepository
from app.repositories.investment_repo import InvestmentRepository
from app.repositories.loan_repo import LoanRepository
from app.repositories.savings_bucket_repo import SavingsBucketRepository
from app.repositories.transaction_repo import TransactionRepository
from app.seed.seed_data import seed_database
from app.services.account_service import AccountService
from app.services.credit_card_service import CardService
from app.services.financial_health_service import FinancialHealthService
from app.services.investment_service import InvestmentService
from app.services.loan_service import LoanService
from app.services.offer_service import OfferRecommendationService
from app.services.savings_bucket_service import SavingsBucketService
from app.services.transaction_service import TransactionService
from app.tools.banking_tools import BankingTools
from app.ai.orchestrator import AIOrchestrator

TEST_DB_URL = "sqlite+aiosqlite:///./test_banking_copilot.db"


@pytest_asyncio.fixture(scope="session")
async def test_engine():
    engine = create_async_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()
    if os.path.exists("./test_banking_copilot.db"):
        os.remove("./test_banking_copilot.db")


@pytest_asyncio.fixture
async def db_session(test_engine):
    session_factory = async_sessionmaker(bind=test_engine, class_=AsyncSession, expire_on_commit=False)
    async with session_factory() as session:
        # Seed test database
        await seed_database(session)
        yield session


@pytest_asyncio.fixture
def banking_stack(db_session):
    customer_repo = CustomerRepository(db_session)
    account_repo = AccountRepository(db_session)
    transaction_repo = TransactionRepository(db_session)
    card_repo = CardRepository(db_session)
    loan_repo = LoanRepository(db_session)
    inv_repo = InvestmentRepository(db_session)
    bucket_repo = SavingsBucketRepository(db_session)
    chat_repo = ChatRepository(db_session)
    audit_repo = AuditRepository(db_session)

    account_svc = AccountService(account_repo)
    txn_svc = TransactionService(transaction_repo)
    card_svc = CardService(card_repo)
    loan_svc = LoanService(loan_repo)
    inv_svc = InvestmentService(inv_repo)
    bucket_svc = SavingsBucketService(bucket_repo)
    health_svc = FinancialHealthService(customer_repo, account_repo, transaction_repo, card_repo, loan_repo)
    offer_svc = OfferRecommendationService(customer_repo, account_repo, card_repo, loan_repo, transaction_repo)
    affordability = AffordabilityEngine(customer_repo, account_repo, loan_repo, transaction_repo)
    forecaster = CashflowForecaster(customer_repo, account_repo, loan_repo, card_repo, transaction_repo)

    tools = BankingTools(
        account_service=account_svc,
        transaction_service=txn_svc,
        card_service=card_svc,
        loan_service=loan_svc,
        investment_service=inv_svc,
        savings_service=bucket_svc,
        health_service=health_svc,
        offer_service=offer_svc,
        affordability_engine=affordability,
        forecaster=forecaster,
    )

    orchestrator = AIOrchestrator(
        banking_tools=tools,
        chat_repo=chat_repo,
        audit_repo=audit_repo,
    )

    return {
        "customer_repo": customer_repo,
        "account_repo": account_repo,
        "transaction_repo": transaction_repo,
        "card_repo": card_repo,
        "loan_repo": loan_repo,
        "inv_repo": inv_repo,
        "bucket_repo": bucket_repo,
        "chat_repo": chat_repo,
        "audit_repo": audit_repo,
        "account_svc": account_svc,
        "txn_svc": txn_svc,
        "card_svc": card_svc,
        "loan_svc": loan_svc,
        "inv_svc": inv_svc,
        "bucket_svc": bucket_svc,
        "health_svc": health_svc,
        "offer_svc": offer_svc,
        "affordability": affordability,
        "forecaster": forecaster,
        "tools": tools,
        "orchestrator": orchestrator,
    }


@pytest_asyncio.fixture
async def async_client(db_session):
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client
    app.dependency_overrides.clear()
