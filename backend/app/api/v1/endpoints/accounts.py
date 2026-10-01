from typing import List, Optional
from fastapi import APIRouter, Depends
from app.api.deps import get_account_service, get_current_customer_id
from app.schemas.account import AccountResponse, AccountSummary
from app.services.account_service import AccountService

router = APIRouter()


@router.get("", response_model=List[AccountResponse])
async def list_accounts(
    account_type: Optional[str] = None,
    customer_id: int = Depends(get_current_customer_id),
    account_service: AccountService = Depends(get_account_service),
):
    return await account_service.get_customer_accounts(customer_id, account_type)


@router.get("/summary", response_model=AccountSummary)
async def get_summary(
    customer_id: int = Depends(get_current_customer_id),
    account_service: AccountService = Depends(get_account_service),
):
    return await account_service.get_account_summary(customer_id)
