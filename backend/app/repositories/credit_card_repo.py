from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models import CreditCard
from app.repositories.base import BaseRepository


class CardRepository(BaseRepository[CreditCard]):
    def __init__(self, session: AsyncSession):
        super().__init__(CreditCard, session)

    async def get_by_customer_id(self, customer_id: int) -> List[CreditCard]:
        result = await self.session.execute(
            select(CreditCard).where(CreditCard.customer_id == customer_id)
        )
        return list(result.scalars().all())

    async def get_by_last4(self, customer_id: int, card_number_last4: str) -> Optional[CreditCard]:
        result = await self.session.execute(
            select(CreditCard)
            .where(CreditCard.customer_id == customer_id)
            .where(CreditCard.card_number_last4 == card_number_last4)
        )
        return result.scalars().first()
