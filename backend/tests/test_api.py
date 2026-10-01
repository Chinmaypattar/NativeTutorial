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
