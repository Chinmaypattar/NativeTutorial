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
      <div className="modal-content" style={{ maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto', padding: '36px' }}>
        {/* Actions Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handlePrint} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
              <Printer size={14} />
              <span>Print Statement</span>
            </button>
            <button
              onClick={() => alert('Account statement PDF downloaded to your Downloads folder.')}
              className="btn-primary"
              style={{ padding: '6px 12px', fontSize: '0.78rem' }}
            >
              <Download size={14} />
              <span>Download PDF</span>
            </button>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Printable Statement Document */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
        }}>
          {/* Statement Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={24} color="#38bdf8" />
                <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#fff' }}>APEX DIGITAL BANK</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Branch: Bandra Kurla Complex, Mumbai • IFSC: APEX0001042
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Email: support@apexbank.com • 24x7 Helpline: 1800-202-0042
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
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
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                {customer?.full_name || 'Pranita Sharma'}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>{customer?.email}</div>
              <div style={{ color: 'var(--text-secondary)' }}>{customer?.phone}</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--text-muted)' }}>Account Number:</div>
              <div className="mono" style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                {maskAccountNumber(account.account_number)}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>Account Type: {account.account_type.toUpperCase()}</div>
              <div style={{ color: '#10b981', fontWeight: 700 }}>
                Closing Balance: {formatCurrency(account.balance)}
              </div>
            </div>
          </div>

          {/* Statement Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', marginTop: '16px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-muted)' }}>Date</th>
                <th style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-muted)' }}>Particulars / Description</th>
                <th style={{ padding: '8px 10px', textAlign: 'left', color: 'var(--text-muted)' }}>Category</th>
                <th style={{ padding: '8px 10px', textAlign: 'right', color: 'var(--text-muted)' }}>Debit (₹)</th>
                <th style={{ padding: '8px 10px', textAlign: 'right', color: 'var(--text-muted)' }}>Credit (₹)</th>
              </tr>
            </thead>
            <tbody>
              {accountTransactions.slice(0, 15).map((txn) => {
                const isCredit = txn.transaction_type === 'credit';
                return (
                  <tr key={txn.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '8px 10px', color: 'var(--text-secondary)' }}>
                      {formatDateTime(txn.timestamp)}
                    </td>
                    <td style={{ padding: '8px 10px', color: '#fff' }}>
                      {txn.merchant || txn.beneficiary || txn.description}
                    </td>
                    <td style={{ padding: '8px 10px', color: 'var(--text-muted)' }}>
                      {txn.category}
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', color: isCredit ? 'transparent' : '#f87171' }} className="mono">
                      {!isCredit ? formatCurrency(txn.amount) : '—'}
                    </td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', color: isCredit ? '#10b981' : 'transparent' }} className="mono">
                      {isCredit ? formatCurrency(txn.amount) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Statement Footer */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span>This is a computer-generated statement and does not require a physical signature.</span>
            <span>Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
