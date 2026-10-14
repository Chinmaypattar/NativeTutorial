import React from 'react';
import {
  FileText,
  X,
  Printer,
  Download,
  Shield,
  Building2,
} from 'lucide-react';
import { Account, Customer, Transaction } from '../../types/banking';
import { formatCurrency, formatDateTime, maskAccountNumber } from '../../utils/formatters';

interface StatementModalProps {
  isOpen: boolean;
  account: Account | null;
  customer: Customer | null;
  transactions: Transaction[];
  onClose: () => void;
}

export const StatementModal: React.FC<StatementModalProps> = ({
  isOpen,
  account,
  customer,
  transactions,
  onClose,
}) => {
  if (!isOpen || !account) return null;

  const handlePrint = () => {
    window.print();
  };

  const accountTransactions = transactions.filter(
    (t) => t.account_id === account.id || !t.account_id
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', padding: '36px', background: '#ffffff' }}>
        {/* Actions Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handlePrint} className="btn-secondary" style={{ padding: '7px 14px', fontSize: '0.8rem' }}>
              <Printer size={15} />
              <span>Print / Save as PDF</span>
            </button>
            <button onClick={handlePrint} className="btn-secondary" style={{ padding: '7px 14px', fontSize: '0.8rem' }}>
              <Download size={15} />
              <span>Export CSV</span>
            </button>
          </div>

          <button
            onClick={onClose}
            style={{ background: '#f1f5f9', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Printable Statement Document */}
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {/* Statement Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={24} color="#1d4ed8" />
                <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  APEX DIGITAL BANK
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Branch: Bandra Kurla Complex, Mumbai • IFSC: APEX0001042
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Email: support@apexbank.com • 24x7 Helpline: 1800-202-0042
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase' }}>
                Official Account Statement
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Generated: {new Date().toLocaleDateString('en-IN')}
              </div>
            </div>
          </div>

          {/* Customer & Account Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px 0', fontSize: '0.82rem' }}>
            <div>
              <div style={{ color: 'var(--text-muted)' }}>Account Holder:</div>
              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem', marginTop: '2px' }}>
                {customer?.full_name || 'Pranita Sharma'}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>{customer?.email || 'pranita@apexbank.com'}</div>
              <div style={{ color: 'var(--text-secondary)' }}>{customer?.phone || '+91 98765 43210'}</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--text-muted)' }}>Account Number:</div>
              <div className="mono" style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem', marginTop: '2px' }}>
                {maskAccountNumber(account.account_number)}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>Account Type: {account.account_type.toUpperCase()}</div>
              <div style={{ color: '#059669', fontWeight: 800, fontSize: '0.95rem', marginTop: '2px' }}>
                Closing Balance: {formatCurrency(account.balance)}
              </div>
            </div>
          </div>

          {/* Statement Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', marginTop: '16px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-strong)' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 700 }}>Date</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 700 }}>Particulars / Description</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 700 }}>Category</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: 700 }}>Debit (₹)</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: 700 }}>Credit (₹)</th>
              </tr>
            </thead>
            <tbody>
              {accountTransactions.slice(0, 15).map((txn) => {
                const isCredit = txn.transaction_type === 'credit';
                return (
                  <tr key={txn.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>
                      {formatDateTime(txn.timestamp)}
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {txn.merchant || txn.beneficiary || txn.description}
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>
                      {txn.category}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: isCredit ? 'transparent' : '#dc2626', fontWeight: 600 }} className="mono">
                      {!isCredit ? formatCurrency(txn.amount) : '—'}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: isCredit ? '#059669' : 'transparent', fontWeight: 600 }} className="mono">
                      {isCredit ? formatCurrency(txn.amount) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Footer certification */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            <div>
              Computer-generated document. Does not require physical signature under IT Act 2000.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 600 }}>
              <Shield size={14} />
              <span>Verified Apex Core Banking Record</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
