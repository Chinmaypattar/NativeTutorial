import React, { useState } from 'react';
import {
  CreditCard,
  Zap,
  Smartphone,
  Wifi,
  Droplet,
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
    Broadband: ['Airtel Xstream Fiber', 'JioFiber Gigabit', 'ACT Fibernet'],
    Water: ['Municipal Corporation of Greater Mumbai (MCGM)', 'BWSSB Bangalore'],
    'Credit Card': ['Apex Platinum Card Statement Bill'],
  };

  const handleCategoryChange = (cat: string) => {
    setBillCategory(cat);
    const list = billersByCategory[cat] || ['Other Biller'];
    setBillerName(list[0]);
    if (cat === 'Mobile') setConsumerNumber('9876543210');
    else if (cat === 'Broadband') setConsumerNumber('022-892182');
    else if (cat === 'Credit Card') setConsumerNumber('4589');
    else setConsumerNumber('100293847');
  };

  const selectedAccount = accounts.find((a) => a.id === sourceAccountId) || accounts[0];

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setErrorMessage('Please enter a valid bill amount.');
      return;
    }

    if (selectedAccount && amt > selectedAccount.balance) {
      setErrorMessage(`Insufficient funds. Account balance is ${formatCurrency(selectedAccount.balance)}.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.payBill({
        account_id: sourceAccountId,
        biller_name: billerName,
        bill_category: billCategory,
        consumer_number: consumerNumber,
        amount: amt,
      });

      setReceipt(res);
      onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Bill payment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setReceipt(null);
    setAmount('2400');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Receipt size={20} color="#f59e0b" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                Utility Bill Payment
              </h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Bharat BillPay (BBPS) Direct Settlement
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
              Bill Payment Settled!
            </h4>
            <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', margin: '8px 0' }}>
              {formatCurrency(receipt.amount)}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Paid to <strong>{receipt.biller_name}</strong> for consumer reference #{receipt.consumer_number}.
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
                <span style={{ color: 'var(--text-muted)' }}>Transaction Reference:</span>
                <span className="mono" style={{ color: '#fff', fontWeight: 600 }}>{receipt.reference_id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Debited Account:</span>
                <span style={{ color: '#fff' }}>{selectedAccount?.account_type.toUpperCase()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>New Account Balance:</span>
                <span className="mono" style={{ color: '#38bdf8', fontWeight: 700 }}>
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
                        padding: '8px 4px',
                        background: isSel ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.04)',
                        border: isSel ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: isSel ? '#f59e0b' : 'var(--text-secondary)',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
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
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              >
                {(billersByCategory[billCategory] || []).map((b) => (
                  <option key={b} value={b} style={{ background: '#0f172a', color: '#fff' }}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Consumer / Account / Card Reference Number
              </label>
              <input
                type="text"
                value={consumerNumber}
                onChange={(e) => setConsumerNumber(e.target.value)}
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
                  Pay From Account
                </label>
                <select
                  value={sourceAccountId}
                  onChange={(e) => setSourceAccountId(Number(e.target.value))}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '9px 12px',
                    color: '#fff',
                    fontSize: '0.82rem',
                    outline: 'none',
                  }}
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id} style={{ background: '#0f172a', color: '#fff' }}>
                      {acc.account_type.toUpperCase()} ({formatCurrency(acc.balance, false)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Bill Amount (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
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
                <span>{submitting ? 'Processing Payment...' : 'Pay Bill'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
