import React from 'react';
import {
  CreditCard as CardIcon,
  Landmark,
  ShieldAlert,
  Percent,
  Calendar,
  Gift,
} from 'lucide-react';
import { CreditCard, Loan } from '../../types/banking';
import { formatCurrency, formatDate, maskCardNumber } from '../../utils/formatters';

interface CardsAndLoansTabProps {
  cards: CreditCard[];
  loans: Loan[];
  onAskCopilot: (query: string) => void;
}

export const CardsAndLoansTab: React.FC<CardsAndLoansTabProps> = ({ cards, loans, onAskCopilot }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>Credit Cards & Active Loans</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Review card utilization, statements, due dates, loan tenures, and monthly EMIs
        </p>
      </div>

      {/* Credit Cards Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CardIcon size={20} color="#1d4ed8" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Credit Cards</h2>
          </div>
          <button
            onClick={() => onAskCopilot('What are my credit card due dates and limits?')}
            className="btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            Audit Cards via AI
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {cards.map((card) => {
            const utilRatio = (card.current_balance / card.credit_limit) * 100;
            return (
              <div key={card.id} className="bank-card" style={{ background: '#ffffff', border: '1px solid var(--border-subtle)' }}>
                {/* Visual Card Plastic */}
                <div style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #1e3a8a 50%, #0f172a 100%)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  boxShadow: '0 10px 25px rgba(15, 23, 42, 0.25)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  position: 'relative',
                  marginBottom: '20px',
                  color: '#ffffff',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, letterSpacing: '0.1em', fontSize: '0.9rem', color: '#ffffff' }}>
                      APEX PLATINUM
                    </span>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fbbf24', fontStyle: 'italic' }}>
                      {card.card_network}
                    </span>
                  </div>

                  {/* EMV Chip & Contactless */}
                  <div style={{ margin: '22px 0 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '38px',
                      height: '28px',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      borderRadius: '5px',
                      border: '1px solid #fbbf24',
                    }} />
                    <span style={{ fontSize: '0.75rem', color: '#e0f2fe', letterSpacing: '0.05em' }}>
                      Contactless Enabled
                    </span>
                  </div>

                  {/* Masked Card Number */}
                  <div className="mono" style={{ fontSize: '1.25rem', letterSpacing: '0.12em', color: '#ffffff', fontWeight: 700 }}>
                    {maskCardNumber(card.card_number)}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '18px' }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: '#93c5fd', textTransform: 'uppercase' }}>Cardholder</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                        PRANITA SHARMA
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: '#93c5fd', textTransform: 'uppercase' }}>Expires</div>
                      <div className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                        12/29
                      </div>
                    </div>
                  </div>
                </div>

                {/* Utilization meter */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Credit Line Utilization</span>
                    <span style={{ fontWeight: 700, color: utilRatio > 30 ? '#d97706' : '#059669' }}>
                      {utilRatio.toFixed(1)}% ({utilRatio < 30 ? 'Healthy' : 'Moderate'})
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.min(utilRatio, 100)}%`,
                        height: '100%',
                        background: utilRatio > 30 ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : '#059669',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                  <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Credit Limit</div>
                    <div className="mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {formatCurrency(card.credit_limit)}
                    </div>
                  </div>
                  <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Available Limit</div>
                    <div className="mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669' }}>
                      {formatCurrency(card.available_credit)}
                    </div>
                  </div>
                  <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Payment Due Date</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#d97706', marginTop: '2px' }}>
                      {card.due_date}
                    </div>
                  </div>
                  <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>APR Interest</div>
                    <div className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {card.apr ?? 42.0}% p.a.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#d97706', fontWeight: 700 }}>
                    <Gift size={14} />
                    <span>{card.reward_points} Reward Points</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Loans Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Landmark size={20} color="#059669" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Active Loans & Mortgages</h2>
          </div>
          <button
            onClick={() => onAskCopilot('What are my active loans and monthly EMIs?')}
            className="btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            Review Loans with AI
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {loans.map((loan) => {
            const paid = loan.principal_amount - loan.remaining_balance;
            const progress = Math.round((paid / loan.principal_amount) * 100);
            return (
              <div key={loan.id} className="bank-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
                      {loan.loan_type} Loan
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>
                      {formatCurrency(loan.principal_amount, false)} Sanctioned
                    </h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Monthly EMI</div>
                    <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1d4ed8' }}>
                      {formatCurrency(loan.monthly_emi)}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ margin: '20px 0 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Principal Repaid</span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>{progress}% Repaid</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: '#059669', borderRadius: '4px' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8rem', background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Remaining Balance:</span>
                    <div className="mono" style={{ color: 'var(--text-primary)', fontWeight: 800 }}>
                      {formatCurrency(loan.remaining_balance)}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Interest Rate:</span>
                    <div style={{ color: '#059669', fontWeight: 700 }}>
                      {loan.interest_rate}% p.a. Fixed
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Start Date:</span>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{formatDate(loan.start_date)}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Maturity Date:</span>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{formatDate(loan.end_date)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
