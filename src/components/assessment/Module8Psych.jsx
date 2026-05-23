import React, { useState, useEffect } from 'react';

const QUESTIONS = [
  "How often do you feel little interest or pleasure in doing things?",
  "How often do you feel down, hopeless, or empty?",
  "How often do you have trouble falling or staying asleep, or sleeping too much?",
  "How often do you feel tired or have little energy?",
  "How often do you feel nervous, anxious, or on edge?",
  "How often do you find it hard to stop or control worrying?",
  "How often do you feel good about yourself and your abilities?",
  "How often do you feel overwhelmed by your thoughts?",
  "How often do you feel connected to the people around you?",
  "How often do you feel that life is going in a meaningful direction?"
];

const LIKERT = [
  { value: 1, label: 'Never' },
  { value: 2, label: 'Rarely' },
  { value: 3, label: 'Sometimes' },
  { value: 4, label: 'Often' },
  { value: 5, label: 'Always' }
];

const BreathingCircle = () => (
  <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
    <div style={{
      width: '50px', height: '50px', borderRadius: '50%',
      backgroundColor: 'rgba(15,163,177,0.2)', border: '2px solid var(--assess-primary)',
      animation: 'breathe 3s ease-in-out infinite'
    }}></div>
    <style>{`@keyframes breathe { 0%,100%{transform:scale(1);opacity:0.5} 50%{transform:scale(1.5);opacity:1} }`}</style>
  </div>
);

const Module8Psych = ({ saveData, initialData, onNext }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState([]);
  const [showBreath, setShowBreath] = useState(false);
  const [openNote, setOpenNote] = useState('');
  const [showFinal, setShowFinal] = useState(false);

  const handleSelect = (value) => {
    const newScores = [...scores, value];
    setScores(newScores);

    if (currentQ < QUESTIONS.length - 1) {
      setShowBreath(true);
      setTimeout(() => {
        setShowBreath(false);
        setCurrentQ(q => q + 1);
      }, 2000);
    } else {
      setShowFinal(true);
    }
  };

  const handleFinish = () => {
    // PHQ-9 style: Q1-Q4 depression signals (lower=better for Q7,9,10; higher=worse for Q1-6,8)
    const depressionScores = [scores[0], scores[1], scores[2], scores[3]];
    const anxietyScores = [scores[4], scores[5], scores[7]];
    // Q7 (feel good), Q9 (connected), Q10 (meaningful) are positive — invert them
    const wellbeingScores = [(6 - scores[6]), (6 - scores[8]), (6 - scores[9])];

    const avg = (arr) => arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0;

    const data = {
      psychScores: scores,
      depressionIndex: Number(avg(depressionScores).toFixed(2)),
      anxietyIndex: Number(avg(anxietyScores).toFixed(2)),
      wellbeingIndex: Number(avg(wellbeingScores).toFixed(2)),
      openNote
    };
    saveData(data);
    onNext();
  };

  return (
    <div className="module-container" style={{ backgroundColor: '#F0EFFF', margin: '-3rem', padding: '3rem', borderRadius: 'var(--assess-radius)', minHeight: '400px' }}>
      <div className="module-header">
        <h2 className="module-title" style={{ color: '#0A1628' }}>Psychological Evaluation</h2>
        {!showFinal && <p className="module-subtitle">Question {currentQ + 1} of {QUESTIONS.length}</p>}
      </div>

      {showBreath ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }} className="animate-fade-up">
          <p style={{ color: 'var(--assess-text-muted)', marginBottom: '1rem', fontSize: '1.1rem' }}>Take a breath...</p>
          <BreathingCircle />
        </div>
      ) : showFinal ? (
        <div className="animate-fade-up">
          <h3 style={{ marginBottom: '1rem', color: '#0A1628' }}>Almost done!</h3>
          <p style={{ color: 'var(--assess-text-muted)', marginBottom: '1rem' }}>Is there anything else about your mental or emotional health you'd like to share? <em>(Optional)</em></p>
          <textarea
            className="assess-input"
            rows="5"
            value={openNote}
            onChange={e => setOpenNote(e.target.value)}
            placeholder="Share anything you'd like..."
          ></textarea>
          <div style={{ marginTop: '2rem', textAlign: 'right' }}>
            <button className="btn-assess btn-assess-primary" onClick={handleFinish}>Submit & Get Results</button>
          </div>
        </div>
      ) : (
        <div key={currentQ} className="animate-fade-up">
          <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#0A1628', margin: '2rem 0', lineHeight: 1.5 }}>
            {QUESTIONS[currentQ]}
          </h3>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
            {LIKERT.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                style={{
                  flex: 1, minWidth: '80px', padding: '1.2rem 0.5rem',
                  border: '2px solid #C5C4E8', borderRadius: '12px',
                  backgroundColor: 'white', color: '#0A1628',
                  cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem',
                  transition: 'all 0.2s ease', fontFamily: 'inherit'
                }}
                onMouseEnter={e => { e.target.style.borderColor = 'var(--assess-primary)'; e.target.style.backgroundColor = 'rgba(15,163,177,0.08)'; e.target.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.target.style.borderColor = '#C5C4E8'; e.target.style.backgroundColor = 'white'; e.target.style.transform = 'none'; }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 500, color: '#666', marginBottom: '4px' }}>{opt.value}</div>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Module8Psych;
