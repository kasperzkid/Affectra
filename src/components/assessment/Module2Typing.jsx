import React, { useState, useRef, useEffect } from 'react';

// Simple emotional dictionaries
const POSITIVE_WORDS = ['happy', 'good', 'great', 'excellent', 'excited', 'calm', 'peaceful', 'energetic', 'hopeful', 'joy', 'fine', 'okay', 'better'];
const NEGATIVE_WORDS = ['sad', 'bad', 'terrible', 'anxious', 'depressed', 'tired', 'exhausted', 'angry', 'stressed', 'overwhelmed', 'pain', 'hurt'];

const Module2Typing = ({ saveData, initialData, onNext }) => {
  const [text, setText] = useState(initialData?.rawText || '');
  const [isTyping, setIsTyping] = useState(false);
  
  // Ref to hold tracking data without triggering re-renders constantly
  const tracker = useRef({
    startTime: null,
    endTime: null,
    keystrokes: [],
    backspaces: 0,
    totalKeysPressed: 0
  });

  const analyzeText = (finalText) => {
    const t = tracker.current;
    if (!t.startTime) return null;
    t.endTime = Date.now();
    
    const durationMinutes = (t.endTime - t.startTime) / 60000;
    const words = finalText.trim().split(/\s+/).filter(w => w.length > 0);
    const wpm = durationMinutes > 0 ? Math.round(words.length / durationMinutes) : 0;
    
    // Hesitation & Rhythm
    let pauses = 0;
    let intervals = [];
    for (let i = 1; i < t.keystrokes.length; i++) {
      const delay = t.keystrokes[i] - t.keystrokes[i-1];
      intervals.push(delay);
      if (delay > 2000) pauses++; // >2s is a hesitation
    }
    
    const hesitationIndex = pauses;
    
    // Standard deviation of intervals (Rhythm consistency)
    let rhythmConsistency = 0;
    if (intervals.length > 0) {
      const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance = intervals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / intervals.length;
      rhythmConsistency = Math.round(Math.sqrt(variance));
    }

    const errorRate = t.totalKeysPressed > 0 ? (t.backspaces / t.totalKeysPressed).toFixed(2) : 0;

    // Emotional Tone
    const lowerText = finalText.toLowerCase();
    let posCount = 0;
    let negCount = 0;
    POSITIVE_WORDS.forEach(w => { if(lowerText.includes(w)) posCount++; });
    NEGATIVE_WORDS.forEach(w => { if(lowerText.includes(w)) negCount++; });
    
    let emotionalTone = 'Neutral';
    if (posCount > negCount) emotionalTone = 'Positive';
    if (negCount > posCount) emotionalTone = 'Negative';

    return {
      wpm,
      backspaceCount: t.backspaces,
      hesitationIndex,
      rhythmConsistency,
      errorRate: parseFloat(errorRate),
      emotionalTone,
      rawText: finalText
    };
  };

  const handleKeyDown = (e) => {
    const t = tracker.current;
    if (!t.startTime && e.key.length === 1) {
      t.startTime = Date.now();
      setIsTyping(true);
    }
    
    t.keystrokes.push(Date.now());
    t.totalKeysPressed++;

    if (e.key === 'Backspace' || e.key === 'Delete') {
      t.backspaces++;
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    
    // Stop pulsing effect after 1 second of no typing
    setIsTyping(true);
    clearTimeout(tracker.current.timeout);
    tracker.current.timeout = setTimeout(() => setIsTyping(false), 1000);
  };

  const handleFinish = () => {
    const analysis = analyzeText(text);
    if (analysis) saveData(analysis);
    else saveData({ rawText: text, wpm: 0, backspaceCount: 0, errorRate: 0, emotionalTone: 'Neutral' });
    onNext();
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h2 className="module-title">Emotional Expression</h2>
        <p className="module-subtitle">We'd like to hear from you.</p>
      </div>

      <div className="assess-form-group animate-fade-up">
        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--assess-text-main)', lineHeight: '1.6' }}>
          "In a few sentences, describe how you've been feeling lately — emotionally and physically. There are no right or wrong answers."
        </p>

        <textarea 
          className="assess-input" 
          rows="8" 
          placeholder="Start typing here..."
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          style={{ 
            transition: 'box-shadow 0.3s ease',
            boxShadow: isTyping ? '0 0 15px rgba(15, 163, 177, 0.4)' : 'none',
            borderColor: isTyping ? 'var(--assess-primary)' : 'var(--assess-border)'
          }}
        ></textarea>

        {text.length > 0 && (
          <div style={{ fontSize: '0.85rem', color: 'var(--assess-text-muted)', marginTop: '0.8rem', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--assess-primary)', animation: 'pulse 1.5s infinite' }}></span>
            analyzing...
          </div>
        )}
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'right' }}>
        <button className="btn-assess btn-assess-primary" onClick={handleFinish} disabled={text.length < 10}>
          Next Module
        </button>
      </div>
    </div>
  );
};

export default Module2Typing;
