import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Shield,
  RotateCcw,
  Wrench,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { ChatMessage, ToolExecutionRecord } from '../types/banking';
import { api } from '../api/client';

interface CopilotChatProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const CopilotChat: React.FC<CopilotChatProps> = ({ isOpen, onClose, initialQuery }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hello Pranita! I am your AI Banking Copilot powered by Google Gemini and real-time database tools. How can I help you today? You can ask about your account balances, Flipkart/Zomato expenses, affordability for big purchases, or savings goals.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [expandedToolIdx, setExpandedToolIdx] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle external query triggers
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await api.sendChatMessage(text, sessionId);
      if (response.session_id) {
        setSessionId(response.session_id);
      }

      const botMsg: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tools_executed: response.tools_executed,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `${Date.now()}-error`,
        role: 'assistant',
        content:
          "⚠️ Unable to connect to the backend server. Please verify that FastAPI is running on port 8000.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSession = () => {
    setSessionId(null);
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: "Conversation session reset. How can I assist with your finances?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const quickPills = [
    'How much did I spend on Flipkart this year?',
    'What is my total account balance?',
    'Can I afford a new car for ₹8,00,000?',
    'Show my credit card rewards & due date',
    'Calculate my financial health score',
  ];

  if (!isOpen) return null;

  return (
    <aside style={{
      position: 'fixed',
      right: 0,
      top: 0,
      bottom: 0,
      width: '460px',
      maxWidth: '100vw',
      background: 'var(--bg-secondary)',
      borderLeft: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 200,
      boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.7)',
      animation: 'fadeIn 0.2s ease-out',
    }}>
      {/* Header */}
      <div style={{
        height: '72px',
        padding: '0 20px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(15, 23, 42, 0.95)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(37, 99, 235, 0.4)',
          }}>
            <Sparkles size={20} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>
                AI Banking Copilot
              </span>
              <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                Gemini 3.8
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Strict Banking Guardrails Active
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleResetSession}
            title="Reset Conversation"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
            }}
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div style={{
        padding: '8px 16px',
        background: 'rgba(30, 41, 59, 0.5)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.7rem',
        color: 'var(--text-secondary)',
      }}>
        <Lock size={12} color="#10b981" />
        <span>Grounded on database truth • PII masked • PIN/OTP protected</span>
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
      }}>
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                gap: '6px',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                flexDirection: isUser ? 'row-reverse' : 'row',
                maxWidth: '90%',
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isUser ? '#2563eb' : 'rgba(56, 189, 248, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}>
                  {isUser ? <User size={14} color="#fff" /> : <Bot size={14} color="#38bdf8" />}
                </div>

                <div style={{
                  background: isUser ? '#2563eb' : 'var(--bg-card)',
                  color: isUser ? '#fff' : 'var(--text-primary)',
                  padding: '12px 16px',
                  borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  border: isUser ? 'none' : '1px solid var(--border-subtle)',
                  whiteSpace: 'pre-wrap',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  {msg.content}
                </div>
              </div>

              {/* Tool Execution Inspector Pill */}
              {msg.tools_executed && msg.tools_executed.length > 0 && (
                <div style={{ marginLeft: '36px', maxWidth: '85%' }}>
                  {msg.tools_executed.map((tool, tIdx) => {
                    const toolKey = `${index}-${tIdx}`;
                    const isExpanded = expandedToolIdx === toolKey;
                    return (
                      <div
                        key={tIdx}
                        style={{
                          background: 'rgba(15, 23, 42, 0.8)',
                          border: '1px solid rgba(59, 130, 246, 0.25)',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          fontSize: '0.72rem',
                          marginTop: '4px',
                        }}
                      >
                        <button
                          onClick={() => setExpandedToolIdx(isExpanded ? null : toolKey)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#38bdf8',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            padding: 0,
                            width: '100%',
                            textAlign: 'left',
                          }}
                        >
                          <Wrench size={12} color="#38bdf8" />
                          <span>Tool Executed: {tool.tool_name}()</span>
                          {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                        </button>

                        {isExpanded && (
                          <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)' }}>
                            <div style={{ color: 'var(--text-muted)' }}>Arguments:</div>
                            <pre className="mono" style={{ fontSize: '0.68rem', color: '#94a3b8', background: 'rgba(0,0,0,0.3)', padding: '4px 6px', borderRadius: '4px', overflowX: 'auto' }}>
                              {JSON.stringify(tool.arguments, null, 2)}
                            </pre>
                            <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Result:</div>
                            <pre className="mono" style={{ fontSize: '0.68rem', color: '#10b981', background: 'rgba(0,0,0,0.3)', padding: '4px 6px', borderRadius: '4px', overflowX: 'auto', maxHeight: '120px' }}>
                              {JSON.stringify(tool.result, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: isUser ? '0 36px 0 0' : '0 0 0 36px' }}>
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Bot size={14} color="#38bdf8" />
            </div>
            <div style={{
              background: 'var(--bg-card)',
              padding: '10px 16px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid var(--border-subtle)',
            }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Copilot is thinking</span>
              <span style={{ animation: 'bounceDot 1s infinite 0ms', color: '#38bdf8' }}>•</span>
              <span style={{ animation: 'bounceDot 1s infinite 200ms', color: '#38bdf8' }}>•</span>
              <span style={{ animation: 'bounceDot 1s infinite 400ms', color: '#38bdf8' }}>•</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Pills */}
      <div style={{
        padding: '10px 16px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(15, 23, 42, 0.6)',
      }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
          Suggested Inquiries
        </div>
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {quickPills.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '9999px',
                padding: '4px 10px',
                fontSize: '0.72rem',
                color: '#cbd5e1',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(37, 99, 235, 0.2)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.color = '#cbd5e1';
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{
          padding: '14px 16px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '8px',
          background: 'var(--bg-secondary)',
        }}
      >
        <input
          type="text"
          placeholder="Ask a financial question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            color: '#fff',
            fontSize: '0.85rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          className="btn-primary"
          disabled={!input.trim() || isLoading}
          style={{ padding: '10px 14px' }}
        >
          <Send size={16} />
        </button>
      </form>
    </aside>
  );
};
