import pytest


@pytest.mark.asyncio
async def test_api_root(async_client):
    response = await async_client.get("/")
    assert response.status_code == 200
    assert response.json()["service"] == "Banking Copilot API"


@pytest.mark.asyncio
async def test_api_accounts_summary(async_client):
    response = await async_client.get("/api/v1/accounts/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["total_balance"] == 245680.50
    assert data["savings_balance"] == 185430.00


@pytest.mark.asyncio
async def test_api_transactions(async_client):
    response = await async_client.get("/api/v1/transactions?merchant=Flipkart")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["merchant_name"] == "Flipkart"


@pytest.mark.asyncio
async def test_api_wellness_score(async_client):
    response = await async_client.get("/api/v1/wellness/score")
    assert response.status_code == 200
    data = response.json()
    assert "overall_score" in data
    assert "pillars" in data


@pytest.mark.asyncio
async def test_api_offers_recommendations(async_client):
    response = await async_client.get("/api/v1/offers/recommendations")
    assert response.status_code == 200
    data = response.json()
    assert "recommendations" in data
    assert len(data["recommendations"]) > 0
    assert data["customer_credit_score"] >= 700


@pytest.mark.asyncio
async def test_api_cashflow_forecast_with_query_param(async_client):
    response = await async_client.get("/api/v1/analytics/cashflow-forecast?days_ahead=30")
    assert response.status_code == 200
    data = response.json()
    assert data["forecast_days"] == 30
    assert "timeline" in data
    assert len(data["timeline"]) == 30


@pytest.mark.asyncio
async def test_api_auth_register_and_login(async_client):
    # Register new user
    reg_payload = {
        "first_name": "Rohan",
        "last_name": "Mehta",
        "email": "rohan.mehta@example.com",
        "password": "SecurePassword123!",
        "phone": "+91 99887 76655",
        "monthly_income": 95000.0,
    }
    reg_resp = await async_client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_resp.status_code == 200
    reg_data = reg_resp.json()
    assert "access_token" in reg_data
    assert reg_data["customer_name"] == "Rohan Mehta"

    # Login with same credentials
    login_resp = await async_client.post(
        "/api/v1/auth/login",
        json={"email": "rohan.mehta@example.com", "password": "SecurePassword123!"},
    )
    assert login_resp.status_code == 200
    assert "access_token" in login_resp.json()


@pytest.mark.asyncio
async def test_api_fund_transfer_and_bill_pay(async_client):
    # Register new customer for clean isolated financial testing
    reg_payload = {
        "first_name": "Kavita",
        "last_name": "Rao",
        "email": "kavita.rao@example.com",
        "password": "Password123!",
        "monthly_income": 80000.0,
    }
    reg_resp = await async_client.post("/api/v1/auth/register", json=reg_payload)
    token = reg_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch accounts for Kavita
    accs_resp = await async_client.get("/api/v1/accounts", headers=headers)
    assert accs_resp.status_code == 200
    accounts = accs_resp.json()
    savings = next(a for a in accounts if a["account_type"] == "savings")
    checking = next(a for a in accounts if a["account_type"] == "checking")

    # Fund Transfer from Kavita's Savings Account
    transfer_payload = {
        "source_account_id": savings["id"],
        "beneficiary_name": "Siddharth Verma",
        "beneficiary_account": "987654321012",
        "amount": 5000.0,
        "remarks": "Rent split",
    }
    transfer_resp = await async_client.post(
        "/api/v1/transactions/transfer",
        json=transfer_payload,
        headers=headers,
    )
    assert transfer_resp.status_code == 200
    transfer_data = transfer_resp.json()
    assert transfer_data["status"] == "SUCCESS"
    assert transfer_data["amount"] == 5000.0
    assert "APX" in transfer_data["reference_id"]
    assert transfer_data["remaining_balance"] == 95000.0

    # Bill Payment from Kavita's Checking Account
    bill_payload = {
        "account_id": checking["id"],
        "biller_name": "Adani Electricity",
        "bill_category": "Electricity",
        "consumer_number": "100293847",
        "amount": 2400.0,
    }
    bill_resp = await async_client.post(
        "/api/v1/transactions/pay-bill",
        json=bill_payload,
        headers=headers,
    )
    assert bill_resp.status_code == 200
    bill_data = bill_resp.json()
    assert bill_data["status"] == "SUCCESS"
    assert bill_data["remaining_balance"] == 22600.0


@pytest.mark.asyncio
async def test_api_chat_message(async_client):
    response = await async_client.post(
        "/api/v1/chat/message",
        json={"content": "What is my total account balance?"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "2,45,680.50" in data["reply"]
    assert len(data["tools_executed"]) == 1
    assert data["tools_executed"][0]["tool_name"] == "get_accounts"
