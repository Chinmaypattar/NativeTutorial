from typing import Dict, List, Optional
from pydantic import BaseModel


class PillarScore(BaseModel):
    name: str
    score: float  # 0 to 100
    weight: float
    status: str  # Excellent, Good, Fair, Needs Attention
    recommendation: str


class FinancialHealthScore(BaseModel):
    customer_id: int
    overall_score: int  # 0 to 100
    grade: str  # Excellent, Good, Fair, Needs Improvement
    savings_rate_percentage: float
    debt_to_income_percentage: float
    credit_utilization_percentage: float
    emergency_fund_months: float
    pillars: List[PillarScore]
    summary: str
    savings_opportunities: List[str]
    spending_trends: List[str]
