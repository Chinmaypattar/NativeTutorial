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
      background: '#ffffff',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      flexShrink: 0,
      boxShadow: '1px 0 3px rgba(15, 23, 42, 0.02)',
    }}>
      <div>
        <div style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
          padding: '0 12px 14px',
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
                  border: isActive ? '1px solid rgba(29, 78, 216, 0.25)' : '1px solid transparent',
                  background: isActive ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                  color: isActive ? '#1d4ed8' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  width: '100%',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-card-hover)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <Icon size={18} color={isActive ? '#1d4ed8' : '#64748b'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* AI Copilot Sidecard */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)',
          border: '1px solid #bfdbfe',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={18} color="#1d4ed8" />
            <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1e3a8a' }}>AI Copilot Ready</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#334155', lineHeight: 1.4, marginBottom: '12px' }}>
            Ask natural queries about spend on Flipkart, account balances, loan affordability, or savings.
          </p>
          <button
            onClick={onOpenCopilot}
            style={{
              width: '100%',
              background: '#1d4ed8',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '9px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(29, 78, 216, 0.25)',
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
          background: '#f8fafc',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
        }}>
          <Lock size={12} color="#059669" />
          <span>256-Bit SSL Encrypted Banking</span>
        </div>
      </div>
    </aside>
  );
};
