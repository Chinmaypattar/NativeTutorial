from datetime import datetime, timedelta, timezone
from typing import List
from app.repositories.account_repo import AccountRepository
from app.repositories.credit_card_repo import CardRepository
from app.repositories.customer_repo import CustomerRepository
from app.repositories.loan_repo import LoanRepository
from app.repositories.transaction_repo import TransactionRepository
from app.schemas.financial_wellness import FinancialHealthScore, PillarScore


class FinancialHealthService:
    def __init__(
        self,
        customer_repo: CustomerRepository,
        account_repo: AccountRepository,
        transaction_repo: TransactionRepository,
        card_repo: CardRepository,
        loan_repo: LoanRepository,
    ):
        self.customer_repo = customer_repo
        self.account_repo = account_repo
        self.transaction_repo = transaction_repo
        self.card_repo = card_repo
        self.loan_repo = loan_repo

    async def calculate_health_score(self, customer_id: int) -> FinancialHealthScore:
        customer = await self.customer_repo.get_by_id(customer_id)
        monthly_income = customer.monthly_income if customer and customer.monthly_income > 0 else 100000.0

        # 1. Total liquid balance (Savings & Checking)
        accounts = await self.account_repo.get_by_customer_id(customer_id)
        liquid_balance = sum(a.balance for a in accounts if a.status == "active")

        # 2. Monthly spend (last 30 days)
        now = datetime.now(timezone.utc)
        thirty_days_ago = now - timedelta(days=30)
        sixty_days_ago = now - timedelta(days=60)

        recent_spend_data = await self.transaction_repo.get_spend_metrics(
            customer_id=customer_id,
            start_date=thirty_days_ago,
            end_date=now,
        )
        monthly_expenses = recent_spend_data["total"] if recent_spend_data["total"] > 0 else 40000.0

        prev_spend_data = await self.transaction_repo.get_spend_metrics(
            customer_id=customer_id,
            start_date=sixty_days_ago,
            end_date=thirty_days_ago,
        )
        prev_monthly_expenses = prev_spend_data["total"]

        # 3. Monthly Loan EMI
        loans = await self.loan_repo.get_by_customer_id(customer_id)
        total_monthly_emi = sum(l.monthly_emi for l in loans if l.status == "active")

        # 4. Credit Card Utilization
        cards = await self.card_repo.get_by_customer_id(customer_id)
        total_card_limit = sum(c.credit_limit for c in cards)
        total_card_balance = sum(c.current_balance for c in cards)
        utilization = (total_card_balance / total_card_limit * 100) if total_card_limit > 0 else 0.0

        # Calculations
        # Pillar 1: Savings Rate (Weight 25%)
        monthly_savings = max(0.0, monthly_income - monthly_expenses - total_monthly_emi)
        savings_rate = (monthly_savings / monthly_income) * 100
        if savings_rate >= 30:
            savings_score = 100.0
            savings_status = "Excellent"
            savings_rec = "Superb savings rate! Consider allocating excess savings to index funds or SIPs."
        elif savings_rate >= 20:
            savings_score = 85.0
            savings_status = "Good"
            savings_rec = "Healthy savings rate meeting standard 50/30/20 guidelines."
        elif savings_rate >= 10:
            savings_score = 65.0
            savings_status = "Fair"
            savings_rec = "Try to optimize discretionary dining and shopping to reach a 20% savings rate."
        else:
            savings_score = 40.0
            savings_status = "Needs Attention"
            savings_rec = "Savings rate is below 10%. Review recurring subscriptions and variable spend."

        # Pillar 2: Debt-to-Income (DTI) (Weight 25%)
        dti = (total_monthly_emi / monthly_income) * 100
        if dti <= 20:
            debt_score = 100.0
            debt_status = "Excellent"
            debt_rec = "Very low debt obligations. High borrowing flexibility."
        elif dti <= 35:
            debt_score = 80.0
            debt_status = "Good"
            debt_rec = "Manageable debt load within safe banking thresholds."
        elif dti <= 45:
            debt_score = 60.0
            debt_status = "Fair"
            debt_rec = "Moderate debt level. Avoid taking on new loans or revolving card balances."
        else:
            debt_score = 35.0
            debt_status = "Needs Attention"
            debt_rec = "High debt burden. Focus on prepaying high-interest debt."

        # Pillar 3: Spending Ratio (Weight 20%)
        spend_ratio = (monthly_expenses / monthly_income) * 100
        if spend_ratio <= 45:
            spend_score = 100.0
            spend_status = "Excellent"
            spend_rec = "Living well below means. Excellent cashflow control."
        elif spend_ratio <= 60:
            spend_score = 80.0
            spend_status = "Good"
            spend_rec = "Good budget discipline."
        elif spend_ratio <= 75:
            spend_score = 60.0
            spend_status = "Fair"
            spend_rec = "Spending is taking up a significant portion of income."
        else:
            spend_score = 40.0
            spend_status = "Needs Attention"
            spend_rec = "High cash burn rate. Consider tracking weekly discretionary spends."

        # Pillar 4: Credit Utilization (Weight 15%)
        if utilization <= 15:
            card_score = 100.0
            card_status = "Excellent"
            card_rec = "Optimal credit card utilization boosting your credit score."
        elif utilization <= 30:
            card_score = 85.0
            card_status = "Good"
            card_rec = "Utilization within recommended <30% industry benchmark."
        elif utilization <= 50:
            card_score = 60.0
            card_status = "Fair"
            card_rec = "Utilization is slightly high. Making mid-cycle payments can improve your score."
        else:
            card_score = 30.0
            card_status = "Needs Attention"
            card_rec = "High card utilization (>50%) negatively impacts credit health."

        # Pillar 5: Emergency Fund Runway (Weight 15%)
        emergency_months = liquid_balance / monthly_expenses if monthly_expenses > 0 else 6.0
        if emergency_months >= 6.0:
            emergency_score = 100.0
            emergency_status = "Excellent"
            emergency_rec = "Robust emergency cushion covering over 6 months of expenses."
        elif emergency_months >= 3.0:
            emergency_score = 80.0
            emergency_status = "Good"
            emergency_rec = "Good 3-month safety buffer. Aim to build towards 6 months."
        elif emergency_months >= 1.5:
            emergency_score = 60.0
            emergency_status = "Fair"
            emergency_rec = "Limited cushion. Building an emergency bucket should be a priority."
        else:
            emergency_score = 30.0
            emergency_status = "Needs Attention"
            emergency_rec = "Low liquidity buffer. Vulnerable to unexpected medical or car expenses."

        # Overall weighted score
        overall = int(
            savings_score * 0.25
            + debt_score * 0.25
            + spend_score * 0.20
            + card_score * 0.15
            + emergency_score * 0.15
        )

        grade = "Excellent" if overall >= 80 else "Good" if overall >= 65 else "Fair" if overall >= 50 else "Needs Improvement"

        pillars = [
            PillarScore(name="Savings Rate", score=savings_score, weight=0.25, status=savings_status, recommendation=savings_rec),
            PillarScore(name="Debt to Income (DTI)", score=debt_score, weight=0.25, status=debt_status, recommendation=debt_rec),
            PillarScore(name="Spending Ratio", score=spend_score, weight=0.20, status=spend_status, recommendation=spend_rec),
            PillarScore(name="Credit Utilization", score=card_score, weight=0.15, status=card_status, recommendation=card_rec),
            PillarScore(name="Emergency Runway", score=emergency_score, weight=0.15, status=emergency_status, recommendation=emergency_rec),
        ]

        # Opportunities & Trends
        opportunities = [
            f"You could save ₹{round(monthly_income * 0.05, 0):,.0f} more per month by reducing food delivery & retail impulse purchases.",
            f"With ₹{liquid_balance:,.0f} in savings, you have {round(emergency_months, 1)} months of emergency buffer.",
        ]

        trends = []
        if prev_monthly_expenses > 0:
            change_pct = ((monthly_expenses - prev_monthly_expenses) / prev_monthly_expenses) * 100
            direction = "increased" if change_pct > 0 else "decreased"
            trends.append(f"Discretionary spending {direction} by {abs(round(change_pct, 1))}% compared to previous month.")
        else:
            trends.append("Spending is steady across utility, shopping, and food categories.")

        return FinancialHealthScore(
            customer_id=customer_id,
            overall_score=overall,
            grade=grade,
            savings_rate_percentage=round(savings_rate, 1),
            debt_to_income_percentage=round(dti, 1),
            credit_utilization_percentage=round(utilization, 1),
            emergency_fund_months=round(emergency_months, 1),
            pillars=pillars,
            summary=f"Your overall financial health is rated {grade} ({overall}/100). Your savings rate is {round(savings_rate, 1)}% and debt-to-income is {round(dti, 1)}%.",
            savings_opportunities=opportunities,
            spending_trends=trends,
        )
