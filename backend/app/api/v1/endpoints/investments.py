from typing import List
from fastapi import APIRouter, Depends
from app.api.deps import get_current_customer_id, get_investment_service
from app.schemas.investment import InvestmentResponse, PortfolioSummary
from app.services.investment_service import InvestmentService

router = APIRouter()


@router.get("", response_model=List[InvestmentResponse])
async def list_investments(
    customer_id: int = Depends(get_current_customer_id),
    inv_service: InvestmentService = Depends(get_investment_service),
):
    return await inv_service.get_customer_investments(customer_id)


@router.get("/portfolio", response_model=PortfolioSummary)
async def portfolio_summary(
    customer_id: int = Depends(get_current_customer_id),
    inv_service: InvestmentService = Depends(get_investment_service),
):
    return await inv_service.get_portfolio_summary(customer_id)
