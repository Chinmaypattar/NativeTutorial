from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional
from app.repositories.transaction_repo import TransactionRepository
from app.schemas.transaction import SpendSummary, TransactionFilter, TransactionResponse


class TransactionService:
    def __init__(self, transaction_repo: TransactionRepository):
        self.transaction_repo = transaction_repo

    async def get_transactions(self, filters: TransactionFilter) -> List[TransactionResponse]:
        txns = await self.transaction_repo.get_filtered_transactions(
            customer_id=filters.customer_id,
            account_id=filters.account_id,
            merchant=filters.merchant,
            category=filters.category,
            beneficiary=filters.beneficiary,
            min_amount=filters.min_amount,
            max_amount=filters.max_amount,
            start_date=filters.start_date,
            end_date=filters.end_date,
            limit=filters.limit,
        )
        return [TransactionResponse.model_validate(t) for t in txns]

    async def get_spend_summary(
        self,
        customer_id: int,
        merchant: Optional[str] = None,
        category: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> SpendSummary:
        metrics = await self.transaction_repo.get_spend_metrics(
            customer_id=customer_id,
            merchant=merchant,
            category=category,
            start_date=start_date,
            end_date=end_date,
        )

        # Get category breakdown
        cat_breakdown = await self.transaction_repo.get_category_breakdown(
            customer_id=customer_id,
            start_date=start_date,
            end_date=end_date,
        )
        cat_dict = {cat: amount for cat, amount in cat_breakdown}

        return SpendSummary(
            total_spend=round(metrics["total"], 2),
            transaction_count=metrics["count"],
            average_spend=round(metrics["average"], 2),
            category_breakdown=cat_dict,
        )

    async def get_monthly_spending_trend(self, customer_id: int) -> Dict[str, Any]:
        """Compares last 30 days spending vs previous 30 days spending."""
        now = datetime.now(timezone.utc)
        thirty_days_ago = now - timedelta(days=30)
        sixty_days_ago = now - timedelta(days=60)

        current_metrics = await self.transaction_repo.get_spend_metrics(
            customer_id=customer_id,
            start_date=thirty_days_ago,
            end_date=now,
        )
        prev_metrics = await self.transaction_repo.get_spend_metrics(
            customer_id=customer_id,
            start_date=sixty_days_ago,
            end_date=thirty_days_ago,
        )

        curr_total = current_metrics["total"]
        prev_total = prev_metrics["total"]

        if prev_total > 0:
            percentage_change = ((curr_total - prev_total) / prev_total) * 100
        else:
            percentage_change = 0.0

        return {
            "current_month_spend": round(curr_total, 2),
            "previous_month_spend": round(prev_total, 2),
            "percentage_change": round(percentage_change, 1),
            "is_increase": percentage_change > 0,
        }
