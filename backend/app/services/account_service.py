from typing import List, Optional
from app.core.exceptions import AccountNotFoundException
from app.core.security import mask_account_number
from app.repositories.account_repo import AccountRepository
from app.schemas.account import AccountResponse, AccountSummary


class AccountService:
    def __init__(self, account_repo: AccountRepository):
        self.account_repo = account_repo

    async def get_customer_accounts(self, customer_id: int, account_type: Optional[str] = None) -> List[AccountResponse]:
        accounts = await self.account_repo.get_by_customer_id(customer_id, account_type)
        return [
            AccountResponse(
                id=acc.id,
                customer_id=acc.customer_id,
                account_number=acc.account_number,
                masked_account_number=mask_account_number(acc.account_number),
                account_type=acc.account_type,
                balance=acc.balance,
                currency=acc.currency,
                status=acc.status,
                created_at=acc.created_at,
                updated_at=acc.updated_at,
            )
            for acc in accounts
        ]

    async def get_account_summary(self, customer_id: int) -> AccountSummary:
        accounts = await self.account_repo.get_by_customer_id(customer_id)
        total = sum(a.balance for a in accounts)
        savings = sum(a.balance for a in accounts if "saving" in a.account_type.lower())
        checking = sum(a.balance for a in accounts if "checking" in a.account_type.lower())

        account_responses = [
            AccountResponse(
                id=acc.id,
                customer_id=acc.customer_id,
                account_number=acc.account_number,
                masked_account_number=mask_account_number(acc.account_number),
                account_type=acc.account_type,
                balance=acc.balance,
                currency=acc.currency,
                status=acc.status,
                created_at=acc.created_at,
                updated_at=acc.updated_at,
            )
            for acc in accounts
        ]

        return AccountSummary(
            total_balance=round(total, 2),
            savings_balance=round(savings, 2),
            checking_balance=round(checking, 2),
            currency=accounts[0].currency if accounts else "INR",
            account_count=len(accounts),
            accounts=account_responses,
        )

    async def get_total_liquid_balance(self, customer_id: int) -> float:
        accounts = await self.account_repo.get_by_customer_id(customer_id)
        return sum(a.balance for a in accounts if a.status == "active")
