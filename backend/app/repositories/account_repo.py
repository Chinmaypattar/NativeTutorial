from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.models import Account
from app.repositories.base import BaseRepository


class AccountRepository(BaseRepository[Account]):
    def __init__(self, session: AsyncSession):
        super().__init__(Account, session)

    async def get_by_customer_id(self, customer_id: int, account_type: Optional[str] = None) -> List[Account]:
        query = select(Account).where(Account.customer_id == customer_id)
        if account_type:
            query = query.where(Account.account_type.ilike(f"%{account_type}%"))
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_by_account_number(self, account_number: str) -> Optional[Account]:
        result = await self.session.execute(select(Account).where(Account.account_number == account_number))
        return result.scalars().first()
