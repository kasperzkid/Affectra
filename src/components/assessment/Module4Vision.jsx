import React, { useState, useEffect } from 'react';

const PHRASES = [
  "The quick brown fox jumps over the lazy dog",
  "Health is the greatest wealth",
  "Clear vision leads to clear thinking",
  "Every breath is a new beginning",
  "Focus brings clarity to complexity",
  "A healthy mind in a healthy body",
  "Consistency is the key to success"
];

// Helper to shuffle phrases
const getShuffledPhrases = () => {
  return [...PHRASES].sort(() => 0.5 - Math.random()).slice(0, 5);
};

// Calculate Levenshtein distance-based accuracy
const calculateAccuracy = (target, input) => {
  const t = target.toLowerCase().trim();
  const i = input.toLowerCase().trim();
  if (t === i) return 100;
  
  let matches = 0;
  for (let j = 0; j < Math.max(t.length, i.length); j++) {
    if (t[j] === i[j]) matches++;
  }
  return Math.round((matches / Math.max(t.length, 1)) * 100);
};

const BLUR_LEVELS = [0, 2, 4, 6, 8]; // 5 rounds

const Module4Vision = ({ saveData, initialData, onNext }) => {
  const [round, setRound] = useState(0); // 0 to 4
  const [phrases, setPhrases] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [results, setResults] = useState([]);
  const [isTestActive, setIsTestActive] = useState(false);

  useEffect(() => {
    setPhrases(getShuffledPhrases());
  }, []);

  const handleNextRound = () => {
    if (!isTestActive) {
      setIsTestActive(true);
      return;
    }

    const currentPhrase = phrases[round];
    const accuracy = calculateAccuracy(currentPhrase, userInput);
    const blurLevel = BLUR_LEVELS[round];

    const newResults = [...results, { blurLevel, accuracy }];
    
    if (round < 4) {
      setResults(newResults);
      setRound(r => r + 1);
      setUserInput('');
    } else {
      // Test complete
      const finalResults = newResults;
      let maxPassed = 0;
      let sumAccuracy = 0;
      
      finalResults.forEach(r => {
        sumAccuracy += r.accuracy;
        if (r.accuracy >= 80) maxPassed = Math.max(maxPassed, r.blurLevel);
      });

      saveData({
        roundResults: finalResults,
        maxBlurPassedAt: maxPassed,
        averageAccuracy: Math.round(sumAccuracy / 5)
      });
      onNext();
    }
  };

  return (
    <div className="module-container" style={{
      backgroundColor: isTestActive ? '#050a10' : 'transparent', // Dark room aesthetic
      margin: '-3rem', // Override parent padding to fill card
      padding: '3rem',
      borderRadius: 'var(--assess-radius)',
      minHeight: '400px',
      color: isTestActive ? '#fff' : 'inherit',
      transition: 'background-color 1s ease, color 1s ease',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div className="module-header" style={{ borderBottom: isTestActive ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
        <h2 className="module-title" style={{ color: isTestActive ? '#fff' : 'var(--assess-text-main)' }}>Vision & Focus Test</h2>
        <p className="module-subtitle" style={{ color: isTestActive ? '#aaa' : 'var(--assess-text-muted)' }}>
          {isTestActive ? `Round ${round + 1} of 5` : 'Read the text and type exactly what you see in the field below. Do your best!'}
        </p>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        {!isTestActive ? (
          <div style={{ textAlign: 'center' }}>
            <p style={{ marginBottom: '2rem' }}>The screen will dim and present text with increasing levels of blur. Focus carefully.</p>
            <button className="btn-assess btn-assess-primary" onClick={handleNextRound}>Start Test</button>
          </div>
        ) : (
          <div style={{ width: '100%', maxWidth: '600px' }} className="animate-fade-up">
            <div style={{
              backgroundColor: '#fff',
              color: '#000',
              padding: '2.5rem',
              borderRadius: '16px',
              textAlign: 'center',
              marginBottom: '2rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
              <p style={{
                fontSize: '1.8rem',
                fontWeight: '600',
                filter: `blur(${BLUR_LEVELS[round]}px)`,
                transition: 'filter 0.5s ease',
                userSelect: 'none' // Prevent copy-pasting
              }}>
                {phrases[round]}
              </p>
            </div>
            
            <input 
              type="text" 
              className="assess-input" 
              placeholder="Type exactly what you see..."
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleNextRound(); }}
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                color: '#fff', 
                border: '1px solid rgba(255,255,255,0.2)',
                fontSize: '1.2rem',
                textAlign: 'center'
              }}
              autoFocus
              autoComplete="off"
            />
            
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button 
                className="btn-assess btn-assess-primary" 
                onClick={handleNextRound}
                disabled={userInput.length < 3}
              >
                {round === 4 ? 'Finish Test' : 'Submit & Next Round'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Module4Vision;
