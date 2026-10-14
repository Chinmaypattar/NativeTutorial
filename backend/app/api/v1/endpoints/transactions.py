from datetime import datetime, timezone
import random
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_account_repo, get_current_customer_id, get_transaction_service
from app.database.models import Account, Transaction
from app.database.session import get_db
from app.repositories.account_repo import AccountRepository
from app.schemas.transaction import SpendSummary, TransactionFilter, TransactionResponse
from app.services.transaction_service import TransactionService

router = APIRouter()


class TransferRequest(BaseModel):
    source_account_id: int
    beneficiary_name: str
    beneficiary_account: str
    amount: float = Field(..., gt=0)
    remarks: Optional[str] = "IMPS Fund Transfer"


class TransferResponse(BaseModel):
    reference_id: str
    status: str
    amount: float
    source_account_id: int
    beneficiary_name: str
    remaining_balance: float
    timestamp: str


class BillPayRequest(BaseModel):
    account_id: int
    biller_name: str
    bill_category: str = "Electricity"
    consumer_number: str
    amount: float = Field(..., gt=0)


class BillPayResponse(BaseModel):
    reference_id: str
    status: str
    amount: float
    biller_name: str
    consumer_number: str
    remaining_balance: float
    timestamp: str


@router.get("", response_model=List[TransactionResponse])
@router.get("/", response_model=List[TransactionResponse])
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


@router.post("/transfer", response_model=TransferResponse)
async def transfer_funds(
    req: TransferRequest,
    customer_id: int = Depends(get_current_customer_id),
    db: AsyncSession = Depends(get_db),
    account_repo: AccountRepository = Depends(get_account_repo),
):
    account = await account_repo.get_by_id(req.source_account_id)
    if not account or account.customer_id != customer_id:
        raise HTTPException(status_code=404, detail="Source account not found.")

    if account.balance < req.amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient funds. Available balance is ₹{account.balance:,.2f}",
        )

    # 1. Deduct balance
    account.balance -= req.amount

    # 2. Record Transaction
    now = datetime.now(timezone.utc)
    ref_id = f"APX{random.randint(10000000, 99999999)}"
    txn = Transaction(
        account_id=account.id,
        amount=req.amount,
        transaction_type="transfer",
        category="Transfers",
        beneficiary_name=req.beneficiary_name,
        description=f"Transfer to {req.beneficiary_name} ({req.remarks or 'IMPS'}) - Ref: {ref_id}",
        timestamp=now,
        status="posted",
    )
    db.add(txn)
    await db.commit()
    await db.refresh(account)

    return TransferResponse(
        reference_id=ref_id,
        status="SUCCESS",
        amount=req.amount,
        source_account_id=account.id,
        beneficiary_name=req.beneficiary_name,
        remaining_balance=account.balance,
        timestamp=now.isoformat(),
    )


@router.post("/pay-bill", response_model=BillPayResponse)
async def pay_bill(
    req: BillPayRequest,
    customer_id: int = Depends(get_current_customer_id),
    db: AsyncSession = Depends(get_db),
    account_repo: AccountRepository = Depends(get_account_repo),
):
    account = await account_repo.get_by_id(req.account_id)
    if not account or account.customer_id != customer_id:
        raise HTTPException(status_code=404, detail="Source account not found.")

    if account.balance < req.amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient funds. Available balance is ₹{account.balance:,.2f}",
        )

    # 1. Deduct balance
    account.balance -= req.amount

    # 2. Record Transaction
    now = datetime.now(timezone.utc)
    ref_id = f"BIL{random.randint(10000000, 99999999)}"
    txn = Transaction(
        account_id=account.id,
        amount=req.amount,
        transaction_type="debit",
        category="Bills & Utilities",
        merchant_name=req.biller_name,
        description=f"Bill Payment to {req.biller_name} ({req.consumer_number}) - Ref: {ref_id}",
        timestamp=now,
        status="posted",
    )
    db.add(txn)
    await db.commit()
    await db.refresh(account)

    return BillPayResponse(
        reference_id=ref_id,
        status="SUCCESS",
        amount=req.amount,
        biller_name=req.biller_name,
        consumer_number=req.consumer_number,
        remaining_balance=account.balance,
        timestamp=now.isoformat(),
    )


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
