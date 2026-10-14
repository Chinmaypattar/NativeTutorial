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

    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      setErrorMessage('Please enter a valid transfer amount.');
      return;
    }

    if (selectedAccount && transferAmount > selectedAccount.balance) {
      setErrorMessage(`Insufficient funds. Available balance is ${formatCurrency(selectedAccount.balance)}.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.transferFunds({
        source_account_id: sourceAccountId,
        beneficiary_name: beneficiaryName.trim(),
        beneficiary_account: beneficiaryAccount.trim(),
        amount: transferAmount,
        remarks: remarks.trim() || undefined,
      });

      setReceipt(res);
      onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Transfer failed. Please verify beneficiary details.');
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
      <div className="modal-content" style={{ maxWidth: '500px', padding: '32px', background: '#ffffff' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ArrowRightLeft size={18} color="#1d4ed8" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Domestic Fund Transfer
              </h3>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Instant 24x7 IMPS / NEFT Settlement
              </div>
            </div>
          </div>

          <button
            onClick={handleClose}
            style={{ background: '#f1f5f9', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '4px', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            <X size={18} />
          </button>
        </div>

        {receipt ? (
          /* Success Receipt View */
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
            }}>
              <CheckCircle2 size={32} color="#059669" />
            </div>

            <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Transfer Executed Successfully
            </div>
            <h4 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: '8px 0' }} className="mono">
              {formatCurrency(receipt.amount)}
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Successfully debited from your {selectedAccount?.account_type} account and credited to <strong>{receipt.beneficiary_name}</strong>.
            </p>

            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '14px',
              margin: '20px 0',
              textAlign: 'left',
              fontSize: '0.78rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Reference ID:</span>
                <span className="mono" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{receipt.reference_id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Updated Balance:</span>
                <span className="mono" style={{ color: '#1d4ed8', fontWeight: 700 }}>
                  {formatCurrency(receipt.remaining_balance)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Mode:</span>
                <span style={{ color: '#059669', fontWeight: 600 }}>IMPS Real-time</span>
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
                background: '#fef2f2',
                border: '1px solid #fecaca',
                padding: '10px 14px',
                borderRadius: '8px',
                color: '#dc2626',
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
                  background: '#ffffff',
                  border: '1px solid var(--border-strong)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
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
                  background: '#ffffff',
                  border: '1px solid var(--border-strong)',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Beneficiary Account Number / VPA
              </label>
              <input
                type="text"
                value={beneficiaryAccount}
                onChange={(e) => setBeneficiaryAccount(e.target.value)}
                placeholder="e.g. 987654321012"
                style={{
                  width: '100%',
                  background: '#ffffff',
                  border: '1px solid var(--border-strong)',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  color: 'var(--text-primary)',
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
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '9px', fontWeight: 700, color: '#1d4ed8' }}>₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="5000"
                    style={{
                      width: '100%',
                      background: '#ffffff',
                      border: '1px solid var(--border-strong)',
                      borderRadius: '8px',
                      padding: '9px 12px 9px 28px',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      outline: 'none',
                    }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Remarks
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Rent / Bills"
                  style={{
                    width: '100%',
                    background: '#ffffff',
                    border: '1px solid var(--border-strong)',
                    borderRadius: '8px',
                    padding: '9px 12px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.74rem',
              color: 'var(--text-muted)',
            }}>
              <Shield size={14} color="#059669" />
              <span>Funds are transferred securely via RBI-monitored IMPS switch.</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={handleClose}
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
                style={{ flex: 1.5, justifyContent: 'center' }}
              >
                {submitting ? 'Transferring...' : 'Authorize Transfer'}
                <Send size={15} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
