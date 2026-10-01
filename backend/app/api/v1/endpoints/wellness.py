from fastapi import APIRouter, Depends
from app.api.deps import get_current_customer_id, get_financial_health_service
from app.schemas.financial_wellness import FinancialHealthScore
from app.services.financial_health_service import FinancialHealthService

router = APIRouter()


@router.get("/score", response_model=FinancialHealthScore)
async def get_health_score(
    customer_id: int = Depends(get_current_customer_id),
    health_service: FinancialHealthService = Depends(get_financial_health_service),
):
    return await health_service.calculate_health_score(customer_id)
