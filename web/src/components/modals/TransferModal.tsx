import React, { useState } from 'react';
import {
  ArrowRightLeft,
  X,
  CheckCircle2,
  AlertCircle,
  Building2,
  Shield,
  Send,
} from 'lucide-react';
import { Account, TransferResponse } from '../../types/banking';
import { api } from '../../api/client';
import { formatCurrency, maskAccountNumber } from '../../utils/formatters';

interface TransferModalProps {
  isOpen: boolean;
  accounts: Account[];
  onClose: () => void;
  onSuccess: () => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  accounts,
  onClose,
  onSuccess,
}) => {
  const [sourceAccountId, setSourceAccountId] = useState<number>(
    accounts[0]?.id || 1
  );
  const [beneficiaryName, setBeneficiaryName] = useState('Rahul Sharma');
  const [beneficiaryAccount, setBeneficiaryAccount] = useState('987654321012');
  const [amount, setAmount] = useState('');
  const [remarks, setRemarks] = useState('Rent & Expenses');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [receipt, setReceipt] = useState<TransferResponse | null>(null);

  if (!isOpen) return null;

  const selectedAccount = accounts.find((a) => a.id === sourceAccountId) || accounts[0];

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setErrorMessage('Please enter a valid transfer amount.');
      return;
    }

    if (selectedAccount && amt > selectedAccount.balance) {
      setErrorMessage(`Insufficient funds. Account balance is ${formatCurrency(selectedAccount.balance)}.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.transferFunds({
        source_account_id: sourceAccountId,
        beneficiary_name: beneficiaryName,
        beneficiary_account: beneficiaryAccount,
        amount: amt,
        remarks: remarks || undefined,
      });

      setReceipt(res);
      onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Transfer failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setReceipt(null);
    setAmount('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(37, 99, 235, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ArrowRightLeft size={20} color="#38bdf8" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                Instant Fund Transfer
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Real-time IMPS / NEFT Transfer
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {receipt ? (
          /* Transfer Success Receipt */
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
            }}>
              <CheckCircle2 size={32} color="#10b981" />
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
              Transfer Successful!
            </h4>
            <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', margin: '8px 0' }}>
              {formatCurrency(receipt.amount)}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Successfully debited from your {selectedAccount?.account_type} account and credited to <strong>{receipt.beneficiary_name}</strong>.
            </p>

            <div style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '8px',
              padding: '14px',
              margin: '20px 0',
              textAlign: 'left',
              fontSize: '0.78rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Reference ID:</span>
                <span className="mono" style={{ color: '#fff', fontWeight: 600 }}>{receipt.reference_id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Updated Balance:</span>
                <span className="mono" style={{ color: '#38bdf8', fontWeight: 700 }}>
                  {formatCurrency(receipt.remaining_balance)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Mode:</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>IMPS Real-time</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Done
            </button>
          </div>
        ) : (
          /* Transfer Form */
          <form onSubmit={handleTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {errorMessage && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '10px 14px',
                borderRadius: '8px',
                color: '#f87171',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Debit From Account
              </label>
              <select
                value={sourceAccountId}
                onChange={(e) => setSourceAccountId(Number(e.target.value))}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id} style={{ background: '#0f172a', color: '#fff' }}>
                    {acc.account_type.toUpperCase()} ({maskAccountNumber(acc.account_number)}) - Balance: {formatCurrency(acc.balance)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Beneficiary Full Name
              </label>
              <input
                type="text"
                value={beneficiaryName}
                onChange={(e) => setBeneficiaryName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Beneficiary Account Number / UPI ID
              </label>
              <input
                type="text"
                value={beneficiaryAccount}
                onChange={(e) => setBeneficiaryAccount(e.target.value)}
                placeholder="e.g. 987654321012 or rahul@upi"
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Amount to Transfer (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 5000"
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '9px 12px',
                    color: '#fff',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Remarks
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Rent, Gift"
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '9px 12px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Quick Amount Chips */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              {[1000, 5000, 10000, 25000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(String(amt))}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '0.72rem',
                    color: '#cbd5e1',
                    cursor: 'pointer',
                  }}
                >
                  +{formatCurrency(amt, false)}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button
                type="button"
                onClick={handleClose}
                className="btn-secondary"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
              >
                <Send size={14} />
                <span>{submitting ? 'Transferring...' : 'Send Money'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
