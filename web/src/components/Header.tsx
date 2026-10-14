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
} from 'lucide-react';
import { Customer } from '../types/banking';

interface HeaderProps {
  customer: Customer | null;
  onOpenCopilot: () => void;
  copilotOpen: boolean;
  onOpenTransfer: () => void;
  onOpenBillPay: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  customer,
  onOpenCopilot,
  copilotOpen,
  onOpenTransfer,
  onOpenBillPay,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header style={{
      height: '72px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Brand & Bank Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #2563eb, #1e3a8a)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(37, 99, 235, 0.4)',
        }}>
          <Shield size={22} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', color: '#fff' }}>
              APEX
            </span>
            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Digital Bank
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            NetBanking & Conversational Copilot
          </div>
        </div>
      </div>

      {/* Center Quick Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onOpenTransfer}
          className="btn-secondary"
          style={{ padding: '7px 14px', fontSize: '0.78rem' }}
        >
          <ArrowRightLeft size={14} color="#38bdf8" />
          <span>Transfer Funds</span>
        </button>

        <button
          onClick={onOpenBillPay}
          className="btn-secondary"
          style={{ padding: '7px 14px', fontSize: '0.78rem' }}
        >
          <Receipt size={14} color="#f59e0b" />
          <span>Pay Bills</span>
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid var(--border-subtle)',
          padding: '6px 12px',
          borderRadius: '9999px',
          fontSize: '0.78rem',
        }}>
          <Radio size={14} color="#10b981" />
          <span style={{ color: 'var(--text-secondary)' }}>AI Model:</span>
          <span style={{ color: '#38bdf8', fontWeight: 600 }}>Gemini 3.8 Flash</span>
        </div>
      </div>

      {/* Right User Profile & AI Copilot Trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={onOpenCopilot}
          style={{
            background: copilotOpen 
              ? 'linear-gradient(135deg, #2563eb, #3b82f6)' 
              : 'rgba(37, 99, 235, 0.15)',
            border: '1px solid rgba(37, 99, 235, 0.4)',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            boxShadow: copilotOpen ? '0 0 20px rgba(37, 99, 235, 0.4)' : 'none',
          }}
        >
          <Sparkles size={16} color={copilotOpen ? '#fff' : '#38bdf8'} />
          <span>{copilotOpen ? 'Copilot Active' : 'Ask Copilot'}</span>
        </button>

        <div style={{ width: '1px', height: '28px', backgroundColor: 'var(--border-subtle)' }} />

        {customer ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#fff' }}>
                {customer.full_name || `${customer.first_name} ${customer.last_name}`}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
                CIBIL: {customer.credit_score || 785} • Verified
              </div>
            </div>

            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #475569, #334155)',
              border: '2px solid rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <User size={18} color="#f8fafc" />
            </div>

            <button
              onClick={onLogout}
              title="Sign Out"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                padding: '6px 8px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="btn-primary"
            style={{ padding: '8px 14px', fontSize: '0.8rem' }}
          >
            <LogIn size={14} />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </header>
  );
};
