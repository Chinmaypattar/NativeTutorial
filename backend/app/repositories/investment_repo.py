from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models import Investment
from app.repositories.base import BaseRepository


class InvestmentRepository(BaseRepository[Investment]):
    def __init__(self, session: AsyncSession):
        super().__init__(Investment, session)

    async def get_by_customer_id(self, customer_id: int) -> List[Investment]:
        result = await self.session.execute(
            select(Investment).where(Investment.customer_id == customer_id)
        )
        return list(result.scalars().all())
