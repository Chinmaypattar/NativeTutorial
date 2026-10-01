import math
from datetime import date
from typing import List, Optional
from app.database.models import SavingsBucket
from app.repositories.savings_bucket_repo import SavingsBucketRepository
from app.schemas.savings_bucket import SavingsBucketCreate, SavingsBucketResponse


class SavingsBucketService:
    def __init__(self, bucket_repo: SavingsBucketRepository):
        self.bucket_repo = bucket_repo

    async def get_buckets(self, customer_id: int) -> List[SavingsBucketResponse]:
        buckets = await self.bucket_repo.get_by_customer_id(customer_id)
        today = date.today()
        result = []

        for b in buckets:
            months_remaining = max(1, (b.target_date.year - today.year) * 12 + (b.target_date.month - today.month))
            remaining_amount = max(0.0, b.target_amount - b.current_amount)
            monthly_required = round(remaining_amount / months_remaining, 2)
            progress = round((b.current_amount / b.target_amount * 100), 1) if b.target_amount > 0 else 0.0

            result.append(
                SavingsBucketResponse(
                    id=b.id,
                    customer_id=b.customer_id,
                    name=b.name,
                    target_amount=b.target_amount,
                    current_amount=b.current_amount,
                    target_date=b.target_date,
                    monthly_contribution=b.monthly_contribution,
                    status=b.status,
                    progress_percentage=min(100.0, progress),
                    monthly_savings_required=monthly_required,
                    months_remaining=months_remaining,
                )
            )
        return result

    async def create_bucket(self, customer_id: int, bucket_in: SavingsBucketCreate) -> SavingsBucketResponse:
        today = date.today()
        months_remaining = max(1, (bucket_in.target_date.year - today.year) * 12 + (bucket_in.target_date.month - today.month))
        remaining_amount = max(0.0, bucket_in.target_amount - bucket_in.initial_deposit)
        monthly_required = round(remaining_amount / months_remaining, 2)

        bucket_model = SavingsBucket(
            customer_id=customer_id,
            name=bucket_in.name,
            target_amount=bucket_in.target_amount,
            current_amount=bucket_in.initial_deposit,
            target_date=bucket_in.target_date,
            monthly_contribution=monthly_required,
            status="active",
        )
        created = await self.bucket_repo.create(bucket_model)

        progress = round((created.current_amount / created.target_amount * 100), 1) if created.target_amount > 0 else 0.0

        return SavingsBucketResponse(
            id=created.id,
            customer_id=created.customer_id,
            name=created.name,
            target_amount=created.target_amount,
            current_amount=created.current_amount,
            target_date=created.target_date,
            monthly_contribution=created.monthly_contribution,
            status=created.status,
            progress_percentage=min(100.0, progress),
            monthly_savings_required=monthly_required,
            months_remaining=months_remaining,
        )
