from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.core.security import mask_account_number


class AccountBase(BaseModel):
    account_number: str
    account_type: str
    balance: float
    currency: str = "INR"
    status: str = "active"


class AccountResponse(AccountBase):
    id: int
    customer_id: int
    masked_account_number: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def from_orm_masked(cls, obj):
        res = cls.model_validate(obj)
        res.masked_account_number = mask_account_number(obj.account_number)
        return res


class AccountSummary(BaseModel):
    total_balance: float
    savings_balance: float
    checking_balance: float
    currency: str = "INR"
    account_count: int
