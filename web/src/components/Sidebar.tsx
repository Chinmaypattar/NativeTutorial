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
  X,
  Shield,
  ArrowRightLeft,
  Receipt,
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
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenTransfer?: () => void;
  onOpenBillPay?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenCopilot,
  isMobileOpen = false,
  onCloseMobile,
  onOpenTransfer,
  onOpenBillPay,
}) => {
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

  const renderNavItems = (isMobile = false) => (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.key;
        return (
          <button
            key={item.key}
            onClick={() => {
              onSelectTab(item.key as TabKey);
              if (isMobile && onCloseMobile) {
                onCloseMobile();
              }
            }}
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
          >
            <Icon size={18} color={isActive ? '#1d4ed8' : '#64748b'} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className="sidebar-desktop"
        style={{
          width: '260px',
          background: '#ffffff',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 16px',
          flexShrink: 0,
          boxShadow: '1px 0 3px rgba(15, 23, 42, 0.02)',
          height: '100%',
          overflowY: 'auto',
        }}
      >
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
          {renderNavItems(false)}
        </div>

        {/* AI Copilot Teaser & Security Badge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '24px' }}>
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
              Ask natural queries about spend on Flipkart, balances, loan affordability, or savings.
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

      {/* Mobile Slide-Over Drawer with Backdrop */}
      {isMobileOpen && (
        <div className="sidebar-mobile" style={{ position: 'fixed', inset: 0, zIndex: 300 }}>
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.5)',
              backdropFilter: 'blur(4px)',
              animation: 'fadeIn 0.2s ease-out',
            }}
          />

          {/* Slide-out Drawer Panel */}
          <aside
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: '290px',
              maxWidth: '85vw',
              background: '#ffffff',
              boxShadow: '4px 0 25px rgba(15, 23, 42, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '20px 16px',
              zIndex: 310,
              overflowY: 'auto',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            <div>
              {/* Drawer Top Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '16px',
                marginBottom: '16px',
                borderBottom: '1px solid var(--border-subtle)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Shield size={18} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>APEX</div>
                    <div style={{ fontSize: '0.7rem', color: '#1d4ed8', fontWeight: 700, textTransform: 'uppercase' }}>
                      Digital Bank
                    </div>
                  </div>
                </div>

                <button
                  onClick={onCloseMobile}
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                  }}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mobile Quick Actions: Transfer & Bill Pay */}
              {(onOpenTransfer || onOpenBillPay) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                  {onOpenTransfer && (
                    <button
                      onClick={() => {
                        onCloseMobile?.();
                        onOpenTransfer();
                      }}
                      className="btn-secondary"
                      style={{ padding: '8px', fontSize: '0.75rem', justifyContent: 'center' }}
                    >
                      <ArrowRightLeft size={14} color="#1d4ed8" />
                      <span>Transfer</span>
                    </button>
                  )}
                  {onOpenBillPay && (
                    <button
                      onClick={() => {
                        onCloseMobile?.();
                        onOpenBillPay();
                      }}
                      className="btn-secondary"
                      style={{ padding: '8px', fontSize: '0.75rem', justifyContent: 'center' }}
                    >
                      <Receipt size={14} color="#d97706" />
                      <span>Pay Bills</span>
                    </button>
                  )}
                </div>
              )}

              <div style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                padding: '0 12px 10px',
              }}>
                Navigation
              </div>

              {renderNavItems(true)}
            </div>

            {/* Bottom AI Assistant Shortcut */}
            <div style={{ marginTop: '20px' }}>
              <button
                onClick={() => {
                  onCloseMobile?.();
                  onOpenCopilot();
                }}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem', padding: '10px' }}
              >
                <Sparkles size={16} />
                <span>Ask Banking Copilot</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
