import re
from typing import Any, Dict, Optional


class ConversationMemoryManager:
    """Manages session context, extracting entities and resolving contextual references."""

    @staticmethod
    def extract_context_entities(user_text: str, tool_args: Dict[str, Any], existing_context: Dict[str, Any]) -> Dict[str, Any]:
        updated_context = existing_context.copy()

        # Update merchant if present in arguments
        if "merchant" in tool_args and tool_args["merchant"]:
            updated_context["last_merchant"] = tool_args["merchant"]

        # Update category if present
        if "category" in tool_args and tool_args["category"]:
            updated_context["last_category"] = tool_args["category"]

        # Update account_type if present
        if "account_type" in tool_args and tool_args["account_type"]:
            updated_context["last_account_type"] = tool_args["account_type"]

        # Extract merchants mentioned in user prompt via regex
        known_merchants = ["flipkart", "amazon", "swiggy", "zomato", "uber", "myntra", "netflix", "airtel", "tata power", "croma"]
        lower_text = user_text.lower()
        for m in known_merchants:
            if m in lower_text:
                updated_context["last_merchant"] = m.title()

        known_categories = ["shopping", "food", "dining", "travel", "groceries", "utilities", "bills", "healthcare", "entertainment"]
        for c in known_categories:
            if c in lower_text:
                updated_context["last_category"] = c.title()

        return updated_context

    @staticmethod
    def resolve_contextual_references(user_text: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Resolves relative references like:
        - "Show those transactions" -> merchant / category from context
        - "Break it down" -> merchant / category from context
        """
        inferred_filters: Dict[str, Any] = {}
        lower = user_text.lower()

        # Check for demonstrative pronouns ("those", "them", "these", "that")
        is_follow_up = any(w in lower for w in ["those", "them", "these", "that", "same", "details"])

        if is_follow_up or ("show" in lower and "transaction" in lower):
            if "last_merchant" in context:
                inferred_filters["merchant"] = context["last_merchant"]
            if "last_category" in context and "merchant" not in inferred_filters:
                inferred_filters["category"] = context["last_category"]

        return inferred_filters
