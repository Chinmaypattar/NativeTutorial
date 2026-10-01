from fastapi import APIRouter
from app.api.v1.endpoints import (
    accounts,
    analytics,
    auth,
    chat,
    credit_cards,
    customers,
    investments,
    loans,
    offers,
    savings,
    transactions,
    wellness,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(customers.router, prefix="/customers", tags=["Customers"])
api_router.include_router(accounts.router, prefix="/accounts", tags=["Accounts"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])
api_router.include_router(credit_cards.router, prefix="/credit-cards", tags=["Credit Cards"])
api_router.include_router(loans.router, prefix="/loans", tags=["Loans"])
api_router.include_router(investments.router, prefix="/investments", tags=["Investments"])
api_router.include_router(savings.router, prefix="/savings-buckets", tags=["Savings Buckets"])
api_router.include_router(wellness.router, prefix="/wellness", tags=["Financial Wellness"])
api_router.include_router(offers.router, prefix="/offers", tags=["Personalized Offers"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Predictive Analytics"])
api_router.include_router(chat.router, prefix="/chat", tags=["Copilot Chat"])
