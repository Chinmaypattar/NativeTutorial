import pytest


@pytest.mark.asyncio
async def test_tool_get_transactions_flipkart(banking_stack):
    tools = banking_stack["tools"]
    result = await tools.get_transactions(customer_id=1, merchant="Flipkart")
    assert result["total_spend"] == 54250.0
    assert result["transaction_count"] == 24
    assert len(result["transactions"]) > 0


@pytest.mark.asyncio
async def test_tool_get_accounts(banking_stack):
    tools = banking_stack["tools"]
    result = await tools.get_accounts(customer_id=1)
    assert result["total_balance"] == 245680.50
    assert result["savings_balance"] == 185430.00
    assert len(result["accounts"]) == 2


@pytest.mark.asyncio
async def test_tool_get_credit_cards(banking_stack):
    tools = banking_stack["tools"]
    result = await tools.get_credit_cards(customer_id=1)
    assert result["total_credit_limit"] == 250000.0
    assert len(result["cards"]) == 1
    assert result["cards"][0]["card_number_last4"] == "••••4589"


@pytest.mark.asyncio
async def test_tool_get_loans(banking_stack):
    tools = banking_stack["tools"]
    result = await tools.get_loans(customer_id=1)
    assert result["total_outstanding_debt"] == 465000.0
    assert result["total_monthly_emi"] == 16500.0


@pytest.mark.asyncio
async def test_tool_get_investments(banking_stack):
    tools = banking_stack["tools"]
    result = await tools.get_investments(customer_id=1)
    assert result["total_current_value"] == 432100.0
    assert len(result["holdings"]) == 3


@pytest.mark.asyncio
async def test_tool_calculate_financial_health(banking_stack):
    tools = banking_stack["tools"]
    result = await tools.calculate_financial_health(customer_id=1)
    assert 0 <= result["overall_score"] <= 100
    assert result["grade"] in ["Excellent", "Good", "Fair", "Needs Improvement"]
    assert len(result["pillars"]) == 5


@pytest.mark.asyncio
async def test_tool_create_savings_bucket(banking_stack):
    tools = banking_stack["tools"]
    result = await tools.create_savings_bucket(
        customer_id=1,
        name="New MacBook Pro",
        target_amount=200000.0,
        target_date="2026-12-31",
        initial_deposit=20000.0,
    )
    assert result["name"] == "New MacBook Pro"
    assert result["target_amount"] == 200000.0
    assert result["current_amount"] == 20000.0
    assert result["monthly_savings_required"] > 0
