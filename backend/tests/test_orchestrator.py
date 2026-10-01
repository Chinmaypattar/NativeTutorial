import pytest


@pytest.mark.asyncio
async def test_orchestrator_flipkart_spend_and_memory(banking_stack):
    orchestrator = banking_stack["orchestrator"]

    # Turn 1: "How much did I spend on Flipkart this year?"
    resp1 = await orchestrator.handle_user_message(
        customer_id=1,
        user_message="How much did I spend on Flipkart this year?",
    )

    assert "54,250" in resp1.reply
    assert "Flipkart" in resp1.reply
    assert len(resp1.tools_executed) == 1
    assert resp1.tools_executed[0].tool_name == "get_transactions"
    assert resp1.session_context.get("last_merchant") == "Flipkart"

    session_id = resp1.session_id

    # Turn 2: Follow-up question relying on memory: "Show those transactions"
    resp2 = await orchestrator.handle_user_message(
        customer_id=1,
        user_message="Show those transactions",
        session_id=session_id,
    )

    assert len(resp2.tools_executed) == 1
    assert resp2.tools_executed[0].tool_name == "get_transactions"
    assert resp2.tools_executed[0].arguments.get("merchant") == "Flipkart"
    assert "Flipkart" in resp2.reply


@pytest.mark.asyncio
async def test_orchestrator_balance_query(banking_stack):
    orchestrator = banking_stack["orchestrator"]
    resp = await orchestrator.handle_user_message(
        customer_id=1,
        user_message="What is my total account balance?",
    )

    assert "2,45,680.50" in resp.reply
    assert "Savings Account" in resp.reply
    assert len(resp.tools_executed) == 1
    assert resp.tools_executed[0].tool_name == "get_accounts"


@pytest.mark.asyncio
async def test_orchestrator_affordability(banking_stack):
    orchestrator = banking_stack["orchestrator"]
    resp = await orchestrator.handle_user_message(
        customer_id=1,
        user_message="Can I afford a new car for ₹8,00,000?",
    )

    assert len(resp.tools_executed) == 1
    assert resp.tools_executed[0].tool_name == "check_affordability"
    assert "Affordability Verdict" in resp.reply
    assert "EMI" in resp.reply


@pytest.mark.asyncio
async def test_orchestrator_cashflow_forecast(banking_stack):
    orchestrator = banking_stack["orchestrator"]
    resp = await orchestrator.handle_user_message(
        customer_id=1,
        user_message="Will I run out of money this month?",
    )

    assert len(resp.tools_executed) == 1
    assert resp.tools_executed[0].tool_name == "get_cashflow_forecast"
    assert "Cashflow Risk Level" in resp.reply


def test_llm_provider_configuration_precedence(monkeypatch):
    from app.ai.function_calling import LLMFunctionCallingClient
    from app.core.config import settings

    # Case 1: Both keys set in auto mode -> Gemini takes Priority 1
    monkeypatch.setattr(settings, "LLM_PROVIDER", "auto")
    monkeypatch.setattr(settings, "GEMINI_API_KEY", "test-gemini-key")
    monkeypatch.setattr(settings, "OPENAI_API_KEY", "test-openai-key")
    client1 = LLMFunctionCallingClient()
    assert client1.provider_name == "gemini"
    assert client1.model_name == settings.GEMINI_MODEL
    assert client1.is_available() is True

    # Case 2: Only OpenAI key set -> Falls back to OpenAI
    monkeypatch.setattr(settings, "GEMINI_API_KEY", None)
    monkeypatch.setattr(settings, "OPENAI_API_KEY", "test-openai-key")
    client2 = LLMFunctionCallingClient()
    assert client2.provider_name == "openai"
    assert client2.model_name == settings.OPENAI_MODEL
    assert client2.is_available() is True

    # Case 3: Explicitly set provider="openai" even if Gemini key is present
    monkeypatch.setattr(settings, "LLM_PROVIDER", "openai")
    monkeypatch.setattr(settings, "GEMINI_API_KEY", "test-gemini-key")
    client3 = LLMFunctionCallingClient()
    assert client3.provider_name == "openai"

    # Case 4: No keys -> local engine fallback
    monkeypatch.setattr(settings, "LLM_PROVIDER", "auto")
    monkeypatch.setattr(settings, "GEMINI_API_KEY", None)
    monkeypatch.setattr(settings, "OPENAI_API_KEY", None)
    monkeypatch.setattr(settings, "AZURE_OPENAI_API_KEY", None)
    client4 = LLMFunctionCallingClient()
    assert client4.provider_name == "local"
    assert client4.is_available() is False

