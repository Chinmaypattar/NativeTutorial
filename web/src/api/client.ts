import {
  AccountsSummary,
  AffordabilityResult,
  CashflowForecast,
  ChatResponse,
  CreditCard,
  Customer,
  FinancialWellnessScore,
  Investment,
  Loan,
  PersonalizedOffer,
  SavingsBucket,
  Transaction,
} from '../types/banking';

const API_BASE = 'http://localhost:8000/api/v1';

class BankingApiClient {
  private async fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || `API error ${response.status}: ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (err: any) {
      console.error(`API request failed: ${endpoint}`, err);
      throw err;
    }
  }

  // 1. Customer Profile
  async getCustomerProfile(): Promise<Customer> {
    return this.fetchJson<Customer>('/customers/me');
  }

  // 2. Accounts
  async getAccountsSummary(): Promise<AccountsSummary> {
    return this.fetchJson<AccountsSummary>('/accounts/summary');
  }

  // 3. Transactions
  async getTransactions(params?: {
    merchant?: string;
    category?: string;
    beneficiary?: string;
    min_amount?: number;
    max_amount?: number;
    start_date?: string;
    end_date?: string;
    limit?: number;
  }): Promise<Transaction[]> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
    }
    const qStr = query.toString();
    return this.fetchJson<Transaction[]>(`/transactions/${qStr ? `?${qStr}` : ''}`);
  }

  async getMerchantSpend(merchant: string, period?: string): Promise<any> {
    const q = new URLSearchParams({ merchant });
    if (period) q.append('period', period);
    return this.fetchJson<any>(`/transactions/merchant-spend?${q.toString()}`);
  }

  // 4. Credit Cards
  async getCreditCards(): Promise<CreditCard[]> {
    return this.fetchJson<CreditCard[]>('/credit-cards/');
  }

  async getCreditCardSummary(): Promise<any> {
    return this.fetchJson<any>('/credit-cards/summary');
  }

  // 5. Loans
  async getLoans(): Promise<Loan[]> {
    return this.fetchJson<Loan[]>('/loans/');
  }

  async getLoanSummary(): Promise<any> {
    return this.fetchJson<any>('/loans/summary');
  }

  // 6. Investments
  async getInvestments(): Promise<Investment[]> {
    return this.fetchJson<Investment[]>('/investments/');
  }

  async getInvestmentPortfolio(): Promise<any> {
    return this.fetchJson<any>('/investments/portfolio');
  }

  // 7. Savings Buckets
  async getSavingsBuckets(): Promise<SavingsBucket[]> {
    return this.fetchJson<SavingsBucket[]>('/savings-buckets/');
  }

  async createSavingsBucket(bucket: {
    name: string;
    target_amount: number;
    target_date: string;
    monthly_contribution?: number;
  }): Promise<SavingsBucket> {
    return this.fetchJson<SavingsBucket>('/savings-buckets/create', {
      method: 'POST',
      body: JSON.stringify(bucket),
    });
  }

  // 8. Financial Wellness
  async getWellnessScore(): Promise<FinancialWellnessScore> {
    return this.fetchJson<FinancialWellnessScore>('/wellness/score');
  }

  // 9. Personalized Offers
  async getPersonalizedOffers(): Promise<PersonalizedOffer[]> {
    return this.fetchJson<PersonalizedOffer[]>('/offers/recommendations');
  }

  // 10. Predictive Analytics
  async checkAffordability(data: {
    item_name: string;
    item_price: number;
    down_payment?: number;
    loan_tenure_months?: number;
    estimated_interest_rate?: number;
  }): Promise<AffordabilityResult> {
    return this.fetchJson<AffordabilityResult>('/analytics/affordability', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCashflowForecast(days_ahead: number = 30): Promise<CashflowForecast> {
    return this.fetchJson<CashflowForecast>(`/analytics/cashflow-forecast?days_ahead=${days_ahead}`);
  }

  // 11. Copilot Chat
  async sendChatMessage(content: string, session_id?: string | null): Promise<ChatResponse> {
    return this.fetchJson<ChatResponse>('/chat/message', {
      method: 'POST',
      body: JSON.stringify({
        content,
        session_id: session_id || null,
      }),
    });
  }
}

export const api = new BankingApiClient();
