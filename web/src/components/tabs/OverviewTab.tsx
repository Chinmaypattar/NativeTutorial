import React from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Target,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import {
  AccountsSummary,
  CreditCard as CreditCardType,
  FinancialWellnessScore,
  SavingsBucket,
  Transaction,
} from '../../types/banking';
import { formatCurrency, formatDateTime, maskAccountNumber, maskCardNumber } from '../../utils/formatters';
import { TabKey } from '../Sidebar';

interface OverviewTabProps {
  accounts: AccountsSummary | null;
  cards: CreditCardType[];
  transactions: Transaction[];
  wellness: FinancialWellnessScore | null;
  buckets: SavingsBucket[];
  onNavigate: (tab: TabKey) => void;
  onAskCopilot: (query: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  accounts,
  cards,
  transactions,
  wellness,
  buckets,
  onNavigate,
  onAskCopilot,
}) => {
  const primaryCard = cards[0];
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Welcome Banner & Total Wealth */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px 36px',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{
          position: 'absolute',
          right: '-40px',
          top: '-40px',
          width: '260px',
          height: '260px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#93c5fd', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Welcome back to your banking portal
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fff', marginTop: '4px', letterSpacing: '-0.02em' }}>
              Net Available Liquidity
            </h1>
            <div style={{ fontSize: '2.6rem', fontWeight: 800, color: '#fff', marginTop: '10px' }} className="mono">
              {formatCurrency(accounts?.total_balance || 245680.50)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
              <span className="badge badge-success">
                <ShieldCheck size={14} /> Active & Insured (DICGC)
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Across {accounts?.accounts.length || 2} Connected Accounts
              </span>
            </div>
          </div>

          {/* Quick AI Suggestions */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            maxWidth: '380px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Sparkles size={16} color="#38bdf8" />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Ask Copilot Fast
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'How much did I spend on Flipkart this year?',
                'Can I afford a new car for ₹8,00,000?',
                'Will I run out of money this month?',
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => onAskCopilot(prompt)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    color: '#94a3b8',
                    fontSize: '0.78rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(37, 99, 235, 0.15)';
                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prompt}</span>
                  <ChevronRight size={14} color="#64748b" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {accounts?.accounts.map((acc) => (
          <div key={acc.id} className="bank-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: acc.account_type === 'savings' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(14, 165, 233, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Wallet size={20} color={acc.account_type === 'savings' ? '#10b981' : '#0ea5e9'} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', textTransform: 'capitalize' }}>
                    {acc.account_type} Account
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Acc No: {maskAccountNumber(acc.account_number)}
                  </div>
                </div>
              </div>
              <span className="badge badge-success">Active</span>
            </div>

            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Current Balance</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }} className="mono">
                {formatCurrency(acc.balance)}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Branch: Mumbai Main (IFSC: APEX0001042)</span>
              <button
                onClick={() => onNavigate('transactions')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38bdf8',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>View Ledger</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}

        {/* Credit Card Snapshot */}
        {primaryCard && (
          <div className="bank-card" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <CreditCard size={20} color="#f59e0b" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                    {primaryCard.card_network} Platinum
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {maskCardNumber(primaryCard.card_number)}
                  </div>
                </div>
              </div>
              <span className="badge badge-warning">{primaryCard.reward_points} Pts</span>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Available Credit</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }} className="mono">
                  {formatCurrency(primaryCard.available_credit)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current Due</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f87171' }} className="mono">
                  {formatCurrency(primaryCard.current_balance)}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Due Date: {primaryCard.due_date}
              </span>
              <button
                onClick={() => onNavigate('cards_loans')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38bdf8',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>Card Details</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Two Column Section: Recent Transactions & Financial Wellness */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
        {/* Recent Transactions Ledger */}
        <div className="bank-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Recent Transactions</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Latest account debits and credits</p>
            </div>
            <button
              onClick={() => onNavigate('transactions')}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                cursor: 'pointer',
              }}
            >
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentTransactions.map((txn) => {
              const isCredit = txn.transaction_type === 'credit';
              return (
                <div
                  key={txn.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: isCredit ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {isCredit ? (
                        <ArrowDownLeft size={18} color="#10b981" />
                      ) : (
                        <ArrowUpRight size={18} color="#ef4444" />
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#fff' }}>
                        {txn.merchant || txn.beneficiary || txn.description}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {formatDateTime(txn.timestamp)} • <span style={{ color: 'var(--text-secondary)' }}>{txn.category}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div
                      className="mono"
                      style={{
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: isCredit ? '#10b981' : '#f8fafc',
                      }}
                    >
                      {isCredit ? '+' : '-'}{formatCurrency(txn.amount)}
                    </div>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        textTransform: 'uppercase',
                        color: isCredit ? '#10b981' : 'var(--text-muted)',
                      }}
                    >
                      {txn.transaction_type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Financial Wellness & Savings Goals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Wellness Score Card */}
          <div className="bank-card" style={{ background: 'linear-gradient(135deg, #16243b, #0f172a)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>5-Pillar Financial Health</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Continuous AI credit & wellness audit</p>
              </div>
              <span className="badge badge-success">Grade {wellness?.grade || 'B+'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '14px 0' }}>
              <div style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                background: 'conic-gradient(#10b981 0% 78%, rgba(255,255,255,0.08) 78% 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'var(--bg-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }} className="mono">
                    {wellness?.overall_score || 78}
                  </span>
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>/ 100</span>
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Savings Rate</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{(wellness?.savings_rate || 0.28 * 100).toFixed(0)}%</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '4px' }}>
                    <div style={{ width: '65%', height: '100%', background: '#10b981', borderRadius: '2px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Debt-to-Income (DTI)</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{(wellness?.debt_to_income_ratio || 0.22 * 100).toFixed(0)}%</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '4px' }}>
                    <div style={{ width: '40%', height: '100%', background: '#38bdf8', borderRadius: '2px' }} />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('wellness')}
              style={{
                width: '100%',
                padding: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: '#38bdf8',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '10px',
              }}
            >
              View Full Wellness Audit & Tips
            </button>
          </div>

          {/* Savings Buckets Mini Tracker */}
          <div className="bank-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={18} color="#38bdf8" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>Savings Buckets</h3>
              </div>
              <button
                onClick={() => onNavigate('savings')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38bdf8',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                + Manage
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {buckets.slice(0, 2).map((b) => {
                const percent = Math.min(100, Math.round((b.current_amount / b.target_amount) * 100));
                return (
                  <div key={b.id} style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
                      <span>{b.name}</span>
                      <span className="mono">{percent}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', margin: '6px 0' }}>
                      <div style={{ width: `${percent}%`, height: '100%', background: 'linear-gradient(90deg, #38bdf8, #2563eb)', borderRadius: '3px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <span>{formatCurrency(b.current_amount, false)} saved</span>
                      <span>Target: {formatCurrency(b.target_amount, false)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
