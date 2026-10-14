import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingDown,
  ShoppingBag,
  Download,
  Calendar,
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
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>Transaction Ledger</h1>
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
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(15, 23, 42, 0.8))',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(37, 99, 235, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ShoppingBag size={24} color="#38bdf8" />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 600 }}>
                Merchant Spend Analytics
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
                {merchantStats.merchant}
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Spend</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }} className="mono">
                {formatCurrency(merchantStats.total)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Transactions</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }} className="mono">
                {merchantStats.count}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Average Ticket</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#94a3b8' }} className="mono">
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
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px 10px 38px',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Type Toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            {(['all', 'debit', 'credit'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: selectedType === t ? '#2563eb' : 'transparent',
                  color: selectedType === t ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
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
                border: selectedCategory === cat ? '1px solid #3b82f6' : '1px solid var(--border-subtle)',
                background: selectedCategory === cat ? 'rgba(37, 99, 235, 0.2)' : 'rgba(255,255,255,0.02)',
                color: selectedCategory === cat ? '#60a5fa' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
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
            <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Transaction & Merchant
              </th>
              <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Category
              </th>
              <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Date & Time
              </th>
              <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Type
              </th>
              <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>
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
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
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
                          background: isCredit ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {isCredit ? (
                            <ArrowDownLeft size={16} color="#10b981" />
                          ) : (
                            <ArrowUpRight size={16} color="#ef4444" />
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#fff' }}>
                            {txn.merchant || txn.beneficiary || txn.description}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {txn.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <span className="badge badge-info" style={{ textTransform: 'none' }}>
                        {txn.category}
                      </span>
                    </td>

                    <td style={{ padding: '16px 20px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {formatDateTime(txn.timestamp)}
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <span className={`badge ${isCredit ? 'badge-success' : 'badge-danger'}`}>
                        {txn.transaction_type}
                      </span>
                    </td>

                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <span
                        className="mono"
                        style={{
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          color: isCredit ? '#10b981' : '#f8fafc',
                        }}
                      >
                        {isCredit ? '+' : '-'}{formatCurrency(txn.amount)}
                      </span>
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
