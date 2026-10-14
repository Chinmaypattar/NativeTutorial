import React from 'react';
import {
  CreditCard as CardIcon,
  Landmark,
  Calendar,
  AlertCircle,
  Gift,
  Percent,
  CheckCircle2,
  Clock,
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
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>Credit Cards & Active Loans</h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Review card utilization, statements, due dates, loan tenures, and monthly EMIs
        </p>
      </div>

      {/* Credit Cards Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CardIcon size={20} color="#38bdf8" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>Credit Cards</h2>
          </div>
          <button
            onClick={() => onAskCopilot('What are my credit card due dates and limits?')}
            className="btn-secondary"
            style={{ fontSize: '0.78rem' }}
          >
            Audit Cards via AI
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {cards.map((card) => {
            const utilRatio = (card.current_balance / card.credit_limit) * 100;
            return (
              <div key={card.id} className="bank-card" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
                {/* Visual Card Plastic */}
                <div style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #1e3a8a 50%, #0f172a 100%)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  position: 'relative',
                  marginBottom: '20px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, letterSpacing: '0.1em', fontSize: '0.9rem', color: '#fff' }}>
                      APEX PLATINUM
                    </span>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fbbf24', fontStyle: 'italic' }}>
                      {card.card_network}
                    </span>
                  </div>

                  {/* EMV Chip representation */}
                  <div style={{
                    width: '38px',
                    height: '28px',
                    background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                    borderRadius: '6px',
                    margin: '20px 0 16px',
                  }} />

                  <div className="mono" style={{ fontSize: '1.25rem', letterSpacing: '0.12em', color: '#fff', fontWeight: 600 }}>
                    {maskCardNumber(card.card_number)}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '16px' }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
                        Cardholder
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                        PRANITA SHARMA
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
                        Expires
                      </div>
                      <div className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                        08/29
                      </div>
                    </div>
                  </div>
                </div>

                {/* Utilization meter */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Credit Utilization:</span>
                    <span style={{ color: utilRatio < 30 ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                      {utilRatio.toFixed(1)}% (Healthy &lt;30%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.min(100, utilRatio)}%`,
                        height: '100%',
                        background: utilRatio < 30 ? '#10b981' : '#f59e0b',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>

                {/* Stats Breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Current Outstanding</div>
                    <div className="mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f87171', marginTop: '2px' }}>
                      {formatCurrency(card.current_balance)}
                    </div>
                  </div>

                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Available Limit</div>
                    <div className="mono" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                      {formatCurrency(card.available_credit)}
                    </div>
                  </div>
                </div>

                {/* Due Date & Rewards banner */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={14} color="#f59e0b" />
                    <span>Payment Due: <strong>{card.due_date}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>
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
            <Landmark size={20} color="#10b981" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>Active Loans & Mortgages</h2>
          </div>
          <button
            onClick={() => onAskCopilot('What are my active loans and monthly EMIs?')}
            className="btn-secondary"
            style={{ fontSize: '0.78rem' }}
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
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginTop: '8px' }}>
                      {formatCurrency(loan.principal_amount, false)} Sanctioned
                    </h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Monthly EMI</div>
                    <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
                      {formatCurrency(loan.monthly_emi)}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ margin: '20px 0 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Principal Repaid</span>
                    <span style={{ color: '#fff', fontWeight: 700 }}>{progress}% Repaid</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: '#10b981', borderRadius: '4px' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8rem', background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '8px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Remaining Balance:</span>
                    <div className="mono" style={{ color: '#fff', fontWeight: 700 }}>
                      {formatCurrency(loan.remaining_balance)}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Interest Rate:</span>
                    <div style={{ color: '#10b981', fontWeight: 700 }}>
                      {loan.interest_rate}% p.a. Fixed
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Start Date:</span>
                    <div style={{ color: '#fff' }}>{formatDate(loan.start_date)}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Maturity Date:</span>
                    <div style={{ color: '#fff' }}>{formatDate(loan.end_date)}</div>
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
