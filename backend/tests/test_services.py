import pytest
from app.schemas.transaction import TransactionFilter


@pytest.mark.asyncio
async def test_account_service_summary(banking_stack):
    account_svc = banking_stack["account_svc"]
    summary = await account_svc.get_account_summary(customer_id=1)
    # Savings: 185430.00, Checking: 60250.50 -> Total: 245680.50
    assert summary.total_balance == 245680.50
    assert summary.savings_balance == 185430.00
    assert summary.checking_balance == 60250.50
    assert summary.account_count == 2


@pytest.mark.asyncio
async def test_transaction_service_merchant_spend(banking_stack):
    txn_svc = banking_stack["txn_svc"]
    summary = await txn_svc.get_spend_summary(customer_id=1, merchant="Flipkart")
    # Matching prompt spec: 54,250 across 24 transactions, avg 2260.42
    assert summary.total_spend == 54250.00
    assert summary.transaction_count == 24
    assert round(summary.average_spend, 0) == 2260.0


@pytest.mark.asyncio
async def test_card_service_utilization(banking_stack):
    card_svc = banking_stack["card_svc"]
    util = await card_svc.get_card_utilization(customer_id=1)
    assert util.total_credit_limit == 250000.0
    assert util.total_current_balance == 31500.0
    assert util.utilization_percentage == 12.6
    assert util.cards_count == 1


@pytest.mark.asyncio
async def test_loan_service_summary(banking_stack):
    loan_svc = banking_stack["loan_svc"]
    summary = await loan_svc.get_loan_summary(customer_id=1, monthly_income=120000.0)
    assert summary.total_debt == 465000.0
    assert summary.total_monthly_emi == 16500.0
    assert summary.debt_to_income_ratio == 13.75


@pytest.mark.asyncio
async def test_investment_service_portfolio(banking_stack):
    inv_svc = banking_stack["inv_svc"]
    portfolio = await inv_svc.get_portfolio_summary(customer_id=1)
    assert portfolio.total_invested > 0
    assert portfolio.total_current_value == 432100.0
    assert "mutual_fund" in portfolio.asset_allocation
    assert "fixed_deposit" in portfolio.asset_allocation


@pytest.mark.asyncio
async def test_savings_bucket_service(banking_stack):
    bucket_svc = banking_stack["bucket_svc"]
    buckets = await bucket_svc.get_buckets(customer_id=1)
    assert len(buckets) >= 1
    bali = buckets[0]
    assert bali.name == "Vacation to Bali"
    assert bali.target_amount == 150000.0
    assert bali.current_amount == 65000.0
    assert bali.monthly_savings_required > 0
