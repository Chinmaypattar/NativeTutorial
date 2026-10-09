# Banking Copilot - Backend & AI Orchestration Platform

An enterprise-grade, conversational banking copilot backend powered by FastAPI, PostgreSQL, Azure OpenAI function calling, and predictive financial analytics.

## Core Architectural Principle

**AI is not the source of truth. Banking systems and PostgreSQL are the source of truth.**  
The AI orchestrator acts as the reasoning, intent extraction, tool execution, and response synthesis layer.

---

## Directory Structure

```text
backend/
├── app/
│   ├── main.py                     # FastAPI entrypoint, CORS, lifespan DB init & seeding
│   ├── core/                       # Config, Security, JWT, PII Masking, Logging, Exceptions
│   ├── database/                   # Async SQLAlchemy engine & models (PostgreSQL + SQLite)
│   ├── schemas/                    # Pydantic schemas for requests, responses & metrics
│   ├── repositories/               # Repository layer (pure queries, structured models)
│   ├── services/                   # Service layer (aggregations, calculations, analytics)
│   ├── tools/                      # Generic banking tools & OpenAI tool registry
│   ├── ai/                         # Orchestrator, session memory, prompts, local AI engine
│   ├── analytics/                  # Affordability engine & cashflow forecaster
│   ├── api/v1/                     # FastAPI endpoints (auth, accounts, chat, etc.)
│   └── seed/                       # Realistic seed data for Pranita
├── tests/                          # Comprehensive pytest test suite
├── Dockerfile                      # Production container image
├── docker-compose.yml              # PostgreSQL, Redis & FastAPI services
└── requirements.txt
```

---

## Quickstart

### 1. Setup Virtual Environment
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Run Locally (Zero Config SQLite Fallback)
```bash
uvicorn app.main:app --reload --port 8000
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Interactive Swagger API documentation will be available at:  
👉 `http://localhost:8000/docs`

### 3. Configure LLM Provider (Gemini First!)

Copy the template:
```bash
cp .env.example .env
```

Set your preferred provider:
- **Google Gemini (Default & Priority 1)**:
  ```bash
  GEMINI_API_KEY=your_gemini_api_key_here
  GEMINI_MODEL=gemini-2.0-flash
  ```
- **OpenAI (Priority 2)**:
  ```bash
  OPENAI_API_KEY=your_openai_api_key_here
  OPENAI_MODEL=gpt-4o
  ```
- **Local Engine (No API Key required)**:
  If no keys are configured, the system automatically runs the deterministic semantic engine offline with full tool support.

### 4. Run with Docker & PostgreSQL
```bash
docker-compose up --build
```

---

## Running the Automated Test Suite

```bash
pytest -v
```

All tests for repositories, services, tools, AI orchestrator, and endpoints run automatically against an isolated async test database.

---

## Registered Banking Tools

| Tool Name | Parameters | Capabilities |
| :--- | :--- | :--- |
| `get_transactions` | `merchant`, `category`, `date range`, `amount` | Search transactions, spend totals, category breakdown |
| `get_accounts` | `account_type` | Total balances, savings and checking breakdowns |
| `get_credit_cards` | (none) | Limits, current balances, payment dues, utilization ratio |
| `get_loans` | (none) | Outstanding balances, EMIs, interest rates |
| `get_investments` | (none) | Portfolio value, asset allocation, returns |
| `calculate_financial_health` | (none) | 5-pillar financial wellness score (0-100) |
| `create_savings_bucket` | `name`, `target_amount`, `target_date` | Creates goal, calculates required monthly savings |
| `get_personalized_offers` | (none) | Pre-approved loans, credit card recommendations |
| `check_affordability` | `total_cost`, `item_name`, `down_payment` | Evaluates purchase viability, EMI, and DTI impact |
| `get_cashflow_forecast` | `days_ahead` | Day-by-day projected balances and shortfall risks |
