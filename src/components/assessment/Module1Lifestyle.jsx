import React, { useState, useEffect } from 'react';

const QUESTIONS = [
  { id: 'sleep', type: 'slider', text: 'How many hours do you sleep on average per night?', min: 1, max: 12, label: 'Recommended: 7–9' },
  { id: 'meals', type: 'stepper', text: 'How many meals do you eat per day?', min: 1, max: 6 },
  { id: 'water', type: 'slider', text: 'How many glasses of water do you drink daily?', min: 0, max: 15 },
  { id: 'exercise', type: 'radio', text: 'How many days per week do you exercise?', options: ['0 days', '1–2 days', '3–4 days', '5+ days'] },
  { id: 'substances', type: 'multi', text: 'Do you smoke or consume alcohol?', options: ['Smoke', 'Drink', 'Both', 'Neither'] },
  { id: 'screen', type: 'slider', text: 'How many hours do you spend on screens daily?', min: 0, max: 16 },
  { id: 'routine', type: 'textarea', text: 'Describe your daily routine briefly.' },
  { id: 'supplements', type: 'conditional', text: 'Do you take any vitamins or supplements?', subText: 'Please specify' }
];

const Module1Lifestyle = ({ saveData, initialData, onNext }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState(initialData || {
    sleep: 7, meals: 3, water: 6, exercise: '', substances: [], screen: 5, routine: '', supplements: 'No', supplementsDetails: ''
  });

  // Sync data up whenever answers change
  useEffect(() => {
    saveData(answers);
  }, [answers, saveData]);

  const handleChange = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleNextQ = () => {
    if (currentQIndex < QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      // Move to next module
      onNext();
    }
  };

  const q = QUESTIONS[currentQIndex];

  return (
    <div className="module-container">
      <div className="module-header">
        <h2 className="module-title">Daily Lifestyle Assessment</h2>
        <p className="module-subtitle">Question {currentQIndex + 1} of {QUESTIONS.length}</p>
      </div>

      <div className="assess-form-group animate-fade-up" key={q.id}>
        <label className="assess-label">{q.text}</label>
        
        {q.type === 'slider' && (
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--assess-primary)', marginBottom: '1rem', textAlign: 'center' }}>
              {answers[q.id]}
            </div>
            <input 
              type="range" 
              className="assess-slider" 
              min={q.min} max={q.max} 
              value={answers[q.id]} 
              onChange={(e) => handleChange(q.id, Number(e.target.value))}
            />
            {q.label && <p style={{ fontSize: '0.85rem', color: 'var(--assess-text-muted)', marginTop: '0.5rem', textAlign: 'center' }}>{q.label}</p>}
          </div>
        )}

        {q.type === 'stepper' && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}>
            <button className="btn-assess btn-assess-secondary" onClick={() => handleChange(q.id, Math.max(q.min, answers[q.id] - 1))}>-</button>
            <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--assess-primary)' }}>{answers[q.id]}</span>
            <button className="btn-assess btn-assess-secondary" onClick={() => handleChange(q.id, Math.min(q.max, answers[q.id] + 1))}>+</button>
          </div>
        )}

        {q.type === 'radio' && (
          <div className="assess-options-grid">
            {q.options.map(opt => (
              <div 
                key={opt} 
                className={`assess-option-card ${answers[q.id] === opt ? 'selected' : ''}`}
                onClick={() => handleChange(q.id, opt)}
              >
                {opt}
              </div>
            ))}
          </div>
        )}

        {q.type === 'multi' && (
          <div className="assess-options-grid">
            {q.options.map(opt => {
              const isSelected = answers[q.id].includes(opt);
              const toggleOpt = () => {
                if (opt === 'Neither') {
                  handleChange(q.id, ['Neither']);
                  return;
                }
                if (opt === 'Both') {
                  handleChange(q.id, ['Smoke', 'Drink', 'Both']);
                  return;
                }
                let newArr = answers[q.id].filter(i => i !== 'Neither' && i !== 'Both');
                if (isSelected) newArr = newArr.filter(i => i !== opt);
                else newArr.push(opt);
                handleChange(q.id, newArr);
              };
              return (
                <div 
                  key={opt} 
                  className={`assess-option-card ${isSelected ? 'selected' : ''}`}
                  onClick={toggleOpt}
                >
                  {opt}
                </div>
              );
            })}
          </div>
        )}

        {q.type === 'textarea' && (
          <textarea 
            className="assess-input" 
            rows="3" 
            value={answers[q.id]}
            onChange={(e) => handleChange(q.id, e.target.value)}
          ></textarea>
        )}

        {q.type === 'conditional' && (
          <div>
            <div className="assess-options-grid" style={{ marginBottom: '1rem' }}>
              <div className={`assess-option-card ${answers[q.id] === 'Yes' ? 'selected' : ''}`} onClick={() => handleChange(q.id, 'Yes')}>Yes</div>
              <div className={`assess-option-card ${answers[q.id] === 'No' ? 'selected' : ''}`} onClick={() => handleChange(q.id, 'No')}>No</div>
            </div>
            {answers[q.id] === 'Yes' && (
              <input 
                type="text" 
                className="assess-input" 
                placeholder={q.subText}
                value={answers.supplementsDetails}
                onChange={(e) => handleChange('supplementsDetails', e.target.value)}
              />
            )}
          </div>
        )}

      </div>

      <div style={{ marginTop: '2rem', textAlign: 'right' }}>
        <button className="btn-assess btn-assess-primary" onClick={handleNextQ}>
          {currentQIndex === QUESTIONS.length - 1 ? 'Finish Module' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};

export default Module1Lifestyle;
