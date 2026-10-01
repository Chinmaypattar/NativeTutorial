from datetime import date
from pydantic import BaseModel, ConfigDict


class CreditCardBase(BaseModel):
    card_number_last4: str
    card_network: str
    credit_limit: float
    available_credit: float
    current_balance: float
    due_date: date
    minimum_due: float
    reward_points: int
    apr: float = 36.0
    status: str = "active"


class CreditCardResponse(CreditCardBase):
    id: int
    customer_id: int

    model_config = ConfigDict(from_attributes=True)


class CardUtilization(BaseModel):
    total_credit_limit: float
    total_current_balance: float
    total_available_credit: float
    utilization_percentage: float
    total_minimum_due: float
    cards_count: int
