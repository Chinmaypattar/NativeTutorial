import re
from datetime import date, datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Tuple
from app.ai.memory import ConversationMemoryManager
from app.core.security import format_inr


class LocalAIEngine:
    """
    Intelligent local intent detector, entity extractor, and grounded response synthesizer.
    Enables zero-dependency local execution, testing, and offline reliability.
    """

    @classmethod
    def analyze_intent(cls, user_text: str, session_context: Dict[str, Any]) -> Tuple[Optional[str], Dict[str, Any]]:
        text = user_text.lower().strip()
        args: Dict[str, Any] = {}

        # 1. Follow-up / context resolution
        context_filters = ConversationMemoryManager.resolve_contextual_references(user_text, session_context)

        # 2. Check for Affordability Analysis
        if any(w in text for w in ["afford", "can i buy", "purchase plan"]):
            # Extract amount
            amount_match = re.search(r"[₹\$\s]?(\d[\d,]*\.?\d*)", text)
            amounts = re.findall(r"(?:₹|\$|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)", text)
            clean_amounts = []
            for a in amounts:
                val = float(a.replace(",", ""))
                if val > 1000:  # significant purchase
                    clean_amounts.append(val)

            cost = clean_amounts[0] if clean_amounts else 800000.0
            item = "Car" if "car" in text else "House" if "house" in text or "flat" in text else "Item"
            return "check_affordability", {"total_cost": cost, "item_name": item}

        # 3. Check for Cashflow Forecast
        if any(phrase in text for phrase in ["run out of money", "cashflow", "forecast", "balance projection", "out of cash"]):
            return "get_cashflow_forecast", {"days_ahead": 30}

        # 4. Check for Financial Health / Score
        if any(w in text for w in ["health score", "financial health", "wellness", "credit score", "savings rate", "debt ratio"]):
            return "calculate_financial_health", {}

        # 5. Check for Savings Bucket creation
        if any(w in text for w in ["bucket", "create goal", "savings goal", "vacation"]):
            if "create" in text or "open" in text or "set up" in text:
                amounts = re.findall(r"(?:₹|\$|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:\.\d+)?)", text)
                clean_amounts = [float(a.replace(",", "")) for a in amounts if float(a.replace(",", "")) > 1000]
                target_amount = clean_amounts[0] if clean_amounts else 100000.0

                # Extract date or default to end of year
                date_match = re.search(r"\d{4}-\d{2}-\d{2}", text)
                target_date = date_match.group(0) if date_match else "2026-12-31"

                name = "Vacation" if "vacation" in text else "Emergency Fund" if "emergency" in text else "Goal"
                return "create_savings_bucket", {"name": name, "target_amount": target_amount, "target_date": target_date}

        # 6. Check for Personalized Offers
        if any(w in text for w in ["offer", "recommendation", "pre-approved", "upgrade card", "deal"]):
            return "get_personalized_offers", {}

        # 7. Check for Loans & EMIs
        if any(w in text for w in ["loan", "emi", "mortgage"]):
            return "get_loans", {}

        # 8. Check for Credit Cards
        if any(w in text for w in ["credit card", "card limit", "due date", "reward points", "card utilization"]):
            return "get_credit_cards", {}

        # 9. Check for Investments
        if any(w in text for w in ["investment", "portfolio", "mutual fund", "stock", "holdings", "asset allocation"]):
            return "get_investments", {}

        # 10. Check for Account Balances
        if any(w in text for w in ["balance", "account balance", "how much money", "total balance", "savings balance"]):
            acc_type = "savings" if "saving" in text else "checking" if "checking" in text else None
            return "get_accounts", {"account_type": acc_type} if acc_type else {}

        # 11. Check for Spend / Transactions
        spend_indicators = [
            "spend", "spent", "spending", "expense", "expenses",
            "transaction", "payment", "how much on", "how about on",
            "what about on", "and on", "paid", "bought",
            "flipkart", "amazon", "swiggy", "zomato", "zomoto", "uber", "metro"
        ]
        if any(w in text for w in spend_indicators):
            # Merchant aliases & common spelling typos
            merchant_aliases = {
                "zomoto": "Zomato",
                "zomato": "Zomato",
                "swigy": "Swiggy",
                "swiggy": "Swiggy",
                "filpkart": "Flipkart",
                "flipkart": "Flipkart",
                "amazon": "Amazon",
                "uber": "Uber",
                "ola": "Ola",
                "metro": "Metro",
                "myntra": "Myntra",
                "tata power": "Tata Power",
                "netflix": "Netflix",
                "airtel": "Airtel",
                "croma": "Croma",
            }
            matched_merchant = None
            for key, val in merchant_aliases.items():
                if key in text:
                    matched_merchant = val
                    break

            # If not in aliases, extract dynamically via regex: "on <merchant>", "at <merchant>", "for <merchant>"
            if not matched_merchant:
                on_match = re.search(
                    r"(?:how about on|what about on|spending on|spent on|spend on|paid to|payment to|on|at|for)\s+([a-zA-Z0-9_\-]+)",
                    text,
                )
                if on_match:
                    cand = on_match.group(1).lower()
                    stopwords = {
                        "this", "last", "the", "my", "all", "a", "an", "that",
                        "those", "these", "here", "there", "it", "food", "travel", "shopping",
                    }
                    if cand not in stopwords:
                        matched_merchant = merchant_aliases.get(cand, cand.title())

            if not matched_merchant and "merchant" in context_filters:
                matched_merchant = context_filters["merchant"]

            # Extract category
            categories = ["Shopping", "Food & Dining", "Bills & Utilities", "Travel", "Groceries", "Entertainment"]
            matched_category = None
            for c in categories:
                if c.lower() in text or (c == "Food & Dining" and ("food" in text or "dining" in text)):
                    matched_category = c
                    break
            if not matched_category and "category" in context_filters:
                matched_category = context_filters["category"]

            # Extract date filters (e.g. this week, this month, this year, march)
            start_date = None
            end_date = None
            now = datetime.now(timezone.utc)
            current_year = date.today().year

            if "this week" in text or "past week" in text or "last 7 days" in text or "week" in text:
                start_date = (now - timedelta(days=7)).isoformat()
                end_date = now.isoformat()
            elif "last week" in text:
                start_date = (now - timedelta(days=14)).isoformat()
                end_date = (now - timedelta(days=7)).isoformat()
            elif "today" in text:
                start_date = now.replace(hour=0, minute=0, second=0).isoformat()
                end_date = now.isoformat()
            elif "yesterday" in text:
                yesterday = now - timedelta(days=1)
                start_date = yesterday.replace(hour=0, minute=0, second=0).isoformat()
                end_date = yesterday.replace(hour=23, minute=59, second=59).isoformat()
            elif "this month" in text:
                start_date = now.replace(day=1, hour=0, minute=0, second=0).isoformat()
                end_date = now.isoformat()
            elif "last month" in text:
                prev_month = date.today().replace(day=1) - timedelta(days=1)
                start_date = prev_month.replace(day=1).isoformat()
                end_date = prev_month.isoformat()
            elif "this year" in text or "year" in text:
                start_date = f"{current_year}-01-01"
                end_date = f"{current_year}-12-31"
            elif "march" in text:
                start_date = f"{current_year}-03-01"
                end_date = f"{current_year}-03-31"

            # Beneficiary
            matched_beneficiary = None
            for b in ["Rahul", "Priya", "Amit"]:
                if b.lower() in text:
                    matched_beneficiary = b
                    break

            args = {
                "merchant": matched_merchant,
                "category": matched_category,
                "beneficiary": matched_beneficiary,
                "start_date": start_date,
                "end_date": end_date,
            }
            # Clean None values
            args = {k: v for k, v in args.items() if v is not None}
            return "get_transactions", args

        # If follow up with merchant from context
        if context_filters.get("merchant"):
            return "get_transactions", {"merchant": context_filters["merchant"]}

        return None, {}

    @classmethod
    def synthesize_response(
        cls,
        tool_name: str,
        tool_result: Any,
        user_question: str,
        tool_args: Optional[Dict[str, Any]] = None,
    ) -> str:
        """Generates grounded natural language responses strictly matching tool outputs."""
        tool_args = tool_args or {}

        if tool_name == "get_transactions":
            total = tool_result.get("total_spend", 0.0)
            count = tool_result.get("transaction_count", 0)
            avg = tool_result.get("average_spend", 0.0)
            txns = tool_result.get("transactions", [])
            target_merchant = tool_args.get("merchant")
            target_category = tool_args.get("category")

            # Check if user asked for a breakdown or listing
            lower_q = user_question.lower()
            if any(w in lower_q for w in ["show those", "show them", "list", "details", "what are they", "breakdown"]):
                if not txns or count == 0:
                    target_name = target_merchant or target_category or "those criteria"
                    return f"You don't have any recorded transactions matching {target_name}."
                txn_lines = [
                    f"• {t['date']}: {format_inr(t['amount'])} at {t.get('merchant') or t.get('category')} ({t.get('description', '')})"
                    for t in txns[:5]
                ]
                return f"Here are your recent transactions (Total: {format_inr(total)} across {count} transactions):\n" + "\n".join(txn_lines)

            # If 0 transactions found for a specific target
            if count == 0:
                if target_merchant:
                    return f"You haven't made any transactions on {target_merchant} for the selected period."
                elif target_category:
                    return f"You haven't made any transactions in {target_category} for the selected period."
                else:
                    return "You don't have any recorded transactions matching those criteria."

            if target_merchant:
                target_phrase = f"on {target_merchant}"
            elif target_category:
                target_phrase = f"on {target_category}"
            else:
                target_phrase = "in total"

            return (
                f"You spent {format_inr(total)} {target_phrase} across {count} transaction{'s' if count != 1 else ''}, with an average transaction of {format_inr(avg)}."
            )

        elif tool_name == "get_accounts":
            total = tool_result.get("total_balance", 0.0)
            savings = tool_result.get("savings_balance", 0.0)
            checking = tool_result.get("checking_balance", 0.0)
            return (
                f"Your total available balance is {format_inr(total)}.\n"
                f"• Savings Account: {format_inr(savings)}\n"
                f"• Checking Account: {format_inr(checking)}"
            )

        elif tool_name == "get_credit_cards":
            limit = tool_result.get("total_credit_limit", 0.0)
            balance = tool_result.get("total_current_balance", 0.0)
            avail = tool_result.get("total_available_credit", 0.0)
            util = tool_result.get("utilization_percentage", 0.0)
            cards = tool_result.get("cards", [])
            due_str = f"Payment due date is {cards[0]['due_date']}." if cards else ""
            return (
                f"Your credit card balance is {format_inr(balance)} of your {format_inr(limit)} limit (utilization: {util}%).\n"
                f"You have {format_inr(avail)} available credit. {due_str}"
            )

        elif tool_name == "get_loans":
            total_debt = tool_result.get("total_outstanding_debt", 0.0)
            total_emi = tool_result.get("total_monthly_emi", 0.0)
            loans = tool_result.get("active_loans", [])
            loan_details = [
                f"• {l['loan_type'].capitalize()} Loan: Outstanding {format_inr(l['remaining_balance'])} | EMI: {format_inr(l['monthly_emi'])}/mo (Rate: {l['interest_rate']})"
                for l in loans
            ]
            return (
                f"You have {len(loans)} active loan(s) with total outstanding debt of {format_inr(total_debt)} and combined monthly EMI of {format_inr(total_emi)}.\n"
                + "\n".join(loan_details)
            )

        elif tool_name == "get_investments":
            total_val = tool_result.get("total_current_value", 0.0)
            returns = tool_result.get("total_returns", 0.0)
            ret_pct = tool_result.get("returns_percentage", "0%")
            alloc = tool_result.get("asset_allocation", {})
            alloc_str = ", ".join([f"{k}: {v}%" for k, v in alloc.items()])
            return (
                f"Your total investment portfolio value is {format_inr(total_val)} with total unrealized returns of {format_inr(returns)} ({ret_pct}).\n"
                f"Asset Allocation: {alloc_str}."
            )

        elif tool_name == "calculate_financial_health":
            score = tool_result.get("overall_score", 0)
            grade = tool_result.get("grade", "Good")
            summary = tool_result.get("summary", "")
            opps = tool_result.get("savings_opportunities", [])
            opp_text = f"\nOpportunity: {opps[0]}" if opps else ""
            return f"Your Financial Health Score is {score}/100 ({grade}). {summary}{opp_text}"

        elif tool_name == "create_savings_bucket":
            name = tool_result.get("name", "Goal")
            target = tool_result.get("target_amount", 0.0)
            target_date = tool_result.get("target_date", "")
            monthly = tool_result.get("monthly_savings_required", 0.0)
            months = tool_result.get("months_remaining", 1)
            return (
                f"Successfully created your '{name}' savings bucket!\n"
                f"• Target Goal: {format_inr(target)} by {target_date}\n"
                f"• Required Monthly Savings: {format_inr(monthly)}/month over the next {months} months."
            )

        elif tool_name == "get_personalized_offers":
            offers = tool_result.get("recommendations", [])
            if not offers:
                return "There are currently no new personalized offers on your account."
            offer_lines = [f"• {o['title']} ({o['eligibility_status']}): {o['description']}" for o in offers[:3]]
            return "Here are your pre-approved and personalized offers:\n" + "\n".join(offer_lines)

        elif tool_name == "check_affordability":
            verdict = tool_result.get("verdict", "")
            monthly = tool_result.get("monthly_impact", 0.0)
            proj_dti = tool_result.get("projected_debt_to_income", 0.0)
            details = tool_result.get("analysis_details", [])
            alt = tool_result.get("suggested_alternative")
            alt_text = f"\nTip: {alt}" if alt else ""
            return (
                f"Affordability Verdict: {verdict}\n"
                f"• Projected Monthly EMI: {format_inr(monthly)}\n"
                f"• Resulting Debt-to-Income (DTI): {proj_dti}%\n"
                + "\n".join([f"• {d}" for d in details])
                + alt_text
            )

        elif tool_name == "get_cashflow_forecast":
            risk = tool_result.get("risk_level", "Low")
            lowest = tool_result.get("lowest_projected_balance", 0.0)
            insights = tool_result.get("insights", [])
            insight_str = "\n".join([f"• {i}" for i in insights])
            return f"Cashflow Risk Level: {risk} (Lowest projected balance: {format_inr(lowest)})\n{insight_str}"

        return "I have processed your financial request."
