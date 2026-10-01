from typing import List
from fastapi import APIRouter, Depends
from app.api.deps import get_current_customer_id, get_savings_bucket_service
from app.schemas.savings_bucket import SavingsBucketCreate, SavingsBucketResponse
from app.services.savings_bucket_service import SavingsBucketService

router = APIRouter()


@router.get("", response_model=List[SavingsBucketResponse])
async def list_buckets(
    customer_id: int = Depends(get_current_customer_id),
    bucket_service: SavingsBucketService = Depends(get_savings_bucket_service),
):
    return await bucket_service.get_buckets(customer_id)


@router.post("", response_model=SavingsBucketResponse)
async def create_bucket(
    bucket_in: SavingsBucketCreate,
    customer_id: int = Depends(get_current_customer_id),
    bucket_service: SavingsBucketService = Depends(get_savings_bucket_service),
):
    return await bucket_service.create_bucket(customer_id, bucket_in)
