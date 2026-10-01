from typing import List, Optional
from app.repositories.credit_card_repo import CardRepository
from app.schemas.credit_card import CardUtilization, CreditCardResponse


class CardService:
    def __init__(self, card_repo: CardRepository):
        self.card_repo = card_repo

    async def get_customer_cards(self, customer_id: int) -> List[CreditCardResponse]:
        cards = await self.card_repo.get_by_customer_id(customer_id)
        return [CreditCardResponse.model_validate(c) for c in cards]

    async def get_card_utilization(self, customer_id: int) -> CardUtilization:
        cards = await self.card_repo.get_by_customer_id(customer_id)
        if not cards:
            return CardUtilization(
                total_credit_limit=0.0,
                total_current_balance=0.0,
                total_available_credit=0.0,
                utilization_percentage=0.0,
                total_minimum_due=0.0,
                cards_count=0,
            )

        total_limit = sum(c.credit_limit for c in cards)
        total_balance = sum(c.current_balance for c in cards)
        total_avail = sum(c.available_credit for c in cards)
        total_min_due = sum(c.minimum_due for c in cards)

        utilization = (total_balance / total_limit * 100) if total_limit > 0 else 0.0

        return CardUtilization(
            total_credit_limit=round(total_limit, 2),
            total_current_balance=round(total_balance, 2),
            total_available_credit=round(total_avail, 2),
            utilization_percentage=round(utilization, 2),
            total_minimum_due=round(total_min_due, 2),
            cards_count=len(cards),
        )
