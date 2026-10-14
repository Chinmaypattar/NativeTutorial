import {
  Account,
  AccountsSummary,
  AffordabilityResult,
  AuthResponse,
  BillPayPayload,
  BillPayResponse,
  CashflowForecastResponse,
  ChatMessage,
  ChatResponse,
  CreditCard,
  Customer,
  FinancialWellnessScore,
  Investment,
  Loan,
  OfferRecommendationResponse,
  PersonalizedOffer,
  SavingsBucket,
  Transaction,
  TransferPayload,
  TransferResponse,
} from '../types/banking';

const API_BASE = 'http://localhost:8000/api/v1';

class BankingApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('apex_auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('apex_auth_token', token);
    } else {
      localStorage.removeItem('apex_auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.detail || errorBody.message || `API error ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (err: any) {
      console.error(`API request failed: ${endpoint}`, err);
      throw err;
    }
  }

  // 1. Authentication & Identity
  async login(email: string, password: string = 'password'): Promise<AuthResponse> {
    const res = await this.fetchJson<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(res.access_token);
    return res;
  }

  async register(data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone?: string;
    monthly_income?: number;
  }): Promise<AuthResponse> {
    const res = await this.fetchJson<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(res.access_token);
    return res;
  }

  logout() {
    this.setToken(null);
  }

  async getCurrentUser(): Promise<Customer> {
    return this.fetchJson<Customer>('/auth/me');
  }

  async getCustomerProfile(): Promise<Customer> {
    return this.getCurrentUser();
  }

  // 2. Accounts
  async getAccountsSummary(): Promise<AccountsSummary> {
    const [summary, accList] = await Promise.all([
      this.fetchJson<any>('/accounts/summary').catch(() => null),
      this.fetchJson<Account[]>('/accounts/').catch(() => []),
    ]);

    const accounts = (summary?.accounts && Array.isArray(summary.accounts) && summary.accounts.length > 0)
      ? summary.accounts
      : (Array.isArray(accList) ? accList : []);

    const totalBalance = summary?.total_balance ?? accounts.reduce((sum: number, a: Account) => sum + (a.balance || 0), 0);

    return {
      customer_id: accounts[0]?.customer_id || 1,
      total_balance: totalBalance,
      savings_balance: summary?.savings_balance,
      checking_balance: summary?.checking_balance,
      accounts,
    };
  }

  // 3. Transactions & Transfers
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

  async transferFunds(payload: TransferPayload): Promise<TransferResponse> {
    return this.fetchJson<TransferResponse>('/transactions/transfer', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async payBill(payload: BillPayPayload): Promise<BillPayResponse> {
    return this.fetchJson<BillPayResponse>('/transactions/pay-bill', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // 4. Credit Cards
  async getCreditCards(): Promise<CreditCard[]> {
    return this.fetchJson<CreditCard[]>('/credit-cards/');
  }

  // 5. Loans
  async getLoans(): Promise<Loan[]> {
    return this.fetchJson<Loan[]>('/loans/');
  }

  // 6. Investments
  async getInvestments(): Promise<Investment[]> {
    return this.fetchJson<Investment[]>('/investments/');
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
    const res = await this.fetchJson<OfferRecommendationResponse>('/offers/recommendations');
    return res.recommendations || [];
  }

  // 10. Predictive Analytics
  async checkAffordability(data: {
    item_name: string;
    total_cost: number;
    down_payment?: number;
    loan_tenure_months?: number;
    estimated_monthly_emi?: number;
  }): Promise<AffordabilityResult> {
    return this.fetchJson<AffordabilityResult>('/analytics/affordability', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCashflowForecast(days_ahead: number = 30): Promise<CashflowForecastResponse> {
    return this.fetchJson<CashflowForecastResponse>(
      `/analytics/cashflow-forecast?days_ahead=${days_ahead}`
    );
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
