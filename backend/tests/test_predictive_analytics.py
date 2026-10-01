import pytest
from app.schemas.analytics import AffordabilityRequest


@pytest.mark.asyncio
async def test_affordability_reasonable_purchase(banking_stack):
    engine = banking_stack["affordability"]
    req = AffordabilityRequest(
        customer_id=1,
        item_name="Car",
        total_cost=600000.0,
        down_payment=50000.0,
        loan_tenure_months=60,
    )
    res = await engine.evaluate_affordability(customer_id=1, request=req)
    assert res.is_affordable is True
    assert res.monthly_impact > 0
    assert res.projected_debt_to_income > res.current_debt_to_income


@pytest.mark.asyncio
async def test_affordability_excessive_purchase(banking_stack):
    engine = banking_stack["affordability"]
    req = AffordabilityRequest(
        customer_id=1,
        item_name="Luxury Sports Car",
        total_cost=5000000.0,
        down_payment=50000.0,
        loan_tenure_months=36,
    )
    res = await engine.evaluate_affordability(customer_id=1, request=req)
    # Exceeds safe borrowing threshold
    assert res.verdict in ["CAUTION_STRETCH", "UNADVISABLE"]
    assert len(res.analysis_details) > 0


@pytest.mark.asyncio
async def test_cashflow_forecasting(banking_stack):
    forecaster = banking_stack["forecaster"]
    res = await forecaster.forecast_cashflow(customer_id=1, days_ahead=30)

    assert res.forecast_days == 30
    assert len(res.timeline) == 30
    assert res.risk_level in ["Low", "Medium", "High"]
    assert len(res.insights) > 0
