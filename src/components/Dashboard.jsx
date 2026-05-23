import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDB, addJournalEntry, updateUser, addChatMessage, clearChatHistory } from '../utils/dataStore';
import './Dashboard.css';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

// SVGs
const IconTest = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
const IconChart = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const IconBook = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const IconAI = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>;
const IconSettings = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const IconLogOut = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

// Simple animated gauge component
const MiniGauge = ({ score }) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((score || 0) / 100) * circumference;
  const color = score >= 75 ? 'var(--d-success)' : score >= 50 ? 'var(--d-warning)' : 'var(--d-danger)';
  
  return (
    <div style={{ position: 'relative', width: '100px', height: '100px' }}>
      <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--d-border)" strokeWidth="8" />
        <circle 
          cx="50" cy="50" r={radius} fill="none" 
          stroke={color} strokeWidth="8" 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          strokeLinecap="round" 
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '1.4rem', fontWeight: 800, color }}>{score}</span>
        <span style={{ fontSize: '0.6rem', color: 'var(--d-muted)', fontWeight: 600 }}>/ 100</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('take-a-test');
  const [dbData, setDbData] = useState(null);
  const [newJournal, setNewJournal] = useState('');
  
  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = React.useRef(null);
  
  // Settings state
  const [settingsForm, setSettingsForm] = useState({ name: '', email: '', password: '', aiModel: '' });

  useEffect(() => {
    const db = getDB();
    setDbData(db);
    setSettingsForm({
      name: db.user.name || '',
      email: db.user.email || '',
      password: db.user.password || '',
      aiModel: db.user.aiModel || 'google/gemini-2.0-flash-exp:free'
    });
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dbData?.aiChatHistory]);

  const handleLogout = () => navigate('/');

  const handleJournalSubmit = (e) => {
    e.preventDefault();
    if (!newJournal.trim()) return;
    addJournalEntry(newJournal);
    setNewJournal('');
    setDbData(getDB());
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setIsTyping(true);
    
    // Add user message to DB
    addChatMessage('user', userMessage);
    setDbData(getDB()); // Update UI immediately

    try {
      const db = getDB();
      const contextPrompt = `You are a helpful health AI assistant for ${db.user.name}. Overall Health Score: ${db.user.overallHealth}/100. Tests taken: ${db.tests.length}. Provide concise, clinical, but friendly advice based on this context.`;
      
      const messages = [
        { role: 'system', content: contextPrompt },
        ...db.aiChatHistory.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage }
      ];

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://affectra.health',
          'X-Title': 'Health Optimizer Chat'
        },
        body: JSON.stringify({
          model: db.user.aiModel || 'google/gemini-2.0-flash-exp:free',
          messages
        })
      });

      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      addChatMessage('assistant', aiResponse);
    } catch (err) {
      console.error(err);
      addChatMessage('assistant', "I'm sorry, I encountered an error connecting to the AI server.");
    } finally {
      setIsTyping(false);
      setDbData(getDB());
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Clear all chat history?')) {
      clearChatHistory();
      setDbData(getDB());
    }
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    updateUser(settingsForm);
    setDbData(getDB());
    alert('Settings saved successfully!');
  };

  const getLatestTest = () => dbData?.tests?.[0];
  const latestScore = getLatestTest()?.score || 0;

  if (!dbData) return <div className="dash-root">Loading...</div>;

  return (
    <div className="dash-root">
      
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-logo">
          <div className="dash-logo-icon" onClick={() => navigate('/')}>A</div>
          <div className="dash-logo-name" onClick={() => navigate('/')}>Affectra</div>
        </div>
        
        <nav className="dash-nav">
          <button className={`dash-nav-item ${activeTab === 'take-a-test' ? 'active' : ''}`} onClick={() => setActiveTab('take-a-test')}>
            <IconTest /> <span className="dash-nav-label">Take a Test</span>
          </button>
          <button className={`dash-nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
            <IconChart /> <span className="dash-nav-label">Analytics</span>
          </button>
          <button className={`dash-nav-item ${activeTab === 'journal' ? 'active' : ''}`} onClick={() => setActiveTab('journal')}>
            <IconBook /> <span className="dash-nav-label">Journal</span>
          </button>
          <button className={`dash-nav-item ${activeTab === 'ai-recommendation' ? 'active' : ''}`} onClick={() => setActiveTab('ai-recommendation')}>
            <IconAI /> <span className="dash-nav-label">AI Chat</span>
          </button>
          <button className={`dash-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <IconSettings /> <span className="dash-nav-label">Settings</span>
          </button>
        </nav>

        <div className="dash-sidebar-footer">
          <button className="dash-logout-btn" onClick={handleLogout}>
            <IconLogOut /> <span className="dash-nav-label">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="dash-main">
        {/* Topbar */}
        <header className="dash-topbar">
          <div>
            <h1>Welcome back, {dbData.user.name}!</h1>
            <p>Your personal health dashboard</p>
          </div>
          <div className="dash-topbar-right">
            <button className="dash-new-test-btn" onClick={() => navigate('/assessment')}>
              + New Test
            </button>
            {dbData.user.picture ? (
              <img src={dbData.user.picture} alt="Profile" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid var(--d-border)' }} />
            ) : (
              <div className="dash-avatar">{dbData.user.name.charAt(0).toUpperCase()}</div>
            )}
          </div>
        </header>

        {/* Content Body */}
        <div className="dash-body">
          {activeTab === 'take-a-test' && (
            <div className="fade-up dash-content-grid">
              <div className="dash-card">
                <div className="dash-card-header">
                  <h2 className="dash-card-title">Available Assessments</h2>
                </div>
                <div className="dash-card-body">
                  <div className="dash-assessment-card">
                    <div className="dash-assessment-top">
                      <div style={{ background: 'rgba(255,255,255,0.1)', width: 60, height: 60, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0 }}>🧬</div>
                      <div>
                        <h3 style={{ color: 'white', margin: '0 0 0.5rem', fontSize: '1.2rem' }}>Comprehensive Health Optimizer</h3>
                        <p className="dash-assessment-desc">An 8-module clinical assessment covering lifestyle, motor skills, vision, mood, speech, and medical history. Powered by AI.</p>
                      </div>
                    </div>
                    <div className="dash-assessment-bottom">
                      <div className="dash-module-pills">
                        <span className="dash-pill">Lifestyle</span>
                        <span className="dash-pill">Typing Biometrics</span>
                        <span className="dash-pill">Motor Skills</span>
                        <span className="dash-pill">Vision</span>
                        <span className="dash-pill">Mood</span>
                        <span className="dash-pill">Speech</span>
                        <span className="dash-pill">Medical</span>
                        <span className="dash-pill">Psych</span>
                      </div>
                      <button className="dash-new-test-btn" onClick={() => navigate('/assessment')}>Start Assessment</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="fade-up">
              <div className="dash-stats-grid">
                <div className="dash-stat-card">
                  <div className="dash-stat-icon" style={{ background: 'var(--d-primary-light)', color: 'var(--d-primary)' }}>
                    <IconChart />
                  </div>
                  <div className="dash-stat-info">
                    <div className="dash-stat-label">Overall Health</div>
                    <div className="dash-stat-value">{dbData.user.overallHealth || '--'}</div>
                    <div className="dash-stat-sub">From latest test</div>
                  </div>
                </div>
                <div className="dash-stat-card">
                  <div className="dash-stat-icon" style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--d-purple)' }}>
                    <IconTest />
                  </div>
                  <div className="dash-stat-info">
                    <div className="dash-stat-label">Tests Completed</div>
                    <div className="dash-stat-value">{dbData.tests.length}</div>
                    <div className="dash-stat-sub">Lifetime</div>
                  </div>
                </div>
                <div className="dash-stat-card">
                  <div className="dash-stat-icon" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--d-warning)' }}>
                    <IconBook />
                  </div>
                  <div className="dash-stat-info">
                    <div className="dash-stat-label">Journal Entries</div>
                    <div className="dash-stat-value">{dbData.journal.length}</div>
                    <div className="dash-stat-sub">Keep reflecting!</div>
                  </div>
                </div>
              </div>

              <div className="dash-two-col">
                <div className="dash-card">
                  <div className="dash-card-header">
                    <h2 className="dash-card-title">Latest Score Overview</h2>
                  </div>
                  <div className="dash-card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {getLatestTest() ? (
                      <>
                        <MiniGauge score={latestScore} />
                        <h3 style={{ margin: '1.5rem 0 0.5rem', fontSize: '1.1rem', color: 'var(--d-text)' }}>{getLatestTest().testName}</h3>
                        <p style={{ color: 'var(--d-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
                          Taken on {new Date(getLatestTest().date).toLocaleDateString()}
                        </p>
                      </>
                    ) : (
                      <div className="dash-empty">
                        <div className="dash-empty-icon">📊</div>
                        <p className="dash-empty-text">No tests taken yet.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="dash-card">
                  <div className="dash-card-header">
                    <h2 className="dash-card-title">Test History</h2>
                  </div>
                  <div className="dash-card-body" style={{ padding: 0 }}>
                    {dbData.tests.length === 0 ? (
                      <div className="dash-empty" style={{ padding: '2rem' }}>
                        <p className="dash-empty-text">Take your first test to see history.</p>
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table className="dash-table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Assessment</th>
                              <th>Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dbData.tests.map(test => (
                              <tr key={test.id}>
                                <td>{new Date(test.date).toLocaleDateString()}</td>
                                <td>{test.testName}</td>
                                <td>
                                  <span className={`score-badge ${test.score >= 75 ? 'great' : test.score >= 50 ? 'ok' : 'low'}`}>
                                    {test.score}/100
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'journal' && (
            <div className="fade-up dash-content-grid">
              <div className="dash-card">
                <div className="dash-card-header">
                  <h2 className="dash-card-title">New Entry</h2>
                </div>
                <div className="dash-card-body">
                  <form onSubmit={handleJournalSubmit} className="dash-journal-form">
                    <textarea 
                      placeholder="How are you feeling today?"
                      value={newJournal}
                      onChange={(e) => setNewJournal(e.target.value)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button type="submit" className="dash-journal-submit">Save Entry</button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="dash-card">
                <div className="dash-card-header">
                  <h2 className="dash-card-title">Past Entries</h2>
                </div>
                <div className="dash-card-body">
                  {dbData.journal.length === 0 ? (
                    <div className="dash-empty" style={{ padding: '2rem 0' }}>
                      <div className="dash-empty-icon">📝</div>
                      <p className="dash-empty-text">No journal entries yet.</p>
                    </div>
                  ) : (
                    <div className="dash-journal-list">
                      {dbData.journal.map(entry => (
                        <div key={entry.id} className="dash-journal-card fade-up">
                          <div className="dash-journal-date">
                            {new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                          </div>
                          <div className="dash-journal-text">{entry.content}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai-recommendation' && (
            <div className="fade-up dash-content-grid" style={{ height: 'calc(100vh - 120px)' }}>
              <div className="dash-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="dash-card-header">
                  <h2 className="dash-card-title">AI Health Assistant</h2>
                  {dbData.aiChatHistory.length > 0 && (
                    <button onClick={handleClearChat} style={{ background: 'none', border: 'none', color: 'var(--d-muted)', cursor: 'pointer', fontSize: '0.85rem' }}>Clear Chat</button>
                  )}
                </div>
                <div className="dash-card-body" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
                  {dbData.aiChatHistory.length === 0 ? (
                    <div className="dash-empty" style={{ margin: 'auto' }}>
                      <div className="dash-empty-icon">🤖</div>
                      <p className="dash-empty-text">Hello {dbData.user.name}! I am your personalized health assistant. Ask me anything about your wellness or test results.</p>
                    </div>
                  ) : (
                    dbData.aiChatHistory.map(msg => (
                      <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        <div style={{ maxWidth: '80%', padding: '0.8rem 1.2rem', borderRadius: '16px', background: msg.role === 'user' ? 'linear-gradient(135deg, var(--d-primary), #0c8a96)' : '#F0F4F8', color: msg.role === 'user' ? 'white' : 'var(--d-text)', borderBottomRightRadius: msg.role === 'user' ? 0 : '16px', borderBottomLeftRadius: msg.role === 'user' ? '16px' : 0, lineHeight: 1.5 }}>
                          {msg.content}
                        </div>
                      </div>
                    ))
                  )}
                  {isTyping && (
                    <div style={{ alignSelf: 'flex-start', background: '#F0F4F8', padding: '0.8rem 1.2rem', borderRadius: '16px', borderBottomLeftRadius: 0, color: 'var(--d-muted)' }}>
                      Typing...
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--d-border)' }}>
                  <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '1rem' }}>
                    <input 
                      type="text" 
                      value={chatInput} 
                      onChange={e => setChatInput(e.target.value)} 
                      placeholder="Ask about your health..." 
                      style={{ flex: 1, padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid var(--d-border)', outline: 'none' }}
                      disabled={isTyping}
                    />
                    <button type="submit" className="dash-new-test-btn" disabled={isTyping || !chatInput.trim()}>Send</button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="fade-up dash-content-grid">
              <div className="dash-card">
                <div className="dash-card-header">
                  <h2 className="dash-card-title">Profile Settings</h2>
                </div>
                <div className="dash-card-body">
                  <form onSubmit={handleSettingsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Name</label>
                      <input type="text" value={settingsForm.name} onChange={e => setSettingsForm({...settingsForm, name: e.target.value})} style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '10px', border: '1px solid var(--d-border)', outline: 'none', background: 'var(--d-bg)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Email</label>
                      <input type="email" value={settingsForm.email} onChange={e => setSettingsForm({...settingsForm, email: e.target.value})} style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '10px', border: '1px solid var(--d-border)', outline: 'none', background: 'var(--d-bg)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Password</label>
                      <input type="password" value={settingsForm.password} onChange={e => setSettingsForm({...settingsForm, password: e.target.value})} style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '10px', border: '1px solid var(--d-border)', outline: 'none', background: 'var(--d-bg)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Preferred AI Model (Free)</label>
                      <select value={settingsForm.aiModel} onChange={e => setSettingsForm({...settingsForm, aiModel: e.target.value})} style={{ width: '100%', padding: '0.8rem 1.2rem', borderRadius: '10px', border: '1px solid var(--d-border)', outline: 'none', background: 'var(--d-bg)' }}>
                        <option value="google/gemini-2.0-flash-exp:free">Gemini 2.0 Flash (Free Default)</option>
                        <option value="meta-llama/llama-3-8b-instruct:free">Llama 3 8B (Free)</option>
                        <option value="mistralai/mistral-7b-instruct:free">Mistral 7B (Free)</option>
                        <option value="openchat/openchat-7b:free">OpenChat 7B (Free)</option>
                      </select>
                    </div>
                    <button type="submit" className="dash-new-test-btn" style={{ alignSelf: 'flex-start' }}>Save Changes</button>
                  </form>
                </div>
              </div>

              <div className="dash-card">
                <div className="dash-card-header">
                  <h2 className="dash-card-title">Data Privacy & Storage</h2>
                </div>
                <div className="dash-card-body">
                  <div className="dash-settings-section">
                    <p style={{ color: 'var(--d-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>All your health data, journal entries, and chat histories are stored locally on your device in your browser's Local Storage.</p>
                    
                    <div className="dash-settings-row">
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Clear Local Database</div>
                        <div style={{ color: 'var(--d-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>Permanently delete all tests and journals.</div>
                      </div>
                      <button className="dash-danger-btn" onClick={() => {
                        if (window.confirm("Are you sure? This cannot be undone.")) {
                          localStorage.removeItem('affectra_db');
                          window.location.reload();
                        }
                      }}>
                        Delete Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
