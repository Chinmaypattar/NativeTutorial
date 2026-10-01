from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models import SavingsBucket
from app.repositories.base import BaseRepository


class SavingsBucketRepository(BaseRepository[SavingsBucket]):
    def __init__(self, session: AsyncSession):
        super().__init__(SavingsBucket, session)

    async def get_by_customer_id(self, customer_id: int) -> List[SavingsBucket]:
        result = await self.session.execute(
            select(SavingsBucket)
            .where(SavingsBucket.customer_id == customer_id)
            .order_by(SavingsBucket.target_date.asc())
        )
        return list(result.scalars().all())

    async def get_by_name(self, customer_id: int, name: str) -> Optional[SavingsBucket]:
        result = await self.session.execute(
            select(SavingsBucket)
            .where(SavingsBucket.customer_id == customer_id)
            .where(SavingsBucket.name.ilike(f"%{name}%"))
        )
        return result.scalars().first()
