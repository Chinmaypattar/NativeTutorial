from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from app.analytics.affordability import AffordabilityEngine
from app.analytics.forecasting import CashflowForecaster
from app.schemas.analytics import AffordabilityRequest
from app.schemas.savings_bucket import SavingsBucketCreate
from app.schemas.transaction import TransactionFilter
from app.services.account_service import AccountService
from app.services.credit_card_service import CardService
from app.services.financial_health_service import FinancialHealthService
from app.services.investment_service import InvestmentService
from app.services.loan_service import LoanService
from app.services.offer_service import OfferRecommendationService
from app.services.savings_bucket_service import SavingsBucketService
from app.services.transaction_service import TransactionService


class BankingTools:
    def __init__(
        self,
        account_service: AccountService,
        transaction_service: TransactionService,
        card_service: CardService,
        loan_service: LoanService,
        investment_service: InvestmentService,
        savings_service: SavingsBucketService,
        health_service: FinancialHealthService,
        offer_service: OfferRecommendationService,
        affordability_engine: AffordabilityEngine,
        forecaster: CashflowForecaster,
    ):
        self.account_service = account_service
        self.transaction_service = transaction_service
        self.card_service = card_service
        self.loan_service = loan_service
        self.investment_service = investment_service
        self.savings_service = savings_service
        self.health_service = health_service
        self.offer_service = offer_service
        self.affordability_engine = affordability_engine
        self.forecaster = forecaster

    async def get_transactions(
        self,
        customer_id: int,
        merchant: Optional[str] = None,
        category: Optional[str] = None,
        beneficiary: Optional[str] = None,
        min_amount: Optional[float] = None,
        max_amount: Optional[float] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        limit: int = 15,
    ) -> Dict[str, Any]:
        """Generic transaction query answering queries like 'How much on Flipkart?', 'Show food expenses', etc."""
        parsed_start = datetime.fromisoformat(start_date) if start_date else None
        parsed_end = datetime.fromisoformat(end_date) if end_date else None

        # Filtered transactions
        filters = TransactionFilter(
            customer_id=customer_id,
            merchant=merchant,
            category=category,
            beneficiary=beneficiary,
            min_amount=min_amount,
            max_amount=max_amount,
            start_date=parsed_start,
            end_date=parsed_end,
            limit=limit,
        )
        txns = await self.transaction_service.get_transactions(filters)

        # Spend metrics
        spend_summary = await self.transaction_service.get_spend_summary(
            customer_id=customer_id,
            merchant=merchant,
            category=category,
            start_date=parsed_start,
            end_date=parsed_end,
        )

        return {
            "total_spend": spend_summary.total_spend,
            "transaction_count": spend_summary.transaction_count,
            "average_spend": spend_summary.average_spend,
            "category_breakdown": spend_summary.category_breakdown,
            "transactions": [
                {
                    "date": t.timestamp.strftime("%Y-%m-%d"),
                    "amount": t.amount,
                    "merchant": t.merchant_name,
                    "category": t.category,
                    "type": t.transaction_type,
                    "description": t.description,
                }
                for t in txns
            ],
        }

    async def get_accounts(
        self,
        customer_id: int,
        account_type: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Supports balance inquiries, savings and checking breakdowns."""
        accounts = await self.account_service.get_customer_accounts(customer_id, account_type)
        summary = await self.account_service.get_account_summary(customer_id)
        return {
            "total_balance": summary.total_balance,
            "savings_balance": summary.savings_balance,
            "checking_balance": summary.checking_balance,
            "currency": summary.currency,
            "accounts": [
                {
                    "account_type": a.account_type,
                    "masked_number": a.masked_account_number,
                    "balance": a.balance,
                    "status": a.status,
                }
                for a in accounts
            ],
        }

    async def get_credit_cards(self, customer_id: int) -> Dict[str, Any]:
        """Supports credit card limits, available credit, dues, utilization, and rewards."""
        cards = await self.card_service.get_customer_cards(customer_id)
        utilization = await self.card_service.get_card_utilization(customer_id)
        return {
            "total_credit_limit": utilization.total_credit_limit,
            "total_current_balance": utilization.total_current_balance,
            "total_available_credit": utilization.total_available_credit,
            "utilization_percentage": utilization.utilization_percentage,
            "cards": [
                {
                    "card_network": c.card_network,
                    "card_number_last4": f"••••{c.card_number_last4}",
                    "credit_limit": c.credit_limit,
                    "available_credit": c.available_credit,
                    "current_balance": c.current_balance,
                    "due_date": c.due_date.isoformat(),
                    "minimum_due": c.minimum_due,
                    "reward_points": c.reward_points,
                }
                for c in cards
            ],
        }

    async def get_loans(self, customer_id: int) -> Dict[str, Any]:
        """Supports mortgage, auto, personal loans, remaining balances, and EMIs."""
        loans = await self.loan_service.get_customer_loans(customer_id)
        summary = await self.loan_service.get_loan_summary(customer_id)
        return {
            "total_outstanding_debt": summary.total_debt,
            "total_monthly_emi": summary.total_monthly_emi,
            "active_loans": [
                {
                    "loan_type": l.loan_type,
                    "principal_amount": l.principal_amount,
                    "remaining_balance": l.remaining_balance,
                    "interest_rate": f"{l.interest_rate}%",
                    "monthly_emi": l.monthly_emi,
                    "next_due_date": l.next_due_date.isoformat(),
                }
                for l in loans
            ],
        }

    async def get_investments(self, customer_id: int) -> Dict[str, Any]:
        """Supports portfolio valuation, asset allocation, and returns."""
        summary = await self.investment_service.get_portfolio_summary(customer_id)
        investments = await self.investment_service.get_customer_investments(customer_id)
        return {
            "total_invested": summary.total_invested,
            "total_current_value": summary.total_current_value,
            "total_returns": summary.total_returns_amount,
            "returns_percentage": f"{summary.overall_returns_percentage}%",
            "asset_allocation": summary.asset_allocation,
            "holdings": [
                {
                    "asset_name": inv.asset_name,
                    "asset_type": inv.asset_type,
                    "current_value": inv.current_value,
                    "returns_percentage": f"{inv.returns_percentage}%",
                }
                for inv in investments
            ],
        }

    async def calculate_financial_health(self, customer_id: int) -> Dict[str, Any]:
        """Supports 5-pillar financial health score, ratios, and coaching insights."""
        health = await self.health_service.calculate_health_score(customer_id)
        return health.model_dump()

    async def create_savings_bucket(
        self,
        customer_id: int,
        name: str,
        target_amount: float,
        target_date: str,
        initial_deposit: float = 0.0,
    ) -> Dict[str, Any]:
        """Creates a goal-oriented savings bucket and calculates required monthly contribution."""
        parsed_date = datetime.strptime(target_date, "%Y-%m-%d").date()
        bucket_in = SavingsBucketCreate(
            name=name,
            target_amount=target_amount,
            target_date=parsed_date,
            initial_deposit=initial_deposit,
        )
        res = await self.savings_service.create_bucket(customer_id, bucket_in)
        return res.model_dump()

    async def get_personalized_offers(self, customer_id: int) -> Dict[str, Any]:
        """Fetches tailored pre-approved loans, credit cards, and wealth offers."""
        offers = await self.offer_service.get_personalized_offers(customer_id)
        return offers.model_dump()

    async def check_affordability(
        self,
        customer_id: int,
        total_cost: float,
        item_name: str = "Purchase",
        down_payment: float = 0.0,
        loan_tenure_months: Optional[int] = 60,
        estimated_monthly_emi: Optional[float] = None,
    ) -> Dict[str, Any]:
        """Evaluates whether the user can afford a major purchase (e.g. Car, Home)."""
        req = AffordabilityRequest(
            customer_id=customer_id,
            item_name=item_name,
            total_cost=total_cost,
            down_payment=down_payment,
            loan_tenure_months=loan_tenure_months,
            estimated_monthly_emi=estimated_monthly_emi,
        )
        res = await self.affordability_engine.evaluate_affordability(customer_id, req)
        return res.model_dump()

    async def get_cashflow_forecast(
        self,
        customer_id: int,
        days_ahead: int = 30,
    ) -> Dict[str, Any]:
        """Predicts upcoming cashflow, balance trajectories, and shortfall risks."""
        res = await self.forecaster.forecast_cashflow(customer_id, days_ahead)
        return res.model_dump()
