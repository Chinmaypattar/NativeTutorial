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

// Banking Operations Modals
import { LoginPortal } from './components/auth/LoginPortal';
import { TransferModal } from './components/modals/TransferModal';
import { BillPayModal } from './components/modals/BillPayModal';
import { StatementModal } from './components/modals/StatementModal';

import {
  Customer,
  AccountsSummary,
  Account,
  Transaction,
  CreditCard,
  Loan,
  Investment,
  SavingsBucket,
  FinancialWellnessScore,
  PersonalizedOffer,
  CashflowForecastResponse,
} from './types/banking';
import { api } from './api/client';
import { Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotQuery, setCopilotQuery] = useState<string | undefined>(undefined);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
  const [forecast, setForecast] = useState<CashflowForecastResponse | null>(null);

  // Modal Dialog States
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isBillPayOpen, setIsBillPayOpen] = useState(false);
  const [statementAccount, setStatementAccount] = useState<Account | null>(null);

  const loadBankingData = async () => {
    setLoading(true);
    setError(null);

    const token = api.getToken();
    if (!token) {
      setCustomer(null);
      setAccounts(null);
      setTransactions([]);
      setCards([]);
      setLoans([]);
      setInvestments([]);
      setBuckets([]);
      setWellness(null);
      setOffers([]);
      setForecast(null);
      setLoading(false);
      return;
    }

    try {
      const custData = await api.getCustomerProfile();
      if (!custData) {
        api.setToken(null);
        setCustomer(null);
        setLoading(false);
        return;
      }

      setCustomer(custData);

      const [
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
      console.error('Failed to load banking data:', err);
      api.setToken(null);
      setCustomer(null);
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

  const handleOpenTransfer = () => {
    if (!customer) {
      return;
    }
    setIsTransferOpen(true);
  };

  const handleOpenBillPay = () => {
    if (!customer) {
      return;
    }
    setIsBillPayOpen(true);
  };

  const handleLogout = () => {
    api.logout();
    setCustomer(null);
    setAccounts(null);
    setTransactions([]);
    setCards([]);
    setLoans([]);
    setInvestments([]);
    setBuckets([]);
    setWellness(null);
    setOffers([]);
    setForecast(null);
  };

  // If loading without an active user, show initialization spinner
  if (loading && !customer) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        background: '#f8fafc',
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          border: '3px solid rgba(29, 78, 216, 0.15)',
          borderTopColor: '#1d4ed8',
          borderRadius: '50%',
          animation: 'bounceDot 1s infinite',
        }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
          Connecting to Apex NetBanking Gateway...
        </p>
      </div>
    );
  }

  // If user is not authenticated, render the Secure Login & Registration Portal by default
  if (!customer) {
    return (
      <>
        <LoginPortal
          onLoginSuccess={(loggedUser) => {
            setCustomer(loggedUser);
            loadBankingData();
          }}
          onOpenCopilot={() => setIsCopilotOpen(true)}
        />
        <CopilotChat
          isOpen={isCopilotOpen}
          onClose={() => {
            setIsCopilotOpen(false);
            setCopilotQuery(undefined);
          }}
          initialQuery={copilotQuery}
        />
      </>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsMobileMenuOpen(false);
        }}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenTransfer={handleOpenTransfer}
        onOpenBillPay={handleOpenBillPay}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Header
          customer={customer}
          onOpenCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
          copilotOpen={isCopilotOpen}
          onOpenTransfer={handleOpenTransfer}
          onOpenBillPay={handleOpenBillPay}
          onLogout={handleLogout}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
                border: '3px solid rgba(29, 78, 216, 0.15)',
                borderTopColor: '#1d4ed8',
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
                  onOpenTransfer={handleOpenTransfer}
                  onOpenStatement={(acc) => setStatementAccount(acc)}
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
          className="floating-copilot-btn"
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
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
            boxShadow: '0 8px 25px rgba(29, 78, 216, 0.35)',
            zIndex: 150,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(29, 78, 216, 0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(29, 78, 216, 0.35)';
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

      {/* Modals for Transfer, Bill Pay, and Account Statements */}

      <TransferModal
        isOpen={isTransferOpen}
        accounts={accounts?.accounts || []}
        onClose={() => setIsTransferOpen(false)}
        onSuccess={() => loadBankingData()}
      />

      <BillPayModal
        isOpen={isBillPayOpen}
        accounts={accounts?.accounts || []}
        onClose={() => setIsBillPayOpen(false)}
        onSuccess={() => loadBankingData()}
      />

      <StatementModal
        isOpen={!!statementAccount}
        account={statementAccount}
        customer={customer}
        transactions={transactions}
        onClose={() => setStatementAccount(null)}
      />
    </div>
  );
};
