import React from 'react';
import {
  Award,
  ShieldCheck,
  TrendingUp,
  Tag,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { FinancialWellnessScore, PersonalizedOffer } from '../../types/banking';

interface WellnessTabProps {
  wellness: FinancialWellnessScore | null;
  offers: PersonalizedOffer[];
  onAskCopilot: (query: string) => void;
}

export const WellnessTab: React.FC<WellnessTabProps> = ({ wellness, offers, onAskCopilot }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
            Financial Wellness & Personalized Intelligence
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Continuous 5-pillar credit scoring, wealth benchmarking, and tailored banking offers
          </p>
        </div>

        <button
          onClick={() => onAskCopilot('Calculate my financial health score and give me savings advice')}
          className="btn-primary"
        >
          <Sparkles size={16} />
          <span>Run Wellness Audit</span>
        </button>
      </div>

      {/* Wellness Score Big Display */}
      <div style={{
        background: 'linear-gradient(135deg, #0d3b66 0%, #0f172a 100%)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'conic-gradient(#10b981 0% 78%, rgba(255,255,255,0.1) 78% 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px',
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: '#0f172a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
                {wellness?.overall_score || 78}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>/ 100</span>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-success" style={{ fontSize: '0.85rem' }}>
                Grade {wellness?.grade || 'B+'} • Healthy
              </span>
              <span style={{ fontSize: '0.8rem', color: '#93c5fd' }}>Verified by Banking Engine</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
              Strong Financial Standing
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '440px' }}>
              Your low credit card utilization and consistent savings rate place you in the top 15% of peers.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ padding: '12px 18px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Savings Ratio</div>
            <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
              {((wellness?.savings_rate || 0.28) * 100).toFixed(0)}%
            </div>
          </div>
          <div style={{ padding: '12px 18px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Debt-to-Income</div>
            <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>
              {((wellness?.debt_to_income_ratio || 0.22) * 100).toFixed(0)}%
            </div>
          </div>
          <div style={{ padding: '12px 18px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Emergency Runway</div>
            <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>
              {(wellness?.emergency_fund_months || 4.2).toFixed(1)} Mo
            </div>
          </div>
        </div>
      </div>

      {/* 5 Pillars Breakdown & AI Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* 5 Pillars List */}
        <div className="bank-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
            5-Pillar Score Assessment
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(wellness?.pillars || [
              { name: 'Savings Rate', score: 16, max_score: 20, detail: '28% of monthly income saved into liquid accounts' },
              { name: 'Debt-to-Income (DTI)', score: 15, max_score: 20, detail: 'Monthly debt obligations are comfortably under 35%' },
              { name: 'Credit Card Utilization', score: 18, max_score: 20, detail: 'Utilization is 17.25%, well below the 30% warning ceiling' },
              { name: 'Emergency Runway', score: 14, max_score: 20, detail: '4.2 months of living expenses secured in savings' },
              { name: 'Investment Allocation', score: 15, max_score: 20, detail: 'Diversified across equity mutual funds and fixed deposits' },
            ]).map((p, idx) => (
              <div key={idx} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff' }}>{p.name}</span>
                  <span className="mono" style={{ fontWeight: 700, fontSize: '0.85rem', color: '#38bdf8' }}>
                    {p.score} / {p.max_score}
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', margin: '8px 0 6px' }}>
                  <div style={{ width: `${(p.score / p.max_score) * 100}%`, height: '100%', background: '#10b981', borderRadius: '3px' }} />
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {p.detail}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations Coaching */}
        <div className="bank-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Zap size={18} color="#f59e0b" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              Actionable Coaching Tips
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(wellness?.recommendations || [
              'Earmark an extra ₹5,000 monthly to extend emergency runway from 4.2 to 6 months.',
              'Consider paying off your credit card balance 3 days before statement close to boost CIBIL score to 800+.',
              'Start a SIP in an index fund to balance your fixed deposit allocation for inflation-beating growth.',
            ]).map((rec, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(245, 158, 11, 0.05)',
                  border: '1px solid rgba(245, 158, 11, 0.15)',
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f59e0b',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: '2px',
                }}>
                  {idx + 1}
                </div>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {rec}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personalized AI Offers Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tag size={20} color="#38bdf8" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
              Tailored Banking Offers for You
            </h2>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Based on your 785 credit score and spending patterns
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {offers.map((offer) => (
            <div key={offer.id} className="bank-card" style={{ background: 'linear-gradient(135deg, #1b263b, #0f172a)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="badge badge-success">
                  {offer.eligibility_status || 'Pre-Approved'}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
                  {offer.interest_rate_or_rewards}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginTop: '12px' }}>
                {offer.title}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                {offer.description}
              </p>

              {offer.benefits && offer.benefits.length > 0 && (
                <div style={{
                  marginTop: '16px',
                  padding: '10px 12px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  color: '#10b981',
                  fontWeight: 600,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}>
                  {offer.benefits.slice(0, 2).map((b, bIdx) => (
                    <div key={bIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>✨</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => alert(`Offer "${offer.title}" applied! Our banking team will notify you.`)}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '16px', fontSize: '0.8rem' }}
              >
                <span>Claim Offer</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
