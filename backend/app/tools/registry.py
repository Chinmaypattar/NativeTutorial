from typing import Any, Dict, List
from app.core.exceptions import ToolExecutionException
from app.tools.banking_tools import BankingTools

# Registered OpenAI Tool Specifications
BANKING_TOOL_DEFINITIONS: List[Dict[str, Any]] = [
    {
        "type": "function",
        "function": {
            "name": "get_transactions",
            "description": "Retrieve customer transactions with flexible filtering by merchant, category, date range, or amount. Answers queries like 'How much did I spend on Flipkart?', 'Show food expenses', 'Show March transactions'.",
            "parameters": {
                "type": "object",
                "properties": {
                    "merchant": {
                        "type": "string",
                        "description": "Merchant name filter (e.g. 'Flipkart', 'Amazon', 'Swiggy', 'Uber')",
                    },
                    "category": {
                        "type": "string",
                        "description": "Category filter (e.g. 'Shopping', 'Food & Dining', 'Bills & Utilities', 'Travel')",
                    },
                    "beneficiary": {
                        "type": "string",
                        "description": "Beneficiary name filter (e.g. 'Rahul')",
                    },
                    "min_amount": {"type": "number", "description": "Minimum transaction amount"},
                    "max_amount": {"type": "number", "description": "Maximum transaction amount"},
                    "start_date": {
                        "type": "string",
                        "description": "ISO format start date (e.g. '2026-01-01')",
                    },
                    "end_date": {
                        "type": "string",
                        "description": "ISO format end date (e.g. '2026-12-31')",
                    },
                    "limit": {"type": "integer", "description": "Maximum number of transactions to return"},
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_accounts",
            "description": "Retrieve customer bank accounts, balances (savings, checking), and aggregate totals.",
            "parameters": {
                "type": "object",
                "properties": {
                    "account_type": {
                        "type": "string",
                        "description": "Account type filter (e.g. 'savings', 'checking')",
                    }
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_credit_cards",
            "description": "Retrieve customer credit card limits, available credit, current balances, payment due dates, and reward points.",
            "parameters": {"type": "object", "properties": {}},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_loans",
            "description": "Retrieve customer loan accounts including mortgages, auto loans, personal loans, remaining balances, interest rates, and monthly EMIs.",
            "parameters": {"type": "object", "properties": {}},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_investments",
            "description": "Retrieve customer investment portfolio, total valuation, asset allocation (mutual funds, stocks, fixed deposits), and returns.",
            "parameters": {"type": "object", "properties": {}},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "calculate_financial_health",
            "description": "Calculate comprehensive 5-pillar financial wellness score (0-100), savings rate, debt-to-income ratio, and actionable coaching recommendations.",
            "parameters": {"type": "object", "properties": {}},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "create_savings_bucket",
            "description": "Create a new savings bucket / goal with a target amount and target date, and calculate required monthly contributions.",
            "parameters": {
                "type": "object",
                "required": ["name", "target_amount", "target_date"],
                "properties": {
                    "name": {"type": "string", "description": "Goal name (e.g. 'Bali Vacation', 'MacBook Pro')"},
                    "target_amount": {"type": "number", "description": "Target financial goal amount in INR"},
                    "target_date": {"type": "string", "description": "Target completion date in 'YYYY-MM-DD' format"},
                    "initial_deposit": {"type": "number", "description": "Initial deposit amount in INR"},
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_personalized_offers",
            "description": "Retrieve personalized banking offers including pre-approved personal loans, high-cashback credit cards, and high-yield fixed deposits.",
            "parameters": {"type": "object", "properties": {}},
        },
    },
    {
        "type": "function",
        "function": {
            "name": "check_affordability",
            "description": "Perform an affordability analysis for large purchases (e.g. 'Can I afford a new car?'), analyzing DTI impact, monthly EMI, and savings safety buffer.",
            "parameters": {
                "type": "object",
                "required": ["total_cost"],
                "properties": {
                    "item_name": {"type": "string", "description": "Item being evaluated (e.g. 'Car', 'House')"},
                    "total_cost": {"type": "number", "description": "Total purchase cost in INR"},
                    "down_payment": {"type": "number", "description": "Upfront down payment in INR"},
                    "loan_tenure_months": {"type": "integer", "description": "Loan tenure in months"},
                    "estimated_monthly_emi": {"type": "number", "description": "Specific monthly EMI if already known"},
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_cashflow_forecast",
            "description": "Forecast upcoming cashflow for the next 15-30 days to check for shortfall or overdraft risks ('Will I run out of money this month?').",
            "parameters": {
                "type": "object",
                "properties": {
                    "days_ahead": {"type": "integer", "description": "Number of days to forecast ahead (e.g. 30)"}
                },
            },
        },
    },
]


async def dispatch_tool_call(
    banking_tools: BankingTools,
    tool_name: str,
    arguments: Dict[str, Any],
    customer_id: int,
) -> Any:
    """Dispatches a named tool call with arguments to the BankingTools layer."""
    args = arguments.copy()
    args["customer_id"] = customer_id

    tool_map = {
        "get_transactions": banking_tools.get_transactions,
        "get_accounts": banking_tools.get_accounts,
        "get_credit_cards": banking_tools.get_credit_cards,
        "get_loans": banking_tools.get_loans,
        "get_investments": banking_tools.get_investments,
        "calculate_financial_health": banking_tools.calculate_financial_health,
        "create_savings_bucket": banking_tools.create_savings_bucket,
        "get_personalized_offers": banking_tools.get_personalized_offers,
        "check_affordability": banking_tools.check_affordability,
        "get_cashflow_forecast": banking_tools.get_cashflow_forecast,
    }

    if tool_name not in tool_map:
        raise ToolExecutionException(tool_name, f"Tool '{tool_name}' is not registered.")

    fn = tool_map[tool_name]
    try:
        result = await fn(**args)
        return result
    except Exception as e:
        raise ToolExecutionException(tool_name, str(e))
