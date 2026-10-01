from datetime import date, datetime, timedelta, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import hash_password
from app.database.models import (
    Account,
    CreditCard,
    Customer,
    Investment,
    Loan,
    SavingsBucket,
    Transaction,
)


async def seed_database(session: AsyncSession) -> None:
    # Check if already seeded
    existing_customer = await session.execute(select(Customer).where(Customer.email == "pranita@example.com"))
    if existing_customer.scalars().first():
        return  # Already seeded

    # 1. Customer: Pranita Sharma
    customer = Customer(
        first_name="Pranita",
        last_name="Sharma",
        email="pranita@example.com",
        phone="+91 98765 43210",
        hashed_password=hash_password("password123"),
        annual_income=1440000.0,
        monthly_income=120000.0,
        credit_score=785,
        risk_profile="moderate",
    )
    session.add(customer)
    await session.flush()

    # 2. Accounts (Exact values from FinancialDashboard.tsx)
    savings_acc = Account(
        customer_id=customer.id,
        account_number="185430019283",
        account_type="Savings Account",
        balance=185430.00,
        currency="INR",
        status="active",
    )
    checking_acc = Account(
        customer_id=customer.id,
        account_number="602500194821",
        account_type="Checking Account",
        balance=60250.50,
        currency="INR",
        status="active",
    )
    session.add_all([savings_acc, checking_acc])
    await session.flush()

    # 3. Credit Card
    next_month = date.today().replace(day=15) + timedelta(days=30)
    card = CreditCard(
        customer_id=customer.id,
        card_number_last4="4589",
        card_network="Visa Signature",
        credit_limit=250000.0,
        available_credit=218500.0,
        current_balance=31500.0,
        due_date=next_month,
        minimum_due=1575.0,
        reward_points=14250,
        apr=34.5,
        status="active",
    )
    session.add(card)

    # 4. Loan (Auto loan)
    loan_due = date.today().replace(day=5) + timedelta(days=30)
    loan = Loan(
        customer_id=customer.id,
        loan_type="auto",
        principal_amount=800000.0,
        remaining_balance=465000.0,
        interest_rate=8.75,
        term_months=60,
        monthly_emi=16500.0,
        next_due_date=loan_due,
        status="active",
    )
    session.add(loan)

    # 5. Investments
    inv1 = Investment(
        customer_id=customer.id,
        asset_name="UTI Nifty 50 Index Fund",
        asset_type="mutual_fund",
        quantity=2500.0,
        purchase_price=60.0,
        current_value=185000.0,
        returns_percentage=23.3,
        invested_date=date(2023, 4, 15),
    )
    inv2 = Investment(
        customer_id=customer.id,
        asset_name="Parag Parikh Flexi Cap Fund",
        asset_type="mutual_fund",
        quantity=1800.0,
        purchase_price=63.88,
        current_value=140000.0,
        returns_percentage=21.7,
        invested_date=date(2023, 7, 20),
    )
    inv3 = Investment(
        customer_id=customer.id,
        asset_name="HDFC Tax Saver 5Y FD",
        asset_type="fixed_deposit",
        quantity=1.0,
        purchase_price=100000.0,
        current_value=107100.0,
        returns_percentage=7.1,
        invested_date=date(2024, 1, 10),
    )
    session.add_all([inv1, inv2, inv3])

    # 6. Savings Bucket
    vacation_bucket = SavingsBucket(
        customer_id=customer.id,
        name="Vacation to Bali",
        target_amount=150000.0,
        current_amount=65000.0,
        target_date=date(2026, 12, 15),
        monthly_contribution=14166.67,
        status="active",
    )
    session.add(vacation_bucket)

    # 7. Transactions
    # Flipkart transactions: exactly matching the prompt example: Total ₹54,250 across 24 transactions this year!
    now = datetime.now(timezone.utc)
    flipkart_txns = []
    # 24 transactions summing to 54,250
    # 23 txns of 2,260 and 1 txn of 2,270 = 54,250
    for i in range(24):
        amt = 2270.0 if i == 0 else 2260.0
        days_ago = (i * 14) % 250 + 2
        txn_time = now - timedelta(days=days_ago)
        flipkart_txns.append(
            Transaction(
                account_id=savings_acc.id,
                amount=amt,
                transaction_type="debit",
                category="Shopping",
                merchant_name="Flipkart",
                description=f"Online shopping purchase #{i+1} on Flipkart",
                timestamp=txn_time,
                status="posted",
            )
        )
    session.add_all(flipkart_txns)

    # Other realistic transactions (Salary, Amazon, Swiggy, Uber, Electricity, Transfers to Rahul)
    other_txns = [
        # Salary credits
        Transaction(
            account_id=savings_acc.id,
            amount=120000.0,
            transaction_type="credit",
            category="Salary",
            merchant_name="Employer Corp",
            description="Monthly Salary Credit",
            timestamp=now - timedelta(days=2),
            status="posted",
        ),
        Transaction(
            account_id=savings_acc.id,
            amount=120000.0,
            transaction_type="credit",
            category="Salary",
            merchant_name="Employer Corp",
            description="Monthly Salary Credit",
            timestamp=now - timedelta(days=32),
            status="posted",
        ),
        # Payments to Rahul
        Transaction(
            account_id=savings_acc.id,
            amount=5000.0,
            transaction_type="transfer",
            category="Transfer",
            beneficiary_name="Rahul",
            description="Fund transfer to Rahul Sharma for shared trip",
            timestamp=now - timedelta(days=8),
            status="posted",
        ),
        Transaction(
            account_id=savings_acc.id,
            amount=3200.0,
            transaction_type="transfer",
            category="Transfer",
            beneficiary_name="Rahul",
            description="Dinner split payment to Rahul",
            timestamp=now - timedelta(days=22),
            status="posted",
        ),
        # Dining & Food
        Transaction(
            account_id=savings_acc.id,
            amount=850.0,
            transaction_type="debit",
            category="Food & Dining",
            merchant_name="Swiggy",
            description="Swiggy Gourmet Dinner",
            timestamp=now - timedelta(days=1),
            status="posted",
        ),
        Transaction(
            account_id=savings_acc.id,
            amount=1240.0,
            transaction_type="debit",
            category="Food & Dining",
            merchant_name="Zomato",
            description="Weekend dining delivery",
            timestamp=now - timedelta(days=5),
            status="posted",
        ),
        # Amazon Shopping
        Transaction(
            account_id=savings_acc.id,
            amount=4599.0,
            transaction_type="debit",
            category="Shopping",
            merchant_name="Amazon",
            description="Amazon electronics accessories",
            timestamp=now - timedelta(days=12),
            status="posted",
        ),
        # Utilities & Bills
        Transaction(
            account_id=savings_acc.id,
            amount=2850.0,
            transaction_type="debit",
            category="Bills & Utilities",
            merchant_name="Tata Power",
            description="Electricity bill payment",
            timestamp=now - timedelta(days=10),
            status="posted",
        ),
        Transaction(
            account_id=savings_acc.id,
            amount=1179.0,
            transaction_type="debit",
            category="Bills & Utilities",
            merchant_name="Airtel",
            description="Fiber broadband monthly bill",
            timestamp=now - timedelta(days=15),
            status="posted",
        ),
        # Travel
        Transaction(
            account_id=savings_acc.id,
            amount=620.0,
            transaction_type="debit",
            category="Travel",
            merchant_name="Uber",
            description="Airport ride",
            timestamp=now - timedelta(days=6),
            status="posted",
        ),
    ]
    session.add_all(other_txns)

    await session.commit()
