from fastapi import APIRouter, Depends
from app.api.deps import get_current_customer_id, get_offer_service
from app.schemas.offers import OfferRecommendationResponse
from app.services.offer_service import OfferRecommendationService

router = APIRouter()


@router.get("", response_model=OfferRecommendationResponse)
async def get_offers(
    customer_id: int = Depends(get_current_customer_id),
    offer_service: OfferRecommendationService = Depends(get_offer_service),
):
    return await offer_service.get_personalized_offers(customer_id)
