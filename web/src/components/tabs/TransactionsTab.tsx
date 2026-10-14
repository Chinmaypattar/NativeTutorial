import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingBag,
} from 'lucide-react';
import { Transaction } from '../../types/banking';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

interface TransactionsTabProps {
  transactions: Transaction[];
  onAskCopilot: (query: string) => void;
}

export const TransactionsTab: React.FC<TransactionsTabProps> = ({ transactions, onAskCopilot }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const categories = ['all', 'Shopping', 'Food & Dining', 'Travel', 'Bills & Utilities', 'Entertainment', 'Salary'];

  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      const matchSearch =
        searchTerm === '' ||
        (txn.merchant && txn.merchant.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (txn.beneficiary && txn.beneficiary.toLowerCase().includes(searchTerm.toLowerCase())) ||
        txn.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategory === 'all' ||
        txn.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchType =
        selectedType === 'all' || txn.transaction_type === selectedType;

      return matchSearch && matchCategory && matchType;
    });
  }, [transactions, searchTerm, selectedCategory, selectedType]);

  // If a merchant search is active, compute quick merchant stats
  const merchantStats = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const matches = transactions.filter(
      (t) => t.merchant && t.merchant.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
    if (matches.length === 0) return null;

    const total = matches.reduce((sum, t) => sum + t.amount, 0);
    return {
      merchant: matches[0].merchant,
      count: matches.length,
      total,
      average: total / matches.length,
    };
  }, [transactions, searchTerm]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Title & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>Transaction Ledger</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Search, filter, and audit all incoming and outgoing cashflows
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => onAskCopilot('How much did I spend on Flipkart this year?')}
            className="btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            <span>Ask Copilot about Spend</span>
          </button>
        </div>
      </div>

      {/* Merchant Intelligence Card (shown when user searches a merchant) */}
      {merchantStats && (
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#ffffff',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.15)',
            }}>
              <ShoppingBag size={24} color="#1d4ed8" />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#1e40af', textTransform: 'uppercase', fontWeight: 700 }}>
                Merchant Spend Intelligence
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e3a8a' }}>
                {merchantStats.merchant}
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Spend</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e3a8a' }} className="mono">
                {formatCurrency(merchantStats.total)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Transactions</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1d4ed8' }} className="mono">
                {merchantStats.count}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Average Ticket</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }} className="mono">
                {formatCurrency(merchantStats.average)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bank-card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Input */}
          <div style={{
            position: 'relative',
            flex: '1 1 280px',
            maxWidth: '420px',
          }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              placeholder="Search by merchant (e.g. Flipkart, Zomato, Swiggy)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                background: '#f8fafc',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px 10px 38px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Type Toggle */}
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            {(['all', 'debit', 'credit'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: selectedType === t ? '#1d4ed8' : 'transparent',
                  color: selectedType === t ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.15s ease',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginTop: '16px', paddingBottom: '4px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '5px 12px',
                borderRadius: '9999px',
                border: selectedCategory === cat ? '1px solid #1d4ed8' : '1px solid var(--border-strong)',
                background: selectedCategory === cat ? '#eff6ff' : '#ffffff',
                color: selectedCategory === cat ? '#1d4ed8' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bank-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-strong)' }}>
              <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Transaction & Merchant
              </th>
              <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Category
              </th>
              <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Date & Time
              </th>
              <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Type
              </th>
              <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', textAlign: 'right' }}>
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No transactions match your current filters.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((txn) => {
                const isCredit = txn.transaction_type === 'credit';
                return (
                  <tr
                    key={txn.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <td style={{ padding: '16px 20px' }}>
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
                          flexShrink: 0,
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
                          {txn.merchant && txn.description && txn.description !== txn.merchant && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {txn.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                        {txn.category}
                      </span>
                    </td>

                    <td style={{ padding: '16px 20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {formatDateTime(txn.timestamp)}
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <span className={`badge ${isCredit ? 'badge-success' : 'badge-danger'}`}>
                        {txn.transaction_type}
                      </span>
                    </td>

                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
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
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
