from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models import Account, Transaction
from app.repositories.base import BaseRepository


class TransactionRepository(BaseRepository[Transaction]):
    def __init__(self, session: AsyncSession):
        super().__init__(Transaction, session)

    async def get_filtered_transactions(
        self,
        customer_id: Optional[int] = None,
        account_id: Optional[int] = None,
        merchant: Optional[str] = None,
        category: Optional[str] = None,
        beneficiary: Optional[str] = None,
        min_amount: Optional[float] = None,
        max_amount: Optional[float] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        transaction_type: Optional[str] = None,
        limit: int = 50,
    ) -> List[Transaction]:
        query = select(Transaction).join(Account, Transaction.account_id == Account.id)

        if customer_id is not None:
            query = query.where(Account.customer_id == customer_id)
        if account_id is not None:
            query = query.where(Transaction.account_id == account_id)
        if merchant:
            query = query.where(Transaction.merchant_name.ilike(f"%{merchant}%"))
        if category:
            query = query.where(Transaction.category.ilike(f"%{category}%"))
        if beneficiary:
            query = query.where(Transaction.beneficiary_name.ilike(f"%{beneficiary}%"))
        if min_amount is not None:
            query = query.where(Transaction.amount >= min_amount)
        if max_amount is not None:
            query = query.where(Transaction.amount <= max_amount)
        if start_date is not None:
            query = query.where(Transaction.timestamp >= start_date)
        if end_date is not None:
            query = query.where(Transaction.timestamp <= end_date)
        if transaction_type is not None:
            query = query.where(Transaction.transaction_type == transaction_type)

        query = query.order_by(Transaction.timestamp.desc()).limit(limit)
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_spend_metrics(
        self,
        customer_id: int,
        merchant: Optional[str] = None,
        category: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> Dict[str, Any]:
        """Calculates total, count, and average spend for debit transactions."""
        query = (
            select(
                func.coalesce(func.sum(Transaction.amount), 0.0).label("total"),
                func.count(Transaction.id).label("count"),
                func.coalesce(func.avg(Transaction.amount), 0.0).label("average"),
            )
            .join(Account, Transaction.account_id == Account.id)
            .where(Account.customer_id == customer_id)
            .where(Transaction.transaction_type == "debit")
        )

        if merchant:
            query = query.where(Transaction.merchant_name.ilike(f"%{merchant}%"))
        if category:
            query = query.where(Transaction.category.ilike(f"%{category}%"))
        if start_date:
            query = query.where(Transaction.timestamp >= start_date)
        if end_date:
            query = query.where(Transaction.timestamp <= end_date)

        result = await self.session.execute(query)
        row = result.first()
        return {
            "total": float(row.total) if row else 0.0,
            "count": int(row.count) if row else 0,
            "average": float(row.average) if row else 0.0,
        }

    async def get_category_breakdown(
        self,
        customer_id: int,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> List[Tuple[str, float]]:
        query = (
            select(
                Transaction.category,
                func.coalesce(func.sum(Transaction.amount), 0.0).label("category_total"),
            )
            .join(Account, Transaction.account_id == Account.id)
            .where(Account.customer_id == customer_id)
            .where(Transaction.transaction_type == "debit")
        )

        if start_date:
            query = query.where(Transaction.timestamp >= start_date)
        if end_date:
            query = query.where(Transaction.timestamp <= end_date)

        query = query.group_by(Transaction.category).order_by(func.sum(Transaction.amount).desc())
        result = await self.session.execute(query)
        return [(str(row[0]), float(row[1])) for row in result.all()]
