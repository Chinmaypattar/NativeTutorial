export interface Customer {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  monthly_income: number;
  credit_score: number;
  risk_profile: string;
}

export interface Account {
  id: number;
  customer_id: number;
  account_number: string;
  account_type: 'savings' | 'checking' | 'fixed_deposit';
  balance: number;
  currency: string;
  status: string;
}

export interface AccountsSummary {
  customer_id: number;
  total_balance: number;
  accounts: Account[];
}

export interface Transaction {
  id: number;
  account_id: number;
  customer_id: number;
  amount: number;
  transaction_type: 'debit' | 'credit' | 'transfer';
  category: string;
  merchant?: string;
  beneficiary?: string;
  description: string;
  timestamp: string;
}

export interface MerchantSpend {
  merchant: string;
  total_spend: number;
  transaction_count: number;
  average_ticket_size: number;
  transactions?: Transaction[];
}

export interface CreditCard {
  id: number;
  customer_id: number;
  card_number: string;
  card_network: string;
  credit_limit: number;
  available_credit: number;
  current_balance: number;
  due_date: string;
  reward_points: number;
  utilization_ratio?: number;
}

export interface Loan {
  id: number;
  customer_id: number;
  loan_type: string;
  principal_amount: number;
  remaining_balance: number;
  interest_rate: number;
  monthly_emi: number;
  start_date: string;
  end_date: string;
}

export interface Investment {
  id: number;
  customer_id: number;
  asset_type: 'mutual_fund' | 'stock' | 'fixed_deposit' | 'gold' | 'bond';
  name: string;
  invested_amount: number;
  current_value: number;
  returns_percentage: number;
}

export interface SavingsBucket {
  id: number;
  customer_id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  monthly_contribution: number;
  completion_percentage?: number;
  months_remaining?: number;
}

export interface FinancialWellnessPillar {
  name: string;
  score: number;
  max_score: number;
  status: 'excellent' | 'good' | 'moderate' | 'needs_attention';
  detail: string;
}

export interface FinancialWellnessScore {
  customer_id: number;
  overall_score: number;
  grade: string;
  savings_rate: number;
  debt_to_income_ratio: number;
  credit_utilization_ratio: number;
  emergency_fund_months: number;
  pillars: FinancialWellnessPillar[];
  recommendations: string[];
}

export interface PersonalizedOffer {
  id: string;
  title: string;
  category: 'credit_card' | 'loan' | 'investment';
  description: string;
  benefit_highlight: string;
  apr_or_return?: string;
  status: 'pre_approved' | 'recommended';
}

export interface AffordabilityResult {
  item_name: string;
  item_price: number;
  down_payment: number;
  loan_amount: number;
  estimated_monthly_emi: number;
  verdict: 'AFFORDABLE' | 'STRETCH' | 'UNAFFORDABLE';
  verdict_description: string;
  current_savings: number;
  post_purchase_savings: number;
  emergency_fund_runway_months: number;
  post_purchase_dti_ratio: number;
  reasoning: string[];
}

export interface CashflowForecastDay {
  day_offset: number;
  date: string;
  predicted_balance: number;
  predicted_income: number;
  predicted_expense: number;
  event_note?: string;
}

export interface CashflowForecast {
  customer_id: number;
  starting_balance: number;
  ending_balance: number;
  lowest_predicted_balance: number;
  days_projected: number;
  risk_level: 'SAFE' | 'MODERATE' | 'CRITICAL';
  projection: CashflowForecastDay[];
}

export interface ToolExecutionRecord {
  tool_name: string;
  arguments: Record<string, any>;
  result: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tools_executed?: ToolExecutionRecord[];
}

export interface ChatResponse {
  session_id: string;
  reply: string;
  tools_executed: ToolExecutionRecord[];
  session_context: Record<string, any>;
}
