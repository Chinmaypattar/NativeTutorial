export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
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
  savings_balance?: number;
  checking_balance?: number;
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
  merchant_name?: string;
  beneficiary?: string;
  description: string;
  timestamp: string;
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
  status?: string;
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
  product_type: string;
  title: string;
  description: string;
  benefits: string[];
  interest_rate_or_rewards: string;
  eligibility_status: string;
}

export interface OfferRecommendationResponse {
  customer_id: number;
  customer_credit_score: number;
  recommendations: PersonalizedOffer[];
}

export interface AffordabilityResult {
  item_name: string;
  total_cost: number;
  is_affordable: boolean;
  verdict: string;
  monthly_impact: number;
  current_debt_to_income: number;
  projected_debt_to_income: number;
  emergency_fund_buffer_months: number;
  analysis_details: string[];
  suggested_alternative?: string;
}

export interface DailyCashflowPoint {
  date: string;
  projected_balance: number;
  inflows: number;
  outflows: number;
  event_description?: string;
}

export interface CashflowForecastResponse {
  customer_id: number;
  forecast_days: number;
  current_liquid_balance: number;
  projected_end_balance: number;
  lowest_projected_balance: number;
  lowest_balance_date: string;
  run_out_of_money_risk: boolean;
  risk_level: string;
  predicted_shortfall: number;
  insights: string[];
  timeline: DailyCashflowPoint[];
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

export interface AuthResponse {
  access_token: string;
  token_type: string;
  customer_id: number;
  customer_name: string;
  email: string;
}

export interface TransferPayload {
  source_account_id: number;
  beneficiary_name: string;
  beneficiary_account: string;
  amount: number;
  remarks?: string;
}

export interface TransferResponse {
  reference_id: string;
  status: string;
  amount: number;
  source_account_id: number;
  beneficiary_name: string;
  remaining_balance: number;
  timestamp: string;
}

export interface BillPayPayload {
  account_id: number;
  biller_name: string;
  bill_category: string;
  consumer_number: string;
  amount: number;
}

export interface BillPayResponse {
  reference_id: string;
  status: string;
  amount: number;
  biller_name: string;
  consumer_number: string;
  remaining_balance: number;
  timestamp: string;
}
