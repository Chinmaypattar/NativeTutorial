from fastapi import APIRouter, Depends, Query
from app.analytics.affordability import AffordabilityEngine
from app.analytics.forecasting import CashflowForecaster
from app.api.deps import get_affordability_engine, get_cashflow_forecaster, get_current_customer_id
from app.schemas.analytics import AffordabilityRequest, AffordabilityResponse, CashflowForecastResponse

router = APIRouter()


@router.post("/affordability", response_model=AffordabilityResponse)
async def check_affordability(
    req: AffordabilityRequest,
    customer_id: int = Depends(get_current_customer_id),
    engine: AffordabilityEngine = Depends(get_affordability_engine),
):
    return await engine.evaluate_affordability(customer_id, req)


@router.get("/forecast", response_model=CashflowForecastResponse)
async def get_forecast(
    days: int = Query(30, ge=7, le=90),
    customer_id: int = Depends(get_current_customer_id),
    forecaster: CashflowForecaster = Depends(get_cashflow_forecaster),
):
    return await forecaster.forecast_cashflow(customer_id, days)
