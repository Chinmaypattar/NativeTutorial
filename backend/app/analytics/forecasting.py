from datetime import date, timedelta
from typing import List
from app.repositories.account_repo import AccountRepository
from app.repositories.credit_card_repo import CardRepository
from app.repositories.customer_repo import CustomerRepository
from app.repositories.loan_repo import LoanRepository
from app.repositories.transaction_repo import TransactionRepository
from app.schemas.analytics import CashflowForecastResponse, DailyCashflowPoint


class CashflowForecaster:
    def __init__(
        self,
        customer_repo: CustomerRepository,
        account_repo: AccountRepository,
        loan_repo: LoanRepository,
        card_repo: CardRepository,
        transaction_repo: TransactionRepository,
    ):
        self.customer_repo = customer_repo
        self.account_repo = account_repo
        self.loan_repo = loan_repo
        self.card_repo = card_repo
        self.transaction_repo = transaction_repo

    async def forecast_cashflow(self, customer_id: int, days_ahead: int = 30) -> CashflowForecastResponse:
        customer = await self.customer_repo.get_by_id(customer_id)
        monthly_income = customer.monthly_income if customer and customer.monthly_income > 0 else 95000.0

        accounts = await self.account_repo.get_by_customer_id(customer_id)
        current_balance = sum(a.balance for a in accounts if a.status == "active")

        loans = await self.loan_repo.get_by_customer_id(customer_id)
        cards = await self.card_repo.get_by_customer_id(customer_id)

        # Estimate daily discretionary spend based on past transactions
        recent_spend = await self.transaction_repo.get_spend_metrics(customer_id=customer_id)
        daily_discretionary = (recent_spend["total"] / 30) if recent_spend["total"] > 0 else 1200.0

        today = date.today()
        timeline: List[DailyCashflowPoint] = []
        running_balance = current_balance
        lowest_balance = current_balance
        lowest_date = today

        # Assume salary arrives on 1st or last working day of month
        for day_offset in range(1, days_ahead + 1):
            current_day = today + timedelta(days=day_offset)
            inflows = 0.0
            outflows = daily_discretionary
            events = []

            # Salary arrival simulation (end of month / day 1)
            if current_day.day == 1:
                inflows += monthly_income
                events.append(f"Salary Credit: +₹{monthly_income:,.0f}")

            # Loan EMI due dates
            for loan in loans:
                if loan.status == "active" and loan.next_due_date.day == current_day.day:
                    outflows += loan.monthly_emi
                    events.append(f"{loan.loan_type.capitalize()} Loan EMI: -₹{loan.monthly_emi:,.0f}")

            # Credit Card bill due dates
            for card in cards:
                if card.due_date.day == current_day.day and card.current_balance > 0:
                    outflows += card.current_balance
                    events.append(f"Credit Card Bill (••••{card.card_number_last4}): -₹{card.current_balance:,.0f}")

            running_balance += inflows - outflows
            if running_balance < lowest_balance:
                lowest_balance = running_balance
                lowest_date = current_day

            timeline.append(
                DailyCashflowPoint(
                    date=current_day,
                    projected_balance=round(running_balance, 2),
                    inflows=round(inflows, 2),
                    outflows=round(outflows, 2),
                    event_description=", ".join(events) if events else None,
                )
            )

        run_out_of_money = lowest_balance < 0
        predicted_shortfall = abs(lowest_balance) if lowest_balance < 0 else 0.0

        if run_out_of_money:
            risk_level = "High"
        elif lowest_balance < 25000:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        insights = []
        if run_out_of_money:
            insights.append(
                f"Warning: Cashflow shortfall projected around {lowest_date.strftime('%B %d')} of approximately ₹{predicted_shortfall:,.0f} due to overlapping bill dues."
            )
            insights.append("Recommendation: Transfer funds from secondary savings or pay credit card minimum due instead of total.")
        else:
            insights.append(
                f"You are safe! Your lowest projected balance will be ₹{lowest_balance:,.0f} on {lowest_date.strftime('%B %d')}."
            )
            insights.append(
                f"Projected month-end balance will be ₹{running_balance:,.0f}, leaving positive net cashflow."
            )

        return CashflowForecastResponse(
            customer_id=customer_id,
            forecast_days=days_ahead,
            current_liquid_balance=round(current_balance, 2),
            projected_end_balance=round(running_balance, 2),
            lowest_projected_balance=round(lowest_balance, 2),
            lowest_balance_date=lowest_date,
            run_out_of_money_risk=run_out_of_money,
            risk_level=risk_level,
            predicted_shortfall=round(predicted_shortfall, 2),
            insights=insights,
            timeline=timeline,
        )
