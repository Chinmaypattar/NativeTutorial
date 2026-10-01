from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_current_customer_id, get_customer_repo
from app.repositories.customer_repo import CustomerRepository
from app.schemas.customer import CustomerResponse

router = APIRouter()


@router.get("/me", response_model=CustomerResponse)
async def get_current_customer_profile(
    customer_id: int = Depends(get_current_customer_id),
    customer_repo: CustomerRepository = Depends(get_customer_repo),
):
    customer = await customer_repo.get_by_id(customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer
