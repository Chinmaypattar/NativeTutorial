import pytest


@pytest.mark.asyncio
async def test_financial_wellness_5_pillars(banking_stack):
    health_svc = banking_stack["health_svc"]
    score = await health_svc.calculate_health_score(customer_id=1)

    assert 0 <= score.overall_score <= 100
    assert len(score.pillars) == 5

    pillar_names = [p.name for p in score.pillars]
    assert "Savings Rate" in pillar_names
    assert "Debt to Income (DTI)" in pillar_names
    assert "Spending Ratio" in pillar_names
    assert "Credit Utilization" in pillar_names
    assert "Emergency Runway" in pillar_names

    assert len(score.savings_opportunities) >= 1
    assert len(score.spending_trends) >= 1
