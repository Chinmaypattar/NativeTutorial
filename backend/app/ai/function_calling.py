import json
from typing import Any, Dict, List, Optional, Tuple
from openai import AsyncAzureOpenAI, AsyncOpenAI
from app.core.config import settings
from app.core.logging import logger
from app.tools.registry import BANKING_TOOL_DEFINITIONS


class LLMFunctionCallingClient:
    def __init__(self):
        self.client = None
        self.model_name = None
        self.provider_name = "local"

        provider = settings.LLM_PROVIDER.lower()

        # Priority 1: Google Gemini
        if provider == "gemini" or (provider == "auto" and settings.GEMINI_API_KEY):
            if settings.GEMINI_API_KEY:
                logger.info(f"Initializing Google Gemini client for Banking Copilot (Model: {settings.GEMINI_MODEL})")
                self.client = AsyncOpenAI(
                    api_key=settings.GEMINI_API_KEY,
                    base_url=settings.GEMINI_BASE_URL,
                )
                self.model_name = settings.GEMINI_MODEL
                self.provider_name = "gemini"
            else:
                logger.warning("LLM_PROVIDER is set to 'gemini' but GEMINI_API_KEY is not configured.")

        # Priority 2: OpenAI
        elif provider == "openai" or (provider == "auto" and settings.OPENAI_API_KEY):
            if settings.OPENAI_API_KEY:
                logger.info(f"Initializing OpenAI client for Banking Copilot (Model: {settings.OPENAI_MODEL})")
                self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
                self.model_name = settings.OPENAI_MODEL
                self.provider_name = "openai"
            else:
                logger.warning("LLM_PROVIDER is set to 'openai' but OPENAI_API_KEY is not configured.")

        # Priority 3: Azure OpenAI
        elif provider == "azure" or (provider == "auto" and settings.AZURE_OPENAI_API_KEY and settings.AZURE_OPENAI_ENDPOINT):
            if settings.AZURE_OPENAI_API_KEY and settings.AZURE_OPENAI_ENDPOINT:
                logger.info("Initializing Azure OpenAI client for Banking Copilot")
                self.client = AsyncAzureOpenAI(
                    api_key=settings.AZURE_OPENAI_API_KEY,
                    api_version=settings.AZURE_OPENAI_API_VERSION,
                    azure_endpoint=settings.AZURE_OPENAI_ENDPOINT,
                )
                self.model_name = settings.AZURE_OPENAI_DEPLOYMENT_NAME or "gpt-4o"
                self.provider_name = "azure"

        if not self.client:
            logger.info("No cloud LLM API key detected. Operating with Local Deterministic AI Engine.")

    def is_available(self) -> bool:
        return self.client is not None

    async def call_with_tools(
        self,
        messages: List[Dict[str, Any]],
    ) -> Any:
        if not self.client:
            return None

        response = await self.client.chat.completions.create(
            model=self.model_name,
            messages=messages,
            tools=BANKING_TOOL_DEFINITIONS,
            tool_choice="auto",
            temperature=0.0,
        )
        return response.choices[0].message
