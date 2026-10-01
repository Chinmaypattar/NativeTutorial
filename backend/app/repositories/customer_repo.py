from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models import Customer
from app.repositories.base import BaseRepository


class CustomerRepository(BaseRepository[Customer]):
    def __init__(self, session: AsyncSession):
        super().__init__(Customer, session)

    async def get_by_email(self, email: str) -> Optional[Customer]:
        result = await self.session.execute(select(Customer).where(Customer.email == email))
        return result.scalars().first()
