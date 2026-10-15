import React from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  Target,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import {
  AccountsSummary,
  CreditCard as CreditCardType,
  Transaction,
  FinancialWellnessScore,
  SavingsBucket,
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
  const primaryCard = (cards || [])[0];
  const recentTransactions = (transactions || []).slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Welcome Banner & Total Wealth */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: 'clamp(20px, 4vw, 36px)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
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
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#bfdbfe', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Welcome to Apex Digital NetBanking
            </div>
            <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.9rem)', fontWeight: 800, color: '#ffffff', marginTop: '4px', letterSpacing: '-0.02em' }}>
              Total Liquid Portfolio Balance
            </h1>
            <div style={{ fontSize: 'clamp(1.8rem, 6vw, 2.8rem)', fontWeight: 800, color: '#ffffff', marginTop: '8px' }} className="mono">
              {formatCurrency(accounts?.total_balance || 245680.50)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
              <span className="badge badge-success" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
                <ShieldCheck size={14} /> Active & Insured (DICGC)
              </span>
              <span style={{ fontSize: '0.82rem', color: '#e0f2fe', fontWeight: 500 }}>
                Across {accounts?.accounts?.length ?? 0} Connected Accounts
              </span>
            </div>
          </div>

          {/* Quick AI Suggestions on Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.14)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            maxWidth: '380px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Sparkles size={16} color="#7dd3fc" />
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prompt}</span>
                  <ChevronRight size={14} color="#bfdbfe" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid-cards-responsive">
        {(accounts?.accounts || []).map((acc) => (
          <div key={acc.id} className="bank-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: acc.account_type === 'savings' ? '#ecfdf5' : '#eff6ff',
                  border: acc.account_type === 'savings' ? '1px solid #a7f3d0' : '1px solid #bfdbfe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Wallet size={20} color={acc.account_type === 'savings' ? '#059669' : '#1d4ed8'} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                    Apex Premier {acc.account_type}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Acc No: {maskAccountNumber(acc.account_number)}
                  </div>
                </div>
              </div>
              <span className="badge badge-success">Active</span>
            </div>

            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Available Balance</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }} className="mono">
                {formatCurrency(acc.balance)}
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Interest: {acc.account_type === 'savings' ? '4.00% p.a.' : 'Nil (Checking)'}
              </span>
              <button
                onClick={() => onNavigate('accounts')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1d4ed8',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>View Details</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}

        {/* Credit Card Snapshot (Authentic Dark Plastic Look) */}
        {primaryCard && (
          <div className="bank-card" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <CreditCard size={20} color="#f59e0b" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                    {primaryCard.card_network} Platinum
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    {maskCardNumber(primaryCard.card_number)}
                  </div>
                </div>
              </div>
              <span className="badge badge-warning">{primaryCard.reward_points} Pts</span>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Available Limit</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }} className="mono">
                  {formatCurrency(primaryCard.available_credit)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Current Due</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f87171' }} className="mono">
                  {formatCurrency(primaryCard.current_balance)}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                Due Date: {primaryCard.due_date}
              </span>
              <button
                onClick={() => onNavigate('cards_loans')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38bdf8',
                  fontSize: '0.8rem',
                  fontWeight: 700,
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
      <div className="grid-2col-responsive">
        {/* Recent Transactions Ledger */}
        <div className="bank-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>Recent Transactions</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Latest account debits and credits</p>
            </div>
            <button
              onClick={() => onNavigate('transactions')}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                    background: '#f8fafc',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: isCredit ? '#ecfdf5' : '#fef2f2',
                      border: isCredit ? '1px solid #a7f3d0' : '1px solid #fecaca',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {isCredit ? (
                        <ArrowDownLeft size={18} color="#059669" />
                      ) : (
                        <ArrowUpRight size={18} color="#dc2626" />
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
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
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        color: isCredit ? '#059669' : 'var(--text-primary)',
                      }}
                    >
                      {isCredit ? '+' : '-'}{formatCurrency(txn.amount)}
                    </div>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        color: isCredit ? '#059669' : 'var(--text-muted)',
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
          <div className="bank-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>5-Pillar Financial Health</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Continuous AI credit & wellness audit</p>
              </div>
              <span className="badge badge-success">Grade {wellness?.grade || 'B+'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: '14px 0' }}>
              <div style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                background: 'conic-gradient(#059669 0% 78%, #e2e8f0 78% 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }} className="mono">
                    {wellness?.overall_score || 78}
                  </span>
                  <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>/ 100</span>
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Savings Rate</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{(wellness?.savings_rate || 0.28 * 100).toFixed(0)}%</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '3px', marginTop: '4px' }}>
                    <div style={{ width: '65%', height: '100%', background: '#059669', borderRadius: '3px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Debt-to-Income (DTI)</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{(wellness?.debt_to_income_ratio || 0.22 * 100).toFixed(0)}%</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '3px', marginTop: '4px' }}>
                    <div style={{ width: '40%', height: '100%', background: '#1d4ed8', borderRadius: '3px' }} />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('wellness')}
              className="btn-secondary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '9px',
                fontSize: '0.8rem',
                marginTop: '10px',
              }}
            >
              View Full Wellness Audit & Offers
            </button>
          </div>

          {/* Savings Buckets Mini Tracker */}
          <div className="bank-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={18} color="#1d4ed8" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>Savings Buckets</h3>
              </div>
              <button
                onClick={() => onNavigate('savings')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1d4ed8',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                + Manage
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(buckets || []).slice(0, 2).map((b) => {
                const percent = Math.min(100, Math.round((b.current_amount / b.target_amount) * 100));
                return (
                  <div key={b.id} style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      <span>{b.name}</span>
                      <span className="mono">{percent}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', margin: '6px 0' }}>
                      <div style={{ width: `${percent}%`, height: '100%', background: 'linear-gradient(90deg, #1d4ed8, #0284c7)', borderRadius: '3px' }} />
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
