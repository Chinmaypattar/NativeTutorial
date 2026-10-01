from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel, ConfigDict


class TransactionBase(BaseModel):
    amount: float
    transaction_type: str
    category: str
    merchant_name: Optional[str] = None
    beneficiary_name: Optional[str] = None
    description: Optional[str] = None
    timestamp: datetime
    status: str = "posted"


class TransactionResponse(TransactionBase):
    id: int
    account_id: int

    model_config = ConfigDict(from_attributes=True)


class TransactionFilter(BaseModel):
    customer_id: Optional[int] = None
    account_id: Optional[int] = None
    merchant: Optional[str] = None
    category: Optional[str] = None
    beneficiary: Optional[str] = None
    min_amount: Optional[float] = None
    max_amount: Optional[float] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    limit: int = 50


class SpendSummary(BaseModel):
    total_spend: float
    transaction_count: int
    average_spend: float
    currency: str = "INR"
    category_breakdown: Dict[str, float] = {}
    merchant_breakdown: Dict[str, float] = {}
