from typing import List
from app.repositories.investment_repo import InvestmentRepository
from app.schemas.investment import InvestmentResponse, PortfolioSummary


class InvestmentService:
    def __init__(self, investment_repo: InvestmentRepository):
        self.investment_repo = investment_repo

    async def get_customer_investments(self, customer_id: int) -> List[InvestmentResponse]:
        investments = await self.investment_repo.get_by_customer_id(customer_id)
        return [InvestmentResponse.model_validate(inv) for inv in investments]

    async def get_portfolio_summary(self, customer_id: int) -> PortfolioSummary:
        investments = await self.investment_repo.get_by_customer_id(customer_id)
        if not investments:
            return PortfolioSummary(
                total_invested=0.0,
                total_current_value=0.0,
                total_returns_amount=0.0,
                overall_returns_percentage=0.0,
                asset_allocation={},
            )

        total_invested = sum(inv.purchase_price * inv.quantity for inv in investments)
        total_current = sum(inv.current_value for inv in investments)
        total_returns = total_current - total_invested

        returns_pct = (total_returns / total_invested * 100) if total_invested > 0 else 0.0

        # Group by asset_type
        allocation = {}
        for inv in investments:
            allocation[inv.asset_type] = allocation.get(inv.asset_type, 0.0) + inv.current_value

        allocation_pct = {
            k: round((v / total_current * 100), 1) if total_current > 0 else 0.0
            for k, v in allocation.items()
        }

        return PortfolioSummary(
            total_invested=round(total_invested, 2),
            total_current_value=round(total_current, 2),
            total_returns_amount=round(total_returns, 2),
            overall_returns_percentage=round(returns_pct, 2),
            asset_allocation=allocation_pct,
        )
