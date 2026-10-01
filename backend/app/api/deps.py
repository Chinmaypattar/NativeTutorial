from typing import AsyncGenerator
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.analytics.affordability import AffordabilityEngine
from app.analytics.forecasting import CashflowForecaster
from app.core.config import settings
from app.core.security import decode_access_token
from app.database.session import get_db
from app.repositories.account_repo import AccountRepository
from app.repositories.audit_repo import AuditRepository
from app.repositories.chat_repo import ChatRepository
from app.repositories.credit_card_repo import CardRepository
from app.repositories.customer_repo import CustomerRepository
from app.repositories.investment_repo import InvestmentRepository
from app.repositories.loan_repo import LoanRepository
from app.repositories.savings_bucket_repo import SavingsBucketRepository
from app.repositories.transaction_repo import TransactionRepository
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

security = HTTPBearer(auto_error=False)


# Repositories
def get_customer_repo(db: AsyncSession = Depends(get_db)) -> CustomerRepository:
    return CustomerRepository(db)


def get_account_repo(db: AsyncSession = Depends(get_db)) -> AccountRepository:
    return AccountRepository(db)


def get_transaction_repo(db: AsyncSession = Depends(get_db)) -> TransactionRepository:
    return TransactionRepository(db)


def get_card_repo(db: AsyncSession = Depends(get_db)) -> CardRepository:
    return CardRepository(db)


def get_loan_repo(db: AsyncSession = Depends(get_db)) -> LoanRepository:
    return LoanRepository(db)


def get_investment_repo(db: AsyncSession = Depends(get_db)) -> InvestmentRepository:
    return InvestmentRepository(db)


def get_savings_bucket_repo(db: AsyncSession = Depends(get_db)) -> SavingsBucketRepository:
    return SavingsBucketRepository(db)


def get_chat_repo(db: AsyncSession = Depends(get_db)) -> ChatRepository:
    return ChatRepository(db)


def get_audit_repo(db: AsyncSession = Depends(get_db)) -> AuditRepository:
    return AuditRepository(db)


# Services
def get_account_service(account_repo: AccountRepository = Depends(get_account_repo)) -> AccountService:
    return AccountService(account_repo)


def get_transaction_service(transaction_repo: TransactionRepository = Depends(get_transaction_repo)) -> TransactionService:
    return TransactionService(transaction_repo)


def get_card_service(card_repo: CardRepository = Depends(get_card_repo)) -> CardService:
    return CardService(card_repo)


def get_loan_service(loan_repo: LoanRepository = Depends(get_loan_repo)) -> LoanService:
    return LoanService(loan_repo)


def get_investment_service(investment_repo: InvestmentRepository = Depends(get_investment_repo)) -> InvestmentService:
    return InvestmentService(investment_repo)


def get_savings_bucket_service(bucket_repo: SavingsBucketRepository = Depends(get_savings_bucket_repo)) -> SavingsBucketService:
    return SavingsBucketService(bucket_repo)


def get_financial_health_service(
    customer_repo: CustomerRepository = Depends(get_customer_repo),
    account_repo: AccountRepository = Depends(get_account_repo),
    transaction_repo: TransactionRepository = Depends(get_transaction_repo),
    card_repo: CardRepository = Depends(get_card_repo),
    loan_repo: LoanRepository = Depends(get_loan_repo),
) -> FinancialHealthService:
    return FinancialHealthService(customer_repo, account_repo, transaction_repo, card_repo, loan_repo)


def get_offer_service(
    customer_repo: CustomerRepository = Depends(get_customer_repo),
    account_repo: AccountRepository = Depends(get_account_repo),
    card_repo: CardRepository = Depends(get_card_repo),
    loan_repo: LoanRepository = Depends(get_loan_repo),
    transaction_repo: TransactionRepository = Depends(get_transaction_repo),
) -> OfferRecommendationService:
    return OfferRecommendationService(customer_repo, account_repo, card_repo, loan_repo, transaction_repo)


# Analytics
def get_affordability_engine(
    customer_repo: CustomerRepository = Depends(get_customer_repo),
    account_repo: AccountRepository = Depends(get_account_repo),
    loan_repo: LoanRepository = Depends(get_loan_repo),
    transaction_repo: TransactionRepository = Depends(get_transaction_repo),
) -> AffordabilityEngine:
    return AffordabilityEngine(customer_repo, account_repo, loan_repo, transaction_repo)


def get_cashflow_forecaster(
    customer_repo: CustomerRepository = Depends(get_customer_repo),
    account_repo: AccountRepository = Depends(get_account_repo),
    loan_repo: LoanRepository = Depends(get_loan_repo),
    card_repo: CardRepository = Depends(get_card_repo),
    transaction_repo: TransactionRepository = Depends(get_transaction_repo),
) -> CashflowForecaster:
    return CashflowForecaster(customer_repo, account_repo, loan_repo, card_repo, transaction_repo)


# Banking Tools
def get_banking_tools(
    account_service: AccountService = Depends(get_account_service),
    transaction_service: TransactionService = Depends(get_transaction_service),
    card_service: CardService = Depends(get_card_service),
    loan_service: LoanService = Depends(get_loan_service),
    investment_service: InvestmentService = Depends(get_investment_service),
    savings_service: SavingsBucketService = Depends(get_savings_bucket_service),
    health_service: FinancialHealthService = Depends(get_financial_health_service),
    offer_service: OfferRecommendationService = Depends(get_offer_service),
    affordability_engine: AffordabilityEngine = Depends(get_affordability_engine),
    forecaster: CashflowForecaster = Depends(get_cashflow_forecaster),
) -> BankingTools:
    return BankingTools(
        account_service=account_service,
        transaction_service=transaction_service,
        card_service=card_service,
        loan_service=loan_service,
        investment_service=investment_service,
        savings_service=savings_service,
        health_service=health_service,
        offer_service=offer_service,
        affordability_engine=affordability_engine,
        forecaster=forecaster,
    )


# AI Orchestrator
def get_orchestrator(
    banking_tools: BankingTools = Depends(get_banking_tools),
    chat_repo: ChatRepository = Depends(get_chat_repo),
    audit_repo: AuditRepository = Depends(get_audit_repo),
) -> AIOrchestrator:
    return AIOrchestrator(
        banking_tools=banking_tools,
        chat_repo=chat_repo,
        audit_repo=audit_repo,
    )


# Current Customer
async def get_current_customer_id(
    auth: HTTPAuthorizationCredentials = Security(security),
) -> int:
    """Returns customer_id from JWT or defaults to settings.DEFAULT_CUSTOMER_ID (Pranita) for dev testing."""
    if auth and auth.credentials:
        payload = decode_access_token(auth.credentials)
        if payload and "sub" in payload:
            try:
                return int(payload["sub"])
            except ValueError:
                pass
    return settings.DEFAULT_CUSTOMER_ID
