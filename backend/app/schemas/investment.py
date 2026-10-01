from datetime import date
from typing import Dict, List
from pydantic import BaseModel, ConfigDict


class InvestmentBase(BaseModel):
    asset_name: str
    asset_type: str
    quantity: float
    purchase_price: float
    current_value: float
    returns_percentage: float
    invested_date: date


class InvestmentResponse(InvestmentBase):
    id: int
    customer_id: int

    model_config = ConfigDict(from_attributes=True)


class PortfolioSummary(BaseModel):
    total_invested: float
    total_current_value: float
    total_returns_amount: float
    overall_returns_percentage: float
    asset_allocation: Dict[str, float] = {}
