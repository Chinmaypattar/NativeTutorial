import React, { useState } from 'react';
import {
  Target,
  Plus,
  Calendar,
  PiggyBank,
  Sparkles,
  X,
  AlertCircle,
} from 'lucide-react';
import { SavingsBucket } from '../../types/banking';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { api } from '../../api/client';

interface SavingsGoalsTabProps {
  buckets: SavingsBucket[];
  onRefreshBuckets: () => void;
  onAskCopilot: (query: string) => void;
}

export const SavingsGoalsTab: React.FC<SavingsGoalsTabProps> = ({
  buckets,
  onRefreshBuckets,
  onAskCopilot,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCreateBucket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !targetDate) {
      setErrorMsg('Please enter a goal name, target amount, and target date.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await api.createSavingsBucket({
        name,
        target_amount: parseFloat(targetAmount),
        target_date: targetDate,
        monthly_contribution: monthlyContribution ? parseFloat(monthlyContribution) : undefined,
      });

      setIsModalOpen(false);
      setName('');
      setTargetAmount('');
      setTargetDate('');
      setMonthlyContribution('');
      onRefreshBuckets();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create savings bucket.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header & Create Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>Savings Buckets & Goals</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Earmark funds for future dreams, vacation plans, and contingency reserves
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => onAskCopilot('Create a vacation bucket for ₹1,50,000 by December 2026')}
            className="btn-secondary"
            style={{ fontSize: '0.85rem' }}
          >
            <Sparkles size={16} color="#1d4ed8" />
            <span>Create via AI Chat</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            <Plus size={16} />
            <span>Create New Bucket</span>
          </button>
        </div>
      </div>

      {/* Buckets Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {buckets.map((b) => {
          const percent = Math.min(100, Math.round((b.current_amount / b.target_amount) * 100));
          return (
            <div
              key={b.id}
              className="bank-card"
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <PiggyBank size={22} color="#1d4ed8" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {b.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      <Calendar size={12} />
                      <span>Target: {formatDate(b.target_date)}</span>
                    </div>
                  </div>
                </div>

                <span className="badge badge-info mono">{percent}%</span>
              </div>

              {/* Progress bar */}
              <div style={{ margin: '24px 0 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Saved Progress:</span>
                  <span className="mono" style={{ color: 'var(--text-primary)', fontWeight: 800 }}>
                    {formatCurrency(b.current_amount)} / {formatCurrency(b.target_amount)}
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${percent}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #1d4ed8, #0284c7)',
                      borderRadius: '4px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>

              {/* Monthly Contribution info */}
              <div style={{
                background: '#f8fafc',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid var(--border-subtle)',
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Monthly Savings Required</div>
                  <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669' }}>
                    {formatCurrency(b.monthly_contribution || 0)} / mo
                  </div>
                </div>
                <button
                  onClick={() => alert(`Simulated recurring deposit added for ${b.name}`)}
                  className="btn-secondary"
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                  }}
                >
                  Deposit Funds
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create New Bucket */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ background: '#ffffff', maxWidth: '480px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Target size={22} color="#1d4ed8" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Create Savings Bucket</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: '#f1f5f9', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '4px', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {errorMsg && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                padding: '10px 14px',
                borderRadius: '8px',
                color: '#dc2626',
                fontSize: '0.82rem',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateBucket} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Goal Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bali Vacation, MacBook Pro, Emergency Fund"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Target Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="150000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
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
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Target Date
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
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
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Monthly Contribution (Optional)
                </label>
                <input
                  type="number"
                  placeholder="Auto-calculated if left blank"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
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
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
                style={{ width: '100%', justifyContent: 'center', marginTop: '8px', padding: '12px' }}
              >
                {submitting ? 'Creating Goal...' : 'Establish Savings Bucket'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
