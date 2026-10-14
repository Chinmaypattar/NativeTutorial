import React from 'react';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  CreditCard,
  Target,
  TrendingUp,
  LineChart,
  Award,
  Sparkles,
  Lock,
} from 'lucide-react';

export type TabKey =
  | 'overview'
  | 'accounts'
  | 'transactions'
  | 'cards_loans'
  | 'savings'
  | 'investments'
  | 'predictive'
  | 'wellness';

interface SidebarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  onOpenCopilot: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, onOpenCopilot }) => {
  const menuItems = [
    { key: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { key: 'accounts', label: 'Accounts & Balances', icon: Wallet },
    { key: 'transactions', label: 'Transactions & Spend', icon: ArrowLeftRight },
    { key: 'cards_loans', label: 'Credit Cards & Loans', icon: CreditCard },
    { key: 'savings', label: 'Savings Goals', icon: Target },
    { key: 'investments', label: 'Investments & Wealth', icon: TrendingUp },
    { key: 'predictive', label: 'Affordability & Forecast', icon: LineChart },
    { key: 'wellness', label: 'Financial Health & Offers', icon: Award },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      flexShrink: 0,
    }}>
      <div>
        <div style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
          padding: '0 12px 12px',
        }}>
          Online Banking Portal
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onSelectTab(item.key as TabKey)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: isActive ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                  background: isActive ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                  color: isActive ? '#60a5fa' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <Icon size={18} color={isActive ? '#3b82f6' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* AI Copilot Sidecard */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(30, 58, 138, 0.3))',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={18} color="#38bdf8" />
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>AI Copilot Ready</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '12px' }}>
            Ask natural questions about spending, balances, loan affordability, or savings goals.
          </p>
          <button
            onClick={onOpenCopilot}
            style={{
              width: '100%',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={14} />
            <span>Open Assistant</span>
          </button>
        </div>

        {/* Security Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: 'rgba(15, 23, 42, 0.5)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
        }}>
          <Lock size={12} color="#10b981" />
          <span>256-Bit SSL Encrypted Banking</span>
        </div>
      </div>
    </aside>
  );
};
