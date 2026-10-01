from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from app.api.deps import get_current_customer_id, get_transaction_service
from app.schemas.transaction import SpendSummary, TransactionFilter, TransactionResponse
from app.services.transaction_service import TransactionService

router = APIRouter()


@router.get("", response_model=List[TransactionResponse])
async def list_transactions(
    account_id: Optional[int] = None,
    merchant: Optional[str] = None,
    category: Optional[str] = None,
    beneficiary: Optional[str] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: int = Query(50, le=200),
    customer_id: int = Depends(get_current_customer_id),
    transaction_service: TransactionService = Depends(get_transaction_service),
):
    filters = TransactionFilter(
        customer_id=customer_id,
        account_id=account_id,
        merchant=merchant,
        category=category,
        beneficiary=beneficiary,
        min_amount=min_amount,
        max_amount=max_amount,
        start_date=start_date,
        end_date=end_date,
        limit=limit,
    )
    return await transaction_service.get_transactions(filters)


@router.get("/spend-summary", response_model=SpendSummary)
async def spend_summary(
    merchant: Optional[str] = None,
    category: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    customer_id: int = Depends(get_current_customer_id),
    transaction_service: TransactionService = Depends(get_transaction_service),
):
    return await transaction_service.get_spend_summary(
        customer_id=customer_id,
        merchant=merchant,
        category=category,
        start_date=start_date,
        end_date=end_date,
    )


@router.get("/trends")
async def spending_trends(
    customer_id: int = Depends(get_current_customer_id),
    transaction_service: TransactionService = Depends(get_transaction_service),
):
    return await transaction_service.get_monthly_spending_trend(customer_id)
