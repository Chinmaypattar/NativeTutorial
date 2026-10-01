from typing import List
from app.repositories.loan_repo import LoanRepository
from app.schemas.loan import LoanResponse, LoanSummary


class LoanService:
    def __init__(self, loan_repo: LoanRepository):
        self.loan_repo = loan_repo

    async def get_customer_loans(self, customer_id: int) -> List[LoanResponse]:
        loans = await self.loan_repo.get_by_customer_id(customer_id)
        return [LoanResponse.model_validate(l) for l in loans]

    async def get_loan_summary(self, customer_id: int, monthly_income: float = 0.0) -> LoanSummary:
        loans = await self.loan_repo.get_by_customer_id(customer_id)
        active_loans = [l for l in loans if l.status == "active"]

        total_debt = sum(l.remaining_balance for l in active_loans)
        total_monthly_emi = sum(l.monthly_emi for l in active_loans)

        dti = (total_monthly_emi / monthly_income * 100) if monthly_income > 0 else 0.0

        return LoanSummary(
            total_debt=round(total_debt, 2),
            total_monthly_emi=round(total_monthly_emi, 2),
            active_loans_count=len(active_loans),
            debt_to_income_ratio=round(dti, 2),
        )
