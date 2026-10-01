from typing import List
from fastapi import APIRouter, Depends
from app.api.deps import get_current_customer_id, get_loan_service
from app.schemas.loan import LoanResponse, LoanSummary
from app.services.loan_service import LoanService

router = APIRouter()


@router.get("", response_model=List[LoanResponse])
async def list_loans(
    customer_id: int = Depends(get_current_customer_id),
    loan_service: LoanService = Depends(get_loan_service),
):
    return await loan_service.get_customer_loans(customer_id)


@router.get("/summary", response_model=LoanSummary)
async def loan_summary(
    customer_id: int = Depends(get_current_customer_id),
    loan_service: LoanService = Depends(get_loan_service),
):
    return await loan_service.get_loan_summary(customer_id)
