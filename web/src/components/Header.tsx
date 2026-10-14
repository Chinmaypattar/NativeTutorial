import React from 'react';
import { Shield, Sparkles, User, Bell, Radio } from 'lucide-react';
import { Customer } from '../types/banking';

interface HeaderProps {
  customer: Customer | null;
  onOpenCopilot: () => void;
  copilotOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ customer, onOpenCopilot, copilotOpen }) => {
  return (
    <header style={{
      height: '72px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(15, 23, 42, 0.9)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 36px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Brand & Bank Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #2563eb, #1e3a8a)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(37, 99, 235, 0.4)',
        }}>
          <Shield size={24} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', color: '#fff' }}>
              APEX
            </span>
            <span style={{ fontWeight: 500, fontSize: '0.9rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Digital Bank
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            NetBanking & Conversational Copilot Portal
          </div>
        </div>
      </div>

      {/* Center AI Engine Status Pill */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(30, 41, 59, 0.6)',
        border: '1px solid var(--border-subtle)',
        padding: '6px 14px',
        borderRadius: '9999px',
        fontSize: '0.8rem',
      }}>
        <Radio size={14} color="#10b981" style={{ animation: 'pulseGlow 2s infinite' }} />
        <span style={{ color: 'var(--text-secondary)' }}>AI Engine:</span>
        <span style={{ color: '#38bdf8', fontWeight: 600 }}>Google Gemini 3.8 Flash</span>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#10b981',
          marginLeft: '4px',
        }}></span>
      </div>

      {/* Right User Profile & AI Copilot Trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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

        <div style={{
          width: '1px',
          height: '28px',
          backgroundColor: 'var(--border-subtle)',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#fff' }}>
              {customer?.full_name || 'Pranita Sharma'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
              CIBIL Score: {customer?.credit_score || 785} • Verified
            </div>
          </div>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #475569, #334155)',
            border: '2px solid rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <User size={18} color="#f8fafc" />
          </div>
        </div>
      </div>
    </header>
  );
};
