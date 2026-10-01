from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict


class SavingsBucketBase(BaseModel):
    name: str
    target_amount: float
    current_amount: float = 0.0
    target_date: date
    monthly_contribution: float = 0.0
    status: str = "active"


class SavingsBucketCreate(BaseModel):
    name: str
    target_amount: float
    target_date: date
    initial_deposit: float = 0.0


class SavingsBucketResponse(SavingsBucketBase):
    id: int
    customer_id: int
    progress_percentage: float
    monthly_savings_required: float
    months_remaining: int

    model_config = ConfigDict(from_attributes=True)
