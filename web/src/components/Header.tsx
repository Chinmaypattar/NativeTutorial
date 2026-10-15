import React from 'react';
import {
  Shield,
  Sparkles,
  User,
  Radio,
  LogOut,
  LogIn,
  ArrowRightLeft,
  Receipt,
  Menu,
} from 'lucide-react';
import { Customer } from '../types/banking';

interface HeaderProps {
  customer: Customer | null;
  onOpenCopilot: () => void;
  copilotOpen: boolean;
  onOpenTransfer: () => void;
  onOpenBillPay: () => void;
  onOpenAuth?: () => void;
  onLogout: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  customer,
  onOpenCopilot,
  copilotOpen,
  onOpenTransfer,
  onOpenBillPay,
  onOpenAuth,
  onLogout,
  onToggleMobileMenu,
}) => {
  return (
    <header
      className="header-container"
      style={{
        height: '72px',
        borderBottom: '1px solid var(--border-subtle)',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
      }}
    >
      {/* Brand & Bank Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="header-mobile-toggle"
            aria-label="Toggle navigation menu"
            style={{
              background: '#f1f5f9',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
            }}
          >
            <Menu size={20} />
          </button>
        )}

        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
          flexShrink: 0,
        }}>
          <Shield size={22} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              APEX
            </span>
            <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Digital Bank
            </span>
          </div>
          <div className="header-subtitle" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            NetBanking & AI Conversational Copilot
          </div>
        </div>
      </div>

      {/* Center Quick Action Buttons */}
      <div className="header-center-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onOpenTransfer}
          className="btn-secondary"
          style={{ padding: '8px 16px', fontSize: '0.82rem' }}
        >
          <ArrowRightLeft size={15} color="#1d4ed8" />
          <span>Transfer Funds</span>
        </button>

        <button
          onClick={onOpenBillPay}
          className="btn-secondary"
          style={{ padding: '8px 16px', fontSize: '0.82rem' }}
        >
          <Receipt size={15} color="#d97706" />
          <span>Pay Bills</span>
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-muted)',
          border: '1px solid var(--border-subtle)',
          padding: '6px 12px',
          borderRadius: '9999px',
          fontSize: '0.78rem',
        }}>
          <Radio size={14} color="#059669" />
          <span style={{ color: 'var(--text-secondary)' }}>AI Model:</span>
          <span style={{ color: '#1d4ed8', fontWeight: 700 }}>Gemini 3.8 Flash</span>
        </div>
      </div>

      {/* Right User Profile & AI Copilot Trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={onOpenCopilot}
          style={{
            background: copilotOpen 
              ? 'linear-gradient(135deg, #1d4ed8, #2563eb)' 
              : 'rgba(37, 99, 235, 0.08)',
            border: copilotOpen ? '1px solid #1d4ed8' : '1px solid rgba(37, 99, 235, 0.25)',
            color: copilotOpen ? '#ffffff' : '#1d4ed8',
            padding: '8px 16px',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            boxShadow: copilotOpen ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none',
          }}
        >
          <Sparkles size={16} color={copilotOpen ? '#ffffff' : '#1d4ed8'} />
          <span>{copilotOpen ? 'Copilot Open' : 'Ask Copilot'}</span>
        </button>

        <div style={{ width: '1px', height: '28px', backgroundColor: 'var(--border-subtle)' }} />

        {customer ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="header-user-info" style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                {customer.full_name || `${customer.first_name} ${customer.last_name}`}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600 }}>
                CIBIL: {customer.credit_score || 785} • Verified
              </div>
            </div>

            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#e2e8f0',
              border: '2px solid #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <User size={18} color="#475569" />
            </div>

            <button
              onClick={onLogout}
              title="Sign Out of Apex Bank"
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '7px 9px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              <LogOut size={14} />
              <span>Exit</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="btn-primary"
            style={{ padding: '9px 18px', fontSize: '0.85rem' }}
          >
            <LogIn size={15} />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </header>
  );
};
