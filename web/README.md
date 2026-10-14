# Apex Digital Bank - React Web Banking Portal & AI Copilot

A modern online banking web application built with **React**, **Vite**, **TypeScript**, and **Lucide Icons**, integrated with the **FastAPI + PostgreSQL / SQLite Backend** and **Google Gemini 3.8 Flash Banking Copilot**.

---

## Features

1. **Executive Dashboard Overview**:
   - Total Net Available Liquidity across accounts.
   - Savings & Checking account snapshots with masked numbers and IFSC codes.
   - Credit card limits, available credit, and reward points.
   - Recent transaction ledger with debit/credit badges.
   - 5-Pillar Financial Wellness quick-score ring.

2. **Accounts & Balances**:
   - High-yield savings accounts (4.00% p.a.) and checking accounts.
   - One-click copy account number and transfer simulation.
   - Deposit Insurance and Credit Guarantee Corporation (DICGC) safety badge.

3. **Transaction Ledger & Merchant Analytics**:
   - Search by merchant (e.g. *Flipkart*, *Zomato*, *Swiggy*).
   - Dynamic **Merchant Spend Analytics Card** displaying total spend, count, and average ticket size.
   - Filter by categories and transaction type (Debit/Credit).

4. **Credit Cards & Active Loans**:
   - Visual Platinum Credit Card with EMV chip, 16-digit masked PAN, and expiry.
   - Real-time **Credit Utilization Ratio** meter with health indicators (<30%).
   - Loan repayment trackers displaying principal, monthly EMI, and interest rates.

5. **Savings Goals & Buckets**:
   - Visual savings buckets with progress bars and target completion dates.
   - Automated monthly contribution calculator.
   - Interactive **Create New Bucket** modal.

6. **Investments & Wealth**:
   - Total portfolio valuation, invested capital, and unrealized gains (+ROI %).
   - Asset allocation table across Mutual Funds, Equities, and Fixed Deposits.

7. **Predictive Analytics**:
   - **Affordability Stress-Tester**: Simulate major purchases (cars, electronics) to get AI-powered verdicts (AFFORDABLE / STRETCH / UNAFFORDABLE) with EMI and runway impacts.
   - **30-Day Cashflow Forecaster**: Daily balance projection forecasting upcoming dues vs salary inflows.

8. **Financial Wellness & Personalized Offers**:
   - Comprehensive 5-Pillar score breakdown (0–100).
   - AI coaching tips and personalized card/loan upgrade offers.

9. **AI Banking Copilot Drawer**:
   - Always-accessible drawer powered by **Google Gemini 3.8 Flash**.
   - Live function calling tool execution badges (inspect tool arguments and database results).
   - Enterprise banking guardrails protecting against credential queries and prompt injections.
   - Quick prompt suggestions for fast inquiries.

---

## Quick Start

### 1. Ensure Backend is Running
In one terminal, activate the backend environment and start FastAPI:
```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start the React Web App
In another terminal, start Vite:
```bash
cd web
npm install
npm run dev
```

Or from the root directory:
```bash
npm run web
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
