from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models import Loan
from app.repositories.base import BaseRepository


class LoanRepository(BaseRepository[Loan]):
    def __init__(self, session: AsyncSession):
        super().__init__(Loan, session)

    async def get_by_customer_id(self, customer_id: int) -> List[Loan]:
        result = await self.session.execute(
            select(Loan).where(Loan.customer_id == customer_id)
        )
        return list(result.scalars().all())
