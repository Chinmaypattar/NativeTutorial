import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Building2,
  TrendingUp,
  AlertCircle,
  Eye,
  EyeOff,
  Radio,
  Zap,
} from 'lucide-react';
import { api } from '../../api/client';
import { Customer } from '../../types/banking';

interface LoginPortalProps {
  onLoginSuccess: (customer: Customer) => void;
  onOpenCopilot: () => void;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({ onLoginSuccess, onOpenCopilot }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('pranita@example.com');
  const [loginPassword, setLoginPassword] = useState('password');

  // Register form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regIncome, setRegIncome] = useState('85000');
  const [regPassword, setRegPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);
    try {
      await api.login(loginEmail, loginPassword);
      const user = await api.getCurrentUser();
      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setErrorMessage('');
    setSubmitting(true);
    try {
      await api.login('pranita@example.com', 'password');
      const user = await api.getCurrentUser();
      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo login failed. Make sure backend is running.');
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
      onLoginSuccess(user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Try a different email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8fafc 0%, #edf2f7 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top Bank Navigation Bar */}
      <header
        className="header-container"
        style={{
          height: '74px',
          background: '#ffffff',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 36px',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
            flexShrink: 0,
          }}>
            <Shield size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                APEX
              </span>
              <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Digital Bank
              </span>
            </div>
            <div className="header-subtitle" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Reserve Bank of India Regulated NetBanking Gateway
            </div>
          </div>
        </div>

        {/* Security & Copilot Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="portal-header-badges" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              color: '#065f46',
              fontWeight: 600,
            }}>
              <Shield size={14} color="#059669" />
              <span>256-bit SSL Banking Protection</span>
            </div>

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
              <span style={{ color: 'var(--text-secondary)' }}>AI Engine:</span>
              <span style={{ color: '#1d4ed8', fontWeight: 700 }}>Gemini 3.8 Flash</span>
            </div>
          </div>

          <button
            onClick={onOpenCopilot}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '8px 16px' }}
          >
            <Sparkles size={15} color="#1d4ed8" />
            <span>AI Copilot Help</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div
        className="login-portal-grid portal-container"
        style={{
          flex: 1,
          maxWidth: '1240px',
          width: '100%',
          margin: '0 auto',
          padding: '48px 32px',
        }}
      >
        {/* Left Column: Bank Hero & Feature Pillars */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            color: '#1d4ed8',
            fontWeight: 700,
            marginBottom: '20px',
          }}>
            <Sparkles size={14} />
            <span>Next-Generation Autonomous NetBanking</span>
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            lineHeight: 1.18,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginBottom: '16px',
          }}>
            Intelligent Banking with Live <span style={{ color: '#1d4ed8' }}>Gemini AI Copilot</span>
          </h1>

          <p style={{
            fontSize: '1.02rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '32px',
            maxWidth: '560px',
          }}>
            Experience safe institutional banking powered by real-time database tools, automated cashflow projections, multi-asset portfolio tracking, and instant payments.
          </p>

          {/* 4 Feature Highlights Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}>
            <div style={{
              background: '#ffffff',
              padding: '18px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px',
              }}>
                <Zap size={18} color="#1d4ed8" />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Instant Fund Transfers
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                Instant UPI, IMPS, and bill payments with immediate balance updates and debit receipts.
              </p>
            </div>

            <div style={{
              background: '#ffffff',
              padding: '18px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px',
              }}>
                <TrendingUp size={18} color="#059669" />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Predictive Analytics
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                30-day cashflow forecasts, purchase affordability checks, and 5-pillar credit scoring.
              </p>
            </div>

            <div style={{
              background: '#ffffff',
              padding: '18px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px',
              }}>
                <Sparkles size={18} color="#d97706" />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Gemini Copilot Banker
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                Ask complex queries like "How much did I spend on Flipkart?" with prompt guardrails.
              </p>
            </div>

            <div style={{
              background: '#ffffff',
              padding: '18px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px',
              }}>
                <Building2 size={18} color="#0f172a" />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                DICGC ₹5 Lakh Safety
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                All savings, current, and term deposit balances are statutory RBI insurance guaranteed.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#059669" />
              <span>Zero Maintenance Fees</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#059669" />
              <span>Multi-Asset Portfolio</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#059669" />
              <span>Real-Time Audit Trail</span>
            </div>
          </div>
        </div>

        {/* Right Column: Secure Banking Gateway Card */}
        <div>
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '36px',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
          }}>
            {/* Header of the Card */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                marginBottom: '12px',
                boxShadow: '0 4px 12px rgba(29, 78, 216, 0.25)',
              }}>
                <Lock size={22} />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                NetBanking Secure Gateway
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Please authenticate to access your personal banking dashboard
              </p>
            </div>

            {/* 1-Click Instant Demo Login Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '22px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Quick Test Access
              </div>
              <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: '2px', marginBottom: '12px' }}>
                Sign in with pre-seeded demo customer <strong>Pranita Sharma</strong>
              </div>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={submitting}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', padding: '10px 16px' }}
              >
                <Sparkles size={16} />
                <span>{submitting ? 'Authenticating...' : '1-Click Sign In as Pranita (Demo)'}</span>
              </button>
            </div>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '20px 0',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
            }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
              <span style={{ padding: '0 12px', textTransform: 'uppercase', fontWeight: 600 }}>
                Or Custom Credentials
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            </div>

            {/* Tab switch */}
            <div style={{
              display: 'flex',
              background: '#f1f5f9',
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
                  background: mode === 'login' ? '#1d4ed8' : 'transparent',
                  color: mode === 'login' ? '#ffffff' : 'var(--text-secondary)',
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
                  background: mode === 'register' ? '#1d4ed8' : 'transparent',
                  color: mode === 'register' ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Open New Account
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div style={{
                marginBottom: '18px',
                padding: '10px 14px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#dc2626',
                fontSize: '0.82rem',
              }}>
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            {mode === 'login' ? (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Email or Customer ID
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="text"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. pranita@example.com"
                      style={{
                        width: '100%',
                        padding: '10px 14px 10px 38px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-strong)',
                        background: '#ffffff',
                        color: 'var(--text-primary)',
                        fontSize: '0.875rem',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password"
                      style={{
                        width: '100%',
                        padding: '10px 40px 10px 38px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-strong)',
                        background: '#ffffff',
                        color: 'var(--text-primary)',
                        fontSize: '0.875rem',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '10px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '8px', padding: '12px' }}
                >
                  <span>{submitting ? 'Signing In...' : 'Secure Sign In'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Rahul"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-strong)',
                        background: '#ffffff',
                        color: 'var(--text-primary)',
                        fontSize: '0.82rem',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Varma"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-strong)',
                        background: '#ffffff',
                        color: 'var(--text-primary)',
                        fontSize: '0.82rem',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. rahul.varma@example.com"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-strong)',
                      background: '#ffffff',
                      color: 'var(--text-primary)',
                      fontSize: '0.82rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-strong)',
                      background: '#ffffff',
                      color: 'var(--text-primary)',
                      fontSize: '0.82rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a strong password"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-strong)',
                      background: '#ffffff',
                      color: 'var(--text-primary)',
                      fontSize: '0.82rem',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '6px', padding: '12px' }}
                >
                  <span>{submitting ? 'Creating Account...' : 'Open Account & Sign In'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}

            {/* Footer Trust */}
            <div style={{
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-subtle)',
              textAlign: 'center',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
            }}>
              Protected by multi-factor cryptographic tokens and RBI statutory banking norms.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
