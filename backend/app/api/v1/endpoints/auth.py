from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.core.security import create_access_token
from app.repositories.customer_repo import CustomerRepository
from app.api.deps import get_customer_repo

router = APIRouter()


class LoginRequest(BaseModel):
    email: str
    password: str = "password"


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    customer_id: int
    customer_name: str


@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, customer_repo: CustomerRepository = Depends(get_customer_repo)):
    customer = await customer_repo.get_by_email(req.email)
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    token = create_access_token({"sub": str(customer.id), "email": customer.email})
    return TokenResponse(
        access_token=token,
        customer_id=customer.id,
        customer_name=f"{customer.first_name} {customer.last_name}",
    )
