import React from 'react';
import {
  TrendingUp,
  PieChart,
  ArrowUpRight,
  ShieldAlert,
  Coins,
  CheckCircle2,
} from 'lucide-react';
import { Investment } from '../../types/banking';
import { formatCurrency } from '../../utils/formatters';

interface InvestmentsTabProps {
  investments: Investment[];
  onAskCopilot: (query: string) => void;
}

export const InvestmentsTab: React.FC<InvestmentsTabProps> = ({ investments, onAskCopilot }) => {
  const totalInvested = investments.reduce((sum, inv) => sum + inv.invested_amount, 0);
  const totalCurrent = investments.reduce((sum, inv) => sum + inv.current_value, 0);
  const totalReturn = totalCurrent - totalInvested;
  const overallReturnPercent = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Title & Valuation Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>Wealth & Investment Portfolio</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Track multi-asset returns across Mutual Funds, Equities, and Fixed Deposits
          </p>
        </div>

        <button
          onClick={() => onAskCopilot('How is my investment portfolio performing?')}
          className="btn-primary"
        >
          <span>Portfolio Analysis with AI</span>
        </button>
      </div>

      {/* Highlights Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        <div className="bank-card">
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Portfolio Valuation</div>
          <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {formatCurrency(totalCurrent)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Invested Base: {formatCurrency(totalInvested)}
          </div>
        </div>

        <div className="bank-card">
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Unrealized Gain / Return</div>
          <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
            +{formatCurrency(totalReturn)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginTop: '4px' }}>
            <ArrowUpRight size={14} />
            <span>+{overallReturnPercent.toFixed(2)}% Overall ROI</span>
          </div>
        </div>

        <div className="bank-card">
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Asset Diversity</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1d4ed8', marginTop: '4px' }}>
            {investments.length} Assets
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Across 3 Asset Classes
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bank-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Asset Holdings Breakdown</h2>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Asset Name
              </th>
              <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Type
              </th>
              <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Invested Amount
              </th>
              <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Current Valuation
              </th>
              <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>
                Gain / Return
              </th>
            </tr>
          </thead>
          <tbody>
            {investments.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No active investments found. Use AI Copilot or explore mutual funds and fixed deposit opportunities.
                </td>
              </tr>
            ) : (
              investments.map((inv) => {
                const gain = inv.current_value - inv.invested_amount;
                return (
                  <tr
                    key={inv.id}
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-muted)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        {inv.name}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>
                        {inv.asset_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '0.9rem', color: 'var(--text-secondary)' }} className="mono">
                      {formatCurrency(inv.invested_amount)}
                    </td>
                    <td style={{ padding: '16px 20px', fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700 }} className="mono">
                      {formatCurrency(inv.current_value)}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div className="mono" style={{ fontWeight: 700, fontSize: '0.9rem', color: '#059669' }}>
                        +{formatCurrency(gain)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                        +{inv.returns_percentage}%
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
