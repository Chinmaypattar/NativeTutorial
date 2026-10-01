import math
from typing import List
from app.repositories.account_repo import AccountRepository
from app.repositories.customer_repo import CustomerRepository
from app.repositories.loan_repo import LoanRepository
from app.repositories.transaction_repo import TransactionRepository
from app.schemas.analytics import AffordabilityRequest, AffordabilityResponse


class AffordabilityEngine:
    def __init__(
        self,
        customer_repo: CustomerRepository,
        account_repo: AccountRepository,
        loan_repo: LoanRepository,
        transaction_repo: TransactionRepository,
    ):
        self.customer_repo = customer_repo
        self.account_repo = account_repo
        self.loan_repo = loan_repo
        self.transaction_repo = transaction_repo

    async def evaluate_affordability(
        self, customer_id: int, request: AffordabilityRequest
    ) -> AffordabilityResponse:
        customer = await self.customer_repo.get_by_id(customer_id)
        monthly_income = customer.monthly_income if customer and customer.monthly_income > 0 else 100000.0

        accounts = await self.account_repo.get_by_customer_id(customer_id)
        liquid_savings = sum(a.balance for a in accounts if a.status == "active")

        # Existing loans
        loans = await self.loan_repo.get_by_customer_id(customer_id)
        existing_emi = sum(l.monthly_emi for l in loans if l.status == "active")
        current_dti = (existing_emi / monthly_income) * 100 if monthly_income > 0 else 0.0

        # Calculate new monthly EMI if not provided
        loan_amount = max(0.0, request.total_cost - request.down_payment)
        tenure_months = request.loan_tenure_months or 60
        annual_rate = 0.095  # 9.5% typical auto/personal loan rate

        if request.estimated_monthly_emi:
            new_emi = request.estimated_monthly_emi
        elif loan_amount > 0:
            monthly_r = annual_rate / 12
            new_emi = (
                loan_amount
                * (monthly_r * math.pow(1 + monthly_r, tenure_months))
                / (math.pow(1 + monthly_r, tenure_months) - 1)
            )
        else:
            new_emi = 0.0

        projected_total_emi = existing_emi + new_emi
        projected_dti = (projected_total_emi / monthly_income) * 100 if monthly_income > 0 else 0.0

        # Remaining liquid savings after down payment
        post_savings = max(0.0, liquid_savings - request.down_payment)

        # Average monthly living expense estimate
        recent_spend = await self.transaction_repo.get_spend_metrics(customer_id=customer_id)
        avg_monthly_expense = recent_spend["average"] * 25 if recent_spend["count"] > 0 else 40000.0
        emergency_buffer_months = post_savings / avg_monthly_expense if avg_monthly_expense > 0 else 3.0

        details: List[str] = []
        details.append(f"Estimated new monthly commitment: ₹{new_emi:,.0f} for {tenure_months} months.")
        details.append(f"Debt-to-Income (DTI) ratio would increase from {round(current_dti, 1)}% to {round(projected_dti, 1)}%.")
        details.append(f"Liquid savings after down payment of ₹{request.down_payment:,.0f} would be ₹{post_savings:,.0f} ({round(emergency_buffer_months, 1)} months buffer).")

        # Verdict logic
        if projected_dti <= 35 and emergency_buffer_months >= 3.0:
            is_affordable = True
            verdict = "AFFORDABLE"
            details.append("Your income comfortably covers the EMI while maintaining a healthy debt profile and savings buffer.")
            alternative = None
        elif projected_dti <= 45 and emergency_buffer_months >= 1.5:
            is_affordable = True
            verdict = "CAUTION_STRETCH"
            details.append("This purchase will significantly tighten your monthly discretionary cashflow.")
            alternative = f"Consider increasing down payment to ₹{request.down_payment + 100000:,.0f} or extending tenure to 72 months to lower EMI below ₹{new_emi * 0.8:,.0f}."
        else:
            is_affordable = False
            verdict = "UNADVISABLE"
            details.append("This purchase exceeds safe debt capacity limits (>45% DTI) or dangerously depletes your emergency buffer.")
            alternative = "We advise delaying this purchase until existing debts are reduced or saving a larger down payment."

        return AffordabilityResponse(
            is_affordable=is_affordable,
            verdict=verdict,
            item_name=request.item_name,
            total_cost=request.total_cost,
            monthly_impact=round(new_emi, 2),
            current_debt_to_income=round(current_dti, 1),
            projected_debt_to_income=round(projected_dti, 1),
            emergency_fund_buffer_months=round(emergency_buffer_months, 1),
            analysis_details=details,
            suggested_alternative=alternative,
        )
