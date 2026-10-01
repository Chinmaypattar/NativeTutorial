from datetime import date
from pydantic import BaseModel, ConfigDict


class LoanBase(BaseModel):
    loan_type: str
    principal_amount: float
    remaining_balance: float
    interest_rate: float
    term_months: int
    monthly_emi: float
    next_due_date: date
    status: str = "active"


class LoanResponse(LoanBase):
    id: int
    customer_id: int

    model_config = ConfigDict(from_attributes=True)


class LoanSummary(BaseModel):
    total_debt: float
    total_monthly_emi: float
    active_loans_count: int
    debt_to_income_ratio: float
