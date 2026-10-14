import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, TabKey } from './components/Sidebar';
import { OverviewTab } from './components/tabs/OverviewTab';
import { AccountsTab } from './components/tabs/AccountsTab';
import { TransactionsTab } from './components/tabs/TransactionsTab';
import { CardsAndLoansTab } from './components/tabs/CardsAndLoansTab';
import { SavingsGoalsTab } from './components/tabs/SavingsGoalsTab';
import { InvestmentsTab } from './components/tabs/InvestmentsTab';
import { PredictiveTab } from './components/tabs/PredictiveTab';
import { WellnessTab } from './components/tabs/WellnessTab';
import { CopilotChat } from './components/CopilotChat';

import {
  Customer,
  AccountsSummary,
  Transaction,
  CreditCard,
  Loan,
  Investment,
  SavingsBucket,
  FinancialWellnessScore,
  PersonalizedOffer,
  CashflowForecast,
} from './types/banking';
import { api } from './api/client';
import { Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotQuery, setCopilotQuery] = useState<string | undefined>(undefined);

  // Core Data State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [accounts, setAccounts] = useState<AccountsSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [buckets, setBuckets] = useState<SavingsBucket[]>([]);
  const [wellness, setWellness] = useState<FinancialWellnessScore | null>(null);
  const [offers, setOffers] = useState<PersonalizedOffer[]>([]);
  const [forecast, setForecast] = useState<CashflowForecast | null>(null);

  const loadBankingData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        custData,
        accData,
        txData,
        cardData,
        loanData,
        invData,
        bucketData,
        wellData,
        offerData,
        fcData,
      ] = await Promise.all([
        api.getCustomerProfile().catch(() => null),
        api.getAccountsSummary().catch(() => null),
        api.getTransactions({ limit: 50 }).catch(() => []),
        api.getCreditCards().catch(() => []),
        api.getLoans().catch(() => []),
        api.getInvestments().catch(() => []),
        api.getSavingsBuckets().catch(() => []),
        api.getWellnessScore().catch(() => null),
        api.getPersonalizedOffers().catch(() => []),
        api.getCashflowForecast(30).catch(() => null),
      ]);

      setCustomer(custData);
      setAccounts(accData);
      setTransactions(txData);
      setCards(cardData);
      setLoans(loanData);
      setInvestments(invData);
      setBuckets(bucketData);
      setWellness(wellData);
      setOffers(offerData);
      setForecast(fcData);
    } catch (err: any) {
      console.error('Failed to load initial banking data:', err);
      setError('Unable to reach Banking Copilot API. Ensure backend is running at http://localhost:8000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBankingData();
  }, []);

  const handleAskCopilot = (query: string) => {
    setCopilotQuery(query);
    setIsCopilotOpen(true);
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
        }}
        onOpenCopilot={() => setIsCopilotOpen(true)}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Header
          customer={customer}
          onOpenCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
          copilotOpen={isCopilotOpen}
        />

        {error && (
          <div style={{
            margin: '20px 36px 0',
            padding: '14px 18px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#f87171',
            fontSize: '0.875rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
            <button
              onClick={loadBankingData}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>
          </div>
        )}

        <main className="tab-viewport animate-fade-in">
          {loading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '50vh',
              gap: '16px',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(37, 99, 235, 0.2)',
                borderTopColor: '#38bdf8',
                borderRadius: '50%',
                animation: 'bounceDot 1s infinite',
              }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Connecting to Apex Core Banking Engine...
              </p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <OverviewTab
                  accounts={accounts}
                  cards={cards}
                  transactions={transactions}
                  wellness={wellness}
                  buckets={buckets}
                  onNavigate={(tab) => setActiveTab(tab)}
                  onAskCopilot={handleAskCopilot}
                />
              )}

              {activeTab === 'accounts' && (
                <AccountsTab
                  accounts={accounts}
                  onAskCopilot={handleAskCopilot}
                />
              )}

              {activeTab === 'transactions' && (
                <TransactionsTab
                  transactions={transactions}
                  onAskCopilot={handleAskCopilot}
                />
              )}

              {activeTab === 'cards_loans' && (
                <CardsAndLoansTab
                  cards={cards}
                  loans={loans}
                  onAskCopilot={handleAskCopilot}
                />
              )}

              {activeTab === 'savings' && (
                <SavingsGoalsTab
                  buckets={buckets}
                  onRefreshBuckets={loadBankingData}
                  onAskCopilot={handleAskCopilot}
                />
              )}

              {activeTab === 'investments' && (
                <InvestmentsTab
                  investments={investments}
                  onAskCopilot={handleAskCopilot}
                />
              )}

              {activeTab === 'predictive' && (
                <PredictiveTab
                  initialForecast={forecast}
                  onAskCopilot={handleAskCopilot}
                />
              )}

              {activeTab === 'wellness' && (
                <WellnessTab
                  wellness={wellness}
                  offers={offers}
                  onAskCopilot={handleAskCopilot}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Floating AI Copilot Toggle Button (when drawer is closed) */}
      {!isCopilotOpen && (
        <button
          onClick={() => setIsCopilotOpen(true)}
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
            color: '#fff',
            border: 'none',
            borderRadius: '9999px',
            padding: '12px 22px',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 8px 25px rgba(37, 99, 235, 0.5)',
            zIndex: 150,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(37, 99, 235, 0.7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.5)';
          }}
        >
          <Sparkles size={18} />
          <span>Ask Banking Copilot</span>
        </button>
      )}

      {/* Slide-out AI Copilot Drawer */}
      <CopilotChat
        isOpen={isCopilotOpen}
        onClose={() => {
          setIsCopilotOpen(false);
          setCopilotQuery(undefined);
        }}
        initialQuery={copilotQuery}
      />
    </div>
  );
};
