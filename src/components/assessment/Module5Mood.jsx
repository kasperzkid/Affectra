import React, { useState } from 'react';

const SCENARIOS = [
  "You wake up on a Monday morning. How do you feel about the day ahead?",
  "A close friend cancels plans with you last minute. Your reaction?",
  "You finish a task you've been putting off for a week. How do you feel?",
  "You receive unexpected criticism from someone you respect. Your mood?",
  "You have a completely free evening with no obligations. How does that feel?",
  "You haven't slept well for 3 nights in a row. Rate your current mood."
];

const MOODS = [
  { value: 1, icon: '😞', label: 'Very Low', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
  { value: 2, icon: '😕', label: 'Low', gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)' },
  { value: 3, icon: '😐', label: 'Neutral', gradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' },
  { value: 4, icon: '🙂', label: 'Good', gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' },
  { value: 5, icon: '😄', label: 'Excellent', gradient: 'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)' }
];

const Module5Mood = ({ saveData, initialData, onNext }) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [scores, setScores] = useState([]);
  const [hoveredMood, setHoveredMood] = useState(null);

  const handleSelectMood = (value) => {
    const newScores = [...scores, value];
    
    if (currentScenarioIndex < SCENARIOS.length - 1) {
      setScores(newScores);
      setCurrentScenarioIndex(prev => prev + 1);
    } else {
      // Finished
      const finalScores = newScores;
      const sum = finalScores.reduce((a, b) => a + b, 0);
      const avg = sum / finalScores.length;
      const lowest = Math.min(...finalScores);
      
      const variance = finalScores.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / finalScores.length;

      saveData({
        moodScores: finalScores,
        averageMood: Number(avg.toFixed(2)),
        lowestMood: lowest,
        moodVariance: Number(variance.toFixed(2))
      });
      onNext();
    }
  };

  const currentBg = hoveredMood 
    ? MOODS.find(m => m.value === hoveredMood).gradient 
    : 'var(--assess-bg)';

  return (
    <div className="module-container" style={{ 
      background: currentBg, 
      margin: '-3rem', 
      padding: '3rem', 
      borderRadius: 'var(--assess-radius)',
      minHeight: '400px',
      transition: 'background 0.5s ease'
    }}>
      <div className="module-header">
        <h2 className="module-title" style={{ color: hoveredMood ? '#333' : 'var(--assess-text-main)' }}>Mood & Emotional State</h2>
        <p className="module-subtitle" style={{ color: hoveredMood ? '#555' : 'var(--assess-text-muted)' }}>
          Scenario {currentScenarioIndex + 1} of {SCENARIOS.length}
        </p>
      </div>

      <div className="assess-form-group" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h3 
          key={currentScenarioIndex} 
          className="animate-fade-up" 
          style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '3rem', minHeight: '60px', color: hoveredMood ? '#222' : 'var(--assess-text-main)' }}
        >
          {SCENARIOS[currentScenarioIndex]}
        </h3>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {MOODS.map(mood => (
            <div 
              key={mood.value}
              onMouseEnter={() => setHoveredMood(mood.value)}
              onMouseLeave={() => setHoveredMood(null)}
              onClick={() => handleSelectMood(mood.value)}
              style={{
                width: '100px',
                height: '120px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: hoveredMood === mood.value ? '0 10px 25px rgba(0,0,0,0.1)' : '0 4px 10px rgba(0,0,0,0.05)',
                transform: hoveredMood === mood.value ? 'translateY(-10px)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              <div style={{ fontSize: '3.5rem', transition: 'transform 0.2s', transform: hoveredMood === mood.value ? 'scale(1.2)' : 'none' }}>
                {mood.icon}
              </div>
              <div style={{ 
                marginTop: '10px', 
                fontWeight: '600', 
                fontSize: '0.9rem', 
                color: '#444',
                opacity: hoveredMood === mood.value ? 1 : 0,
                transition: 'opacity 0.2s'
              }}>
                {mood.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Module5Mood;
