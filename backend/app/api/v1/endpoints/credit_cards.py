from typing import List
from fastapi import APIRouter, Depends
from app.api.deps import get_card_service, get_current_customer_id
from app.schemas.credit_card import CardUtilization, CreditCardResponse
from app.services.credit_card_service import CardService

router = APIRouter()


@router.get("", response_model=List[CreditCardResponse])
async def list_cards(
    customer_id: int = Depends(get_current_customer_id),
    card_service: CardService = Depends(get_card_service),
):
    return await card_service.get_customer_cards(customer_id)


@router.get("/utilization", response_model=CardUtilization)
async def card_utilization(
    customer_id: int = Depends(get_current_customer_id),
    card_service: CardService = Depends(get_card_service),
):
    return await card_service.get_card_utilization(customer_id)
