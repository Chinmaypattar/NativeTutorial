from typing import List, Optional
from pydantic import BaseModel


class PersonalizedOffer(BaseModel):
    id: str
    product_type: str  # credit_card, personal_loan, investment, fixed_deposit
    title: str
    description: str
    benefits: List[str]
    interest_rate_or_rewards: str
    eligibility_status: str  # Pre-Approved, Recommended, Eligible
    action_url: Optional[str] = None


class OfferRecommendationResponse(BaseModel):
    customer_id: int
    customer_credit_score: int
    recommendations: List[PersonalizedOffer]
