import React, { useState } from 'react';
import {
  Wallet,
  ArrowRightLeft,
  FileText,
  Copy,
  Check,
  Shield,
  Building2,
} from 'lucide-react';
import { AccountsSummary, Account } from '../../types/banking';
import { formatCurrency, maskAccountNumber } from '../../utils/formatters';

interface AccountsTabProps {
  accounts: AccountsSummary | null;
  onAskCopilot: (query: string) => void;
  onOpenTransfer: () => void;
  onOpenStatement: (account: Account) => void;
}

export const AccountsTab: React.FC<AccountsTabProps> = ({
  accounts,
  onAskCopilot,
  onOpenTransfer,
  onOpenStatement,
}) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (acc: Account) => {
    navigator.clipboard.writeText(acc.account_number);
    setCopiedId(acc.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Title & Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>Deposit Accounts & Balances</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Manage your high-yield savings and operational checking portfolios
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onOpenTransfer} className="btn-secondary" style={{ fontSize: '0.82rem' }}>
            <ArrowRightLeft size={14} color="#1d4ed8" />
            <span>Transfer Funds</span>
          </button>
          <button
            onClick={() => onAskCopilot('What is my total account balance?')}
            className="btn-primary"
            style={{ fontSize: '0.82rem' }}
          >
            <span>Audit Balances via Copilot</span>
          </button>
        </div>
      </div>

      {/* Grid of Accounts */}
      {(accounts?.accounts || []).length === 0 ? (
        <div className="bank-card" style={{ textAlign: 'center', padding: '48px 24px', background: '#ffffff' }}>
          <Building2 size={40} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>No Active Accounts Displayed</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '8px auto 0' }}>
            Please sign in to view your savings and checking balances, or register for a new Apex Digital Account.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
          {(accounts?.accounts || []).map((acc) => {
            const isSavings = acc.account_type.toLowerCase().includes('savings');
            return (
            <div
              key={acc.id}
              className="bank-card"
              style={{
                background: isSavings
                  ? 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)'
                  : '#ffffff',
                border: isSavings ? '1px solid #bbf7d0' : '1px solid var(--border-subtle)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: isSavings ? '#ecfdf5' : '#eff6ff',
                    border: isSavings ? '1px solid #a7f3d0' : '1px solid #bfdbfe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Building2 size={24} color={isSavings ? '#059669' : '#1d4ed8'} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                      Apex Premier {acc.account_type}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                      <span className="mono" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {maskAccountNumber(acc.account_number)}
                      </span>
                      <button
                        onClick={() => handleCopy(acc)}
                        title="Copy Account Number"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                      >
                        {copiedId === acc.id ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                <span className="badge badge-success">
                  {acc.status}
                </span>
              </div>

              {/* Balance Large View */}
              <div style={{ margin: '28px 0 20px' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Total Available Balance
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }} className="mono">
                  {formatCurrency(acc.balance)}
                </div>
              </div>

              {/* Details table */}
              <div style={{
                background: '#f8fafc',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                fontSize: '0.8rem',
                border: '1px solid var(--border-subtle)',
              }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>IFSC Code:</span>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 700 }} className="mono">APEX0001042</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Interest Rate:</span>
                  <div style={{ color: '#059669', fontWeight: 700 }}>{isSavings ? '4.00% p.a.' : 'Nil (Checking)'}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Branch:</span>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Bandra Kurla Complex, Mumbai</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Nominee:</span>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Registered (Rahul S.)</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  onClick={onOpenTransfer}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}
                >
                  <ArrowRightLeft size={14} />
                  <span>Transfer Funds</span>
                </button>
                <button
                  onClick={() => onOpenStatement(acc)}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}
                >
                  <FileText size={14} />
                  <span>Statement</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Security Banner */}
      <div style={{
        background: '#ecfdf5',
        border: '1px solid #a7f3d0',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <Shield size={28} color="#059669" />
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#065f46' }}>
            Deposit Insurance & Credit Guarantee Corporation (DICGC) Insured
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#047857', marginTop: '2px' }}>
            All customer deposits up to ₹5,00,000 across savings, current, and fixed deposits are fully insured under Reserve Bank of India statutory safety standards.
          </p>
        </div>
      </div>
    </div>
  );
};
