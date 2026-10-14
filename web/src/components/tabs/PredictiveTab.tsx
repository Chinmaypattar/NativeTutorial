import React, { useState } from 'react';
import {
  LineChart,
  Calculator,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import { AffordabilityResult, CashflowForecast } from '../../types/banking';
import { formatCurrency } from '../../utils/formatters';
import { api } from '../../api/client';

interface PredictiveTabProps {
  initialForecast: CashflowForecast | null;
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
  const [interestRate, setInterestRate] = useState('8.5');
  const [loadingAffordability, setLoadingAffordability] = useState(false);
  const [affordabilityResult, setAffordabilityResult] = useState<AffordabilityResult | null>(null);

  // Cashflow state
  const [forecast, setForecast] = useState<CashflowForecast | null>(initialForecast);
  const [forecastDays, setForecastDays] = useState(30);
  const [loadingForecast, setLoadingForecast] = useState(false);

  const handleEvaluateAffordability = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAffordability(true);
    try {
      const res = await api.checkAffordability({
        item_name: itemName,
        item_price: parseFloat(itemPrice),
        down_payment: downPayment ? parseFloat(downPayment) : undefined,
        loan_tenure_months: tenure ? parseInt(tenure) : undefined,
        estimated_interest_rate: interestRate ? parseFloat(interestRate) : undefined,
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
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
          Predictive Analytics & Financial Intelligence
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Run AI affordability stress tests on large capital outlays and simulate 30-day balance trajectories
        </p>
      </div>

      {/* Affordability Stress-Test Section */}
      <div className="bank-card" style={{ background: 'linear-gradient(135deg, #132238 0%, #0f172a 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calculator size={22} color="#38bdf8" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
              Capital Outlay Affordability Stress-Tester
            </h2>
          </div>
          <button
            onClick={() => onAskCopilot('Can I afford a new car for ₹8,00,000?')}
            className="btn-secondary"
            style={{ fontSize: '0.78rem' }}
          >
            <Sparkles size={14} color="#38bdf8" />
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
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: '#fff',
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
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: '#fff',
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
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: '#fff',
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
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: '#fff',
                fontSize: '0.875rem',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Interest Rate (% p.a.)
            </label>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: '#fff',
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
            background: 'rgba(0,0,0,0.3)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <span className={`badge ${
                  affordabilityResult.verdict === 'AFFORDABLE'
                    ? 'badge-success'
                    : affordabilityResult.verdict === 'STRETCH'
                    ? 'badge-warning'
                    : 'badge-danger'
                }`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                  {affordabilityResult.verdict === 'AFFORDABLE' && <CheckCircle2 size={16} />}
                  {affordabilityResult.verdict === 'STRETCH' && <AlertTriangle size={16} />}
                  {affordabilityResult.verdict}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginTop: '10px' }}>
                  {affordabilityResult.verdict_description}
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '24px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Monthly EMI</div>
                  <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8' }}>
                    {formatCurrency(affordabilityResult.estimated_monthly_emi)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Emergency Runway</div>
                  <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>
                    {affordabilityResult.emergency_fund_runway_months.toFixed(1)} Months
                  </div>
                </div>
              </div>
            </div>

            {/* Reasoning points */}
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                AI Financial Rationale:
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {affordabilityResult.reasoning.map((r, i) => (
                  <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }} />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 30-Day Cashflow Forecasting Section */}
      <div className="bank-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LineChart size={22} color="#10b981" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                30-Day Predictive Cashflow Forecast
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
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: forecastDays === d ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                  background: forecastDays === d ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
                  color: forecastDays === d ? '#10b981' : 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
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
          <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Starting Balance</div>
            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
              {formatCurrency(forecast?.starting_balance || 245680.5)}
            </div>
          </div>

          <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Lowest Projected Balance</div>
            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>
              {formatCurrency(forecast?.lowest_predicted_balance || 211180.5)}
            </div>
          </div>

          <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Ending Balance (Day {forecastDays})</div>
            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>
              {formatCurrency(forecast?.ending_balance || 325680.5)}
            </div>
          </div>

          <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Liquidity Risk Verdict</div>
            <span className="badge badge-success" style={{ marginTop: '4px' }}>
              {forecast?.risk_level || 'SAFE'} (No Deficit Expected)
            </span>
          </div>
        </div>

        {/* Projection Ledger Highlights */}
        <div style={{
          maxHeight: '260px',
          overflowY: 'auto',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(0,0,0,0.2)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '10px 16px', color: 'var(--text-muted)' }}>Date</th>
                <th style={{ padding: '10px 16px', color: 'var(--text-muted)' }}>Event / Obligation</th>
                <th style={{ padding: '10px 16px', color: 'var(--text-muted)', textAlign: 'right' }}>Projected Inflow</th>
                <th style={{ padding: '10px 16px', color: 'var(--text-muted)', textAlign: 'right' }}>Projected Outflow</th>
                <th style={{ padding: '10px 16px', color: 'var(--text-muted)', textAlign: 'right' }}>Ending Day Balance</th>
              </tr>
            </thead>
            <tbody>
              {forecast?.projection.map((day, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '10px 16px', color: '#fff' }}>{day.date}</td>
                  <td style={{ padding: '10px 16px' }}>
                    {day.event_note ? (
                      <span className="badge badge-info">{day.event_note}</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>Normal Operations</span>
                    )}
                  </td>
                  <td style={{ padding: '10px 16px', textAlign: 'right', color: '#10b981' }} className="mono">
                    {day.predicted_income > 0 ? `+${formatCurrency(day.predicted_income)}` : '—'}
                  </td>
                  <td style={{ padding: '10px 16px', textAlign: 'right', color: '#f87171' }} className="mono">
                    {day.predicted_expense > 0 ? `-${formatCurrency(day.predicted_expense)}` : '—'}
                  </td>
                  <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: '#fff' }} className="mono">
                    {formatCurrency(day.predicted_balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
