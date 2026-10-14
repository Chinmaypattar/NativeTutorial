import React, { useState } from 'react';
import {
  LineChart,
  Calculator,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { AffordabilityResult, CashflowForecastResponse } from '../../types/banking';
import { formatCurrency } from '../../utils/formatters';
import { api } from '../../api/client';

interface PredictiveTabProps {
  initialForecast: CashflowForecastResponse | null;
  onAskCopilot: (query: string) => void;
}

export const PredictiveTab: React.FC<PredictiveTabProps> = ({
  initialForecast,
  onAskCopilot,
}) => {
  // Affordability state
  const [itemName, setItemName] = useState('New Car');
  const [itemPrice, setItemPrice] = useState('800000');
  const [downPayment, setDownPayment] = useState('200000');
  const [tenure, setTenure] = useState('60');
  const [loadingAffordability, setLoadingAffordability] = useState(false);
  const [affordabilityResult, setAffordabilityResult] = useState<AffordabilityResult | null>(null);

  // Cashflow state
  const [forecast, setForecast] = useState<CashflowForecastResponse | null>(initialForecast);
  const [forecastDays, setForecastDays] = useState(30);
  const [loadingForecast, setLoadingForecast] = useState(false);

  const handleEvaluateAffordability = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAffordability(true);
    try {
      const res = await api.checkAffordability({
        item_name: itemName,
        total_cost: parseFloat(itemPrice),
        down_payment: downPayment ? parseFloat(downPayment) : 0,
        loan_tenure_months: tenure ? parseInt(tenure, 10) : 60,
      });
      setAffordabilityResult(res);
    } catch (err: any) {
      alert(err.message || 'Failed to calculate affordability.');
    } finally {
      setLoadingAffordability(false);
    }
  };

  const handleRefreshForecast = async (days: number) => {
    setForecastDays(days);
    setLoadingForecast(true);
    try {
      const res = await api.getCashflowForecast(days);
      setForecast(res);
    } catch (err: any) {
      alert(err.message || 'Failed to fetch cashflow forecast.');
    } finally {
      setLoadingForecast(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Page Title */}
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Predictive Analytics & Financial Intelligence
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Run AI affordability stress tests on large capital outlays and simulate 30-day balance trajectories
        </p>
      </div>

      {/* Affordability Stress-Test Section */}
      <div className="bank-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calculator size={22} color="#1d4ed8" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Capital Outlay Affordability Stress-Tester
            </h2>
          </div>
          <button
            onClick={() => onAskCopilot('Can I afford a new car for ₹8,00,000?')}
            className="btn-secondary"
            style={{ fontSize: '0.8rem' }}
          >
            <Sparkles size={14} color="#1d4ed8" />
            <span>Ask Copilot via Chat</span>
          </button>
        </div>

        <form onSubmit={handleEvaluateAffordability} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Asset / Item Name
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              style={{
                width: '100%',
                background: '#ffffff',
                border: '1px solid var(--border-strong)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Total Price (₹)
            </label>
            <input
              type="number"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              style={{
                width: '100%',
                background: '#ffffff',
                border: '1px solid var(--border-strong)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Down Payment (₹)
            </label>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              style={{
                width: '100%',
                background: '#ffffff',
                border: '1px solid var(--border-strong)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Loan Tenure (Months)
            </label>
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              style={{
                width: '100%',
                background: '#ffffff',
                border: '1px solid var(--border-strong)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
              }}
            />
          </div>

          <div>
            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={loadingAffordability}
            >
              {loadingAffordability ? 'Calculating...' : 'Evaluate'}
            </button>
          </div>
        </form>

        {/* Affordability Result View */}
        {affordabilityResult && (
          <div style={{
            marginTop: '24px',
            padding: '24px',
            background: '#f8fafc',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <span className={`badge ${
                  affordabilityResult.verdict === 'AFFORDABLE'
                    ? 'badge-success'
                    : affordabilityResult.verdict === 'CAUTION_STRETCH' || affordabilityResult.verdict === 'STRETCH'
                    ? 'badge-warning'
                    : 'badge-danger'
                }`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                  {affordabilityResult.is_affordable ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                  {affordabilityResult.verdict.replace('_', ' ')}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '10px' }}>
                  {affordabilityResult.is_affordable
                    ? 'Capital Outlay is Financially Viable'
                    : 'High Financial Stress or Infeasible Risk Detected'}
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '24px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Monthly Impact</div>
                  <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1d4ed8' }}>
                    {formatCurrency(affordabilityResult.monthly_impact)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Emergency Runway</div>
                  <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669' }}>
                    {affordabilityResult.emergency_fund_buffer_months.toFixed(1)} Months
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Projected DTI</div>
                  <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: affordabilityResult.projected_debt_to_income > 45 ? '#dc2626' : '#1d4ed8' }}>
                    {affordabilityResult.projected_debt_to_income.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Details */}
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 700 }}>
                AI Financial Rationale:
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {affordabilityResult.analysis_details.map((r, i) => (
                  <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1d4ed8' }} />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>

              {affordabilityResult.suggested_alternative && (
                <div style={{ marginTop: '12px', padding: '12px 14px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '0.85rem', color: '#1e40af' }}>
                  <strong>Alternative Recommendation:</strong> {affordabilityResult.suggested_alternative}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 30-Day Cashflow Forecasting Section */}
      <div className="bank-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LineChart size={22} color="#059669" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {forecastDays}-Day Predictive Cashflow Forecast
              </h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Simulates daily balances factoring upcoming bill dates, loan EMIs, and monthly salary inflow
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {[15, 30, 45].map((d) => (
              <button
                key={d}
                onClick={() => handleRefreshForecast(d)}
                disabled={loadingForecast}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: forecastDays === d ? '1px solid #059669' : '1px solid var(--border-strong)',
                  background: forecastDays === d ? '#ecfdf5' : '#ffffff',
                  color: forecastDays === d ? '#047857' : 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {d} Days
              </button>
            ))}
          </div>
        </div>

        {/* Summary metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Starting Liquid Balance</div>
            <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {formatCurrency(forecast?.current_liquid_balance || 0)}
            </div>
          </div>

          <div style={{ padding: '16px', background: '#fffbeb', borderRadius: '10px', border: '1px solid #fde68a' }}>
            <div style={{ fontSize: '0.72rem', color: '#b45309' }}>Lowest Projected Balance</div>
            <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#d97706' }}>
              {formatCurrency(forecast?.lowest_projected_balance || 0)}
            </div>
          </div>

          <div style={{ padding: '16px', background: '#ecfdf5', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
            <div style={{ fontSize: '0.72rem', color: '#047857' }}>Projected Ending Balance</div>
            <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#059669' }}>
              {formatCurrency(forecast?.projected_end_balance || 0)}
            </div>
          </div>

          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Liquidity Risk Verdict</div>
            <span className={`badge ${forecast?.run_out_of_money_risk ? 'badge-danger' : 'badge-success'}`} style={{ marginTop: '6px' }}>
              {forecast?.risk_level ? `${forecast.risk_level.toUpperCase()} RISK` : 'LOW RISK'}
            </span>
          </div>
        </div>

        {/* Projection Ledger Highlights */}
        <div style={{
          maxHeight: '280px',
          overflowY: 'auto',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-md)',
          background: '#ffffff',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-strong)' }}>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', textAlign: 'left', fontWeight: 700 }}>Date</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', textAlign: 'left', fontWeight: 700 }}>Event / Obligation</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', textAlign: 'right', fontWeight: 700 }}>Projected Inflow</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', textAlign: 'right', fontWeight: 700 }}>Projected Outflow</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', textAlign: 'right', fontWeight: 700 }}>Ending Day Balance</th>
              </tr>
            </thead>
            <tbody>
              {forecast?.timeline && forecast.timeline.length > 0 ? (
                forecast.timeline.map((day, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '10px 16px', color: 'var(--text-primary)', fontWeight: 500 }}>{String(day.date)}</td>
                    <td style={{ padding: '10px 16px' }}>
                      {day.event_description ? (
                        <span className="badge badge-info">{day.event_description}</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Normal Operations</span>
                      )}
                    </td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', color: '#059669', fontWeight: 600 }} className="mono">
                      {day.inflows > 0 ? `+${formatCurrency(day.inflows)}` : '—'}
                    </td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', color: '#dc2626', fontWeight: 600 }} className="mono">
                      {day.outflows > 0 ? `-${formatCurrency(day.outflows)}` : '—'}
                    </td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)' }} className="mono">
                      {formatCurrency(day.projected_balance)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    No forecast data available. Click on one of the timeframe buttons above to generate a projection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
