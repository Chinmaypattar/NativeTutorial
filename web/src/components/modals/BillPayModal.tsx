import React, { useState } from 'react';
import {
  CreditCard,
  Zap,
  Smartphone,
  Wifi,
  X,
  CheckCircle2,
  AlertCircle,
  Receipt,
} from 'lucide-react';
import { Account, BillPayResponse } from '../../types/banking';
import { api } from '../../api/client';
import { formatCurrency, maskAccountNumber } from '../../utils/formatters';

interface BillPayModalProps {
  isOpen: boolean;
  accounts: Account[];
  onClose: () => void;
  onSuccess: () => void;
}

export const BillPayModal: React.FC<BillPayModalProps> = ({
  isOpen,
  accounts,
  onClose,
  onSuccess,
}) => {
  const [sourceAccountId, setSourceAccountId] = useState<number>(
    accounts[0]?.id || 1
  );
  const [billCategory, setBillCategory] = useState('Electricity');
  const [billerName, setBillerName] = useState('Adani Electricity');
  const [consumerNumber, setConsumerNumber] = useState('100293847');
  const [amount, setAmount] = useState('2400');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [receipt, setReceipt] = useState<BillPayResponse | null>(null);

  if (!isOpen) return null;

  const billersByCategory: Record<string, string[]> = {
    Electricity: ['Adani Electricity', 'Tata Power Mumbai', 'BESCOM Bangalore', 'BSES Rajdhani Delhi'],
    Mobile: ['Jio Prepaid', 'Airtel Postpaid', 'Vodafone Idea (Vi)'],
    Broadband: ['ACT Fibernet', 'Airtel Xstream Fiber', 'JioFiber', 'Tata Play Fiber'],
    'Credit Card': ['Apex Millennia Card Bill', 'Apex Platinum Card Bill', 'HDFC Bank Card', 'ICICI Bank Card'],
  };

  const handleCategoryChange = (category: string) => {
    setBillCategory(category);
    const available = billersByCategory[category] || [];
    if (available.length > 0) {
      setBillerName(available[0]);
    }
  };

  const selectedAccount = accounts.find((a) => a.id === sourceAccountId) || accounts[0];

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const payAmount = parseFloat(amount);
    if (isNaN(payAmount) || payAmount <= 0) {
      setErrorMessage('Please enter a valid bill payment amount.');
      return;
    }

    if (selectedAccount && payAmount > selectedAccount.balance) {
      setErrorMessage(`Insufficient funds. Your available balance is ${formatCurrency(selectedAccount.balance)}.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.payBill({
        account_id: sourceAccountId,
        biller_name: billerName,
        bill_category: billCategory,
        consumer_number: consumerNumber.trim(),
        amount: payAmount,
      });

      setReceipt(res);
      onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Bill payment failed. Please verify consumer details.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setReceipt(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px', padding: '32px', background: '#ffffff' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#fffbeb',
              border: '1px solid #fde68a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Receipt size={18} color="#d97706" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Bharat BillPay (BBPS)
              </h3>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Instant Utility & Card Bill Settlement
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
          /* Receipt View */
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
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Bill Payment Settled!
            </h4>
            <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', margin: '8px 0' }}>
              {formatCurrency(receipt.amount)}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Paid to <strong>{receipt.biller_name}</strong> for consumer reference #{receipt.consumer_number}.
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
                <span style={{ color: 'var(--text-muted)' }}>Transaction Reference:</span>
                <span className="mono" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{receipt.reference_id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Debited Account:</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedAccount?.account_type.toUpperCase()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>New Account Balance:</span>
                <span className="mono" style={{ color: '#1d4ed8', fontWeight: 700 }}>
                  {formatCurrency(receipt.remaining_balance)}
                </span>
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
          <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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

            {/* Bill Category selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Select Biller Category
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {[
                  { cat: 'Electricity', icon: Zap },
                  { cat: 'Mobile', icon: Smartphone },
                  { cat: 'Broadband', icon: Wifi },
                  { cat: 'Credit Card', icon: CreditCard },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSel = billCategory === item.cat;
                  return (
                    <button
                      key={item.cat}
                      type="button"
                      onClick={() => handleCategoryChange(item.cat)}
                      style={{
                        padding: '10px 4px',
                        background: isSel ? '#fffbeb' : '#f8fafc',
                        border: isSel ? '1px solid #d97706' : '1px solid #e2e8f0',
                        borderRadius: '8px',
                        color: isSel ? '#b45309' : 'var(--text-secondary)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Icon size={16} />
                      <span>{item.cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Biller Provider
              </label>
              <select
                value={billerName}
                onChange={(e) => setBillerName(e.target.value)}
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
              >
                {(billersByCategory[billCategory] || []).map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Consumer No. / Account ID
                </label>
                <input
                  type="text"
                  value={consumerNumber}
                  onChange={(e) => setConsumerNumber(e.target.value)}
                  placeholder="e.g. 100293847"
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
                  Bill Amount (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="2400"
                  style={{
                    width: '100%',
                    background: '#ffffff',
                    border: '1px solid var(--border-strong)',
                    borderRadius: '8px',
                    padding: '9px 12px',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    outline: 'none',
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Pay From Account
              </label>
              <select
                value={sourceAccountId}
                onChange={(e) => setSourceAccountId(Number(e.target.value))}
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
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.account_type.toUpperCase()} ({maskAccountNumber(acc.account_number)}) - Balance: {formatCurrency(acc.balance)}
                  </option>
                ))}
              </select>
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
                {submitting ? 'Settling...' : 'Pay Bill Instantly'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
