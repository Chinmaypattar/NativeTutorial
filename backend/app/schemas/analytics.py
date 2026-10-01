from datetime import date
from typing import List, Optional
from pydantic import BaseModel


class AffordabilityRequest(BaseModel):
    customer_id: Optional[int] = None
    item_name: str = "Car"
    total_cost: float
    down_payment: float = 0.0
    loan_tenure_months: Optional[int] = 60
    estimated_monthly_emi: Optional[float] = None
    category: str = "Vehicle"


class AffordabilityResponse(BaseModel):
    is_affordable: bool
    verdict: str  # AFFORDABLE, CAUTION_STRETCH, UNADVISABLE
    item_name: str
    total_cost: float
    monthly_impact: float
    current_debt_to_income: float
    projected_debt_to_income: float
    emergency_fund_buffer_months: float
    analysis_details: List[str]
    suggested_alternative: Optional[str] = None


class DailyCashflowPoint(BaseModel):
    date: date
    projected_balance: float
    inflows: float = 0.0
    outflows: float = 0.0
    event_description: Optional[str] = None


class CashflowForecastResponse(BaseModel):
    customer_id: int
    forecast_days: int
    current_liquid_balance: float
    projected_end_balance: float
    lowest_projected_balance: float
    lowest_balance_date: date
    run_out_of_money_risk: bool
    risk_level: str  # Low, Medium, High
    predicted_shortfall: float = 0.0
    insights: List[str]
    timeline: List[DailyCashflowPoint]
