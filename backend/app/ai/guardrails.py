import re
from typing import Optional, Tuple
from app.core.logging import logger

# ==============================================================================
# Banking Copilot Guardrails Layer
# ==============================================================================

# 1. Prompt Injection & Jailbreak Patterns
INJECTION_PATTERNS = [
    r"ignore\s+(all\s+)?(previous|prior)\s+instructions",
    r"disregard\s+(all\s+)?(rules|prompts|guidelines)",
    r"you\s+are\s+now\s+(in\s+)?(developer\s+mode|dan|unrestricted|jailbroken)",
    r"pretend\s+(you\s+have\s+no\s+rules|to\s+be\s+an\s+unfiltered)",
    r"reveal\s+(your\s+)?(system\s+prompt|initial\s+instructions)",
    r"system\s+override",
    r"bypass\s+(all\s+)?(safety|guardrails|security)",
]

# 2. Credential Phishing / Request Patterns
CREDENTIAL_PATTERNS = [
    r"\b(what\s+is|tell\s+me|show|give\s+me)\s+(my\s+)?(atm\s+)?(pin|cvv|cvv2|otp|password|netbanking\s+password)\b",
    r"\b(my\s+pin\s+is|here\s+is\s+my\s+otp|my\s+password\s+is)\b",
]

# 3. Blatant Off-Topic Intent Patterns (fast reject before LLM)
OFF_TOPIC_PATTERNS = [
    r"\b(write\s+(me\s+)?a\s+(poem|story|song|essay|joke|code|script))\b",
    r"\b(who\s+won\s+the\s+(world\s+cup|match|super\s+bowl|election))\b",
    r"\b(what\s+is\s+the\s+capital\s+of\b)",
    r"\b(how\s+to\s+cook|recipe\s+for|weather\s+forecast\s+in)\b",
    r"\b(diagnose\s+my\s+symptoms|medical\s+advice|prescribe)\b",
]

# PII Leaks: Raw 16-digit credit card pattern
RAW_CARD_PATTERN = re.compile(r"\b(?:\d{4}[-\s]?){3}\d{4}\b")


class BankingGuardrails:
    """Enforces safety, security, and domain boundaries on inputs and outputs."""

    @staticmethod
    def pre_check(user_message: str) -> Tuple[bool, Optional[str]]:
        """
        Validates incoming user message before it reaches the AI orchestrator or LLM.
        Returns: (is_blocked: bool, guardrail_response: Optional[str])
        """
        msg_clean = user_message.strip()
        msg_lower = msg_clean.lower()

        # A. Check for Prompt Injection / Jailbreaks
        for pattern in INJECTION_PATTERNS:
            if re.search(pattern, msg_lower):
                logger.warning(f"Guardrail triggered: Prompt injection attempt detected: '{msg_clean}'")
                return True, (
                    "I am the Banking Copilot, operating under strict security guidelines. "
                    "I can only assist with your banking accounts, transactions, and financial planning."
                )

        # B. Check for Credential Requests or Submissions
        for pattern in CREDENTIAL_PATTERNS:
            if re.search(pattern, msg_lower):
                logger.warning(f"Guardrail triggered: Credential query detected: '{msg_clean}'")
                return True, (
                    "🔒 Security Notice: Banking credentials such as PINs, OTPs, CVVs, and passwords "
                    "are never stored or shared in chat. Never disclose your secret banking credentials. "
                    "To manage your PIN or security settings, please use the official banking portal or an ATM."
                )

        # C. Check for obvious non-banking off-topic requests
        for pattern in OFF_TOPIC_PATTERNS:
            if re.search(pattern, msg_lower):
                logger.info(f"Guardrail triggered: Off-topic inquiry detected: '{msg_clean}'")
                return True, (
                    "I am your Banking Copilot, designed exclusively to help you manage your bank accounts, "
                    "track spending, analyze transactions, and achieve your financial goals. "
                    "I cannot assist with non-financial topics. How can I help with your finances today?"
                )

        return False, None

    @staticmethod
    def post_sanitize(reply_text: str) -> str:
        """
        Sanitizes outgoing LLM responses to ensure zero PII leakage (card numbers, credentials).
        """
        if not reply_text:
            return reply_text

        # Mask unmasked 16-digit credit/debit card numbers: keep only last 4
        def mask_card(match):
            raw = re.sub(r"[\s\-]", "", match.group(0))
            return f"••••••••••••{raw[-4:]}"

        sanitized = RAW_CARD_PATTERN.sub(mask_card, reply_text)
        return sanitized
