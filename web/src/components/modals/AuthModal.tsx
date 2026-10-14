import React, { useState } from 'react';
import {
  Shield,
  Lock,
  User,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Building2,
} from 'lucide-react';
import { api } from '../../api/client';
import { Customer } from '../../types/banking';

interface AuthModalProps {
  isOpen: boolean;
  onSuccess: (customer: Customer) => void;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onSuccess, onClose }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('pranita@apexbank.com');
  const [loginPassword, setLoginPassword] = useState('password');

  // Register form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regIncome, setRegIncome] = useState('85000');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);
    try {
      await api.login(loginEmail, loginPassword);
      const user = await api.getCurrentUser();
      onSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!firstName || !lastName || !regEmail || !regPassword) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }
    setSubmitting(true);
    try {
      await api.register({
        first_name: firstName,
        last_name: lastName,
        email: regEmail,
        password: regPassword,
        phone: regPhone || undefined,
        monthly_income: regIncome ? parseFloat(regIncome) : 85000,
      });
      const user = await api.getCurrentUser();
      onSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Try a different email.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (email: string) => {
    setLoginEmail(email);
    setLoginPassword('password');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px', padding: '36px' }}>
        {/* Bank Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #2563eb, #1e3a8a)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(37, 99, 235, 0.4)',
            marginBottom: '12px',
          }}>
            <Shield size={28} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            APEX DIGITAL BANK
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Secure NetBanking & AI Copilot Authentication
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-md)',
          padding: '4px',
          marginBottom: '20px',
          border: '1px solid var(--border-subtle)',
        }}>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: mode === 'login' ? '#2563eb' : 'transparent',
              color: mode === 'login' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage('');
            }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: mode === 'register' ? '#2563eb' : 'transparent',
              color: mode === 'register' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Open New Account
          </button>
        </div>

        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '10px 14px',
            borderRadius: '8px',
            color: '#f87171',
            fontSize: '0.82rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {mode === 'login' ? (
          /* Sign In Form */
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Customer Email ID
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@apexbank.com"
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '10px 12px 10px 38px',
                    color: '#fff',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Password
                </label>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', cursor: 'pointer' }} onClick={() => fillDemo('pranita@apexbank.com')}>
                  Use Demo Password
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '10px 38px 10px 38px',
                    color: '#fff',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '12px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
              style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '6px' }}
            >
              <span>{submitting ? 'Verifying...' : 'Sign In to NetBanking'}</span>
              <ArrowRight size={16} />
            </button>

            {/* Quick Demo Fill Pill */}
            <div style={{
              marginTop: '12px',
              padding: '12px',
              background: 'rgba(37, 99, 235, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 600 }}>Demo Account: Pranita Sharma</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>pranita@apexbank.com</div>
              </div>
              <button
                type="button"
                onClick={() => fillDemo('pranita@apexbank.com')}
                style={{
                  background: '#2563eb',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Auto Fill
              </button>
            </div>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rohan"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Verma"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="rohan@example.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Mobile Phone
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Monthly Income (₹)
                </label>
                <input
                  type="number"
                  placeholder="85000"
                  value={regIncome}
                  onChange={(e) => setRegIncome(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Set NetBanking Password
              </label>
              <input
                type="password"
                placeholder="Choose strong password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
                required
              />
            </div>

            <div style={{
              padding: '10px 12px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '8px',
              fontSize: '0.72rem',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <CheckCircle2 size={14} />
              <span>Includes pre-configured Savings Account (₹1,00,000 credit) & Visa Card!</span>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
              style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
            >
              <span>{submitting ? 'Creating Account...' : 'Open Account Now'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
