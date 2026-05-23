import React, { useState, useEffect, useRef } from 'react';
import { saveAssessmentResult } from '../utils/dataStore';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const SYSTEM_PROMPT = `You are a clinical health analyst AI. You will receive structured health assessment data from 8 modules: lifestyle habits, typing behavior, motor coordination, vision, mood, speech, medical history, and psychological evaluation. Analyze all data holistically and return a detailed health report in this EXACT JSON format with no markdown, no backticks, just raw JSON:
{
  "overallScore": 0,
  "physicalHealth": { "score": 0, "summary": "", "flags": [], "recommendations": [] },
  "mentalHealth": { "score": 0, "summary": "", "flags": [], "recommendations": [] },
  "cognitivePerformance": { "score": 0, "summary": "", "flags": [], "recommendations": [] },
  "lifestyleScore": { "score": 0, "summary": "", "flags": [], "recommendations": [] },
  "urgentAlerts": [],
  "topRecommendations": [],
  "positiveHighlights": [],
  "disclaimer": "This is not a medical diagnosis."
}`;

// Animated circular gauge
const ScoreGauge = ({ score, size = 200, strokeWidth = 14, color = '#0FA3B1' }) => {
  const [animated, setAnimated] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const getColor = (s) => s >= 75 ? '#34A853' : s >= 50 ? '#FBBC05' : '#EA4335';

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#E2E8F0" strokeWidth={strokeWidth} />
        <circle
          cx={size/2} cy={size/2} r={radius} fill="none"
          stroke={getColor(score)} strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 2s ease-in-out' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: size * 0.22, fontWeight: 800, color: getColor(score) }}>{score}</span>
        <span style={{ fontSize: size * 0.09, color: '#5a6b82', fontWeight: 500 }}>/ 100</span>
      </div>
    </div>
  );
};

// Mini score bar
const ScoreBar = ({ score }) => {
  const [width, setWidth] = useState(0);
  const color = score >= 75 ? '#34A853' : score >= 50 ? '#FBBC05' : '#EA4335';
  useEffect(() => { setTimeout(() => setWidth(score), 200); }, [score]);
  return (
    <div style={{ backgroundColor: '#E2E8F0', borderRadius: '4px', height: '8px', overflow: 'hidden', marginTop: '0.5rem' }}>
      <div style={{ height: '100%', width: `${width}%`, backgroundColor: color, borderRadius: '4px', transition: 'width 1.5s ease-in-out' }}></div>
    </div>
  );
};

// Category card
const CategoryCard = ({ title, icon, data }) => {
  const [expanded, setExpanded] = useState(false);
  const color = data.score >= 75 ? '#34A853' : data.score >= 50 ? '#FBBC05' : '#EA4335';

  return (
    <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>{icon}</span>
            <div>
              <div style={{ fontWeight: 700, color: '#0A1628', fontSize: '1.05rem' }}>{title}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{data.score}<span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#5a6b82' }}>/100</span></div>
            </div>
          </div>
          <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '0.85rem', color: '#5a6b82' }}>
            {expanded ? 'Less ▲' : 'Details ▼'}
          </button>
        </div>
        <ScoreBar score={data.score} />
        <p style={{ marginTop: '0.8rem', fontSize: '0.9rem', color: '#5a6b82', lineHeight: 1.5 }}>{data.summary}</p>
      </div>
      {expanded && (
        <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid #F4F6F9' }}>
          {data.flags?.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 600, color: '#EA4335', marginBottom: '0.5rem', fontSize: '0.9rem' }}>⚠ Flags</div>
              {data.flags.map((f, i) => <div key={i} style={{ fontSize: '0.9rem', color: '#5a6b82', padding: '0.3rem 0', borderBottom: '1px solid #F4F6F9' }}>{f}</div>)}
            </div>
          )}
          {data.recommendations?.length > 0 && (
            <div>
              <div style={{ fontWeight: 600, color: '#0FA3B1', marginBottom: '0.5rem', fontSize: '0.9rem' }}>📋 Recommendations</div>
              {data.recommendations.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.9rem', color: '#5a6b82', padding: '0.4rem 0', borderBottom: '1px solid #F4F6F9' }}>
                  <span style={{ color: '#0FA3B1', fontWeight: 700 }}>{i+1}.</span>{r}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AssessmentResults = ({ data, onRestart }) => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    callOpenRouter();
  }, []);

  const callOpenRouter = async () => {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://affectra.health',
          'X-Title': 'Health Optimizer'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-001',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: JSON.stringify(data) }
          ],
          temperature: 0.3
        })
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const json = await response.json();
      const raw = json.choices[0].message.content;

      // Strip any accidental markdown code fences
      const cleaned = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setResults(parsed);
      
      // Save the result to our local database
      saveAssessmentResult(parsed);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!results) return;
    const text = `AFFECTRA HEALTH REPORT
========================
Overall Score: ${results.overallScore}/100

PHYSICAL HEALTH (${results.physicalHealth.score}/100)
${results.physicalHealth.summary}

MENTAL HEALTH (${results.mentalHealth.score}/100)
${results.mentalHealth.summary}

COGNITIVE PERFORMANCE (${results.cognitivePerformance.score}/100)
${results.cognitivePerformance.summary}

LIFESTYLE SCORE (${results.lifestyleScore.score}/100)
${results.lifestyleScore.summary}

TOP RECOMMENDATIONS:
${results.topRecommendations.map((r, i) => `${i+1}. ${r}`).join('\n')}

POSITIVE HIGHLIGHTS:
${results.positiveHighlights.map(h => `✓ ${h}`).join('\n')}

${results.urgentAlerts?.length ? `⚠ ALERTS:\n${results.urgentAlerts.join('\n')}` : ''}

---
${results.disclaimer}
Report generated: ${new Date().toLocaleString()}`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'affectra_health_report.txt';
    a.click(); URL.revokeObjectURL(url);
  };

  // Loading screen
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F6F9', fontFamily: 'Inter, system-ui' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧬</div>
        <h2 style={{ color: '#0A1628', marginBottom: '0.5rem' }}>Analyzing Your Results</h2>
        <p style={{ color: '#5a6b82', marginBottom: '2rem' }}>Our AI is processing all 8 modules...</p>
        <div style={{ width: '200px', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden', margin: '0 auto' }}>
          <div style={{ height: '100%', backgroundColor: '#0FA3B1', borderRadius: '4px', animation: 'loadingBar 2s ease-in-out infinite' }}></div>
        </div>
        <style>{`@keyframes loadingBar { 0%{width:0%;margin-left:0} 50%{width:70%;margin-left:0} 100%{width:0%;margin-left:100%} }`}</style>
      </div>
    </div>
  );

  // Error screen
  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F6F9', fontFamily: 'Inter, system-ui' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '3rem', maxWidth: '500px', textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ color: '#EA4335' }}>Analysis Failed</h2>
        <p style={{ color: '#5a6b82', margin: '1rem 0' }}>{error}</p>
        <button className="btn-assess btn-assess-primary" onClick={callOpenRouter}>Retry</button>
        <button className="btn-assess btn-assess-secondary" onClick={onRestart} style={{ marginLeft: '1rem' }}>Restart</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F6F9', fontFamily: 'Inter, system-ui', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#0A1628', padding: '3rem 2rem', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Your Health Report</h1>
        <p style={{ color: '#8ab4f8' }}>Powered by AI — Based on your 8-module assessment</p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>

        {/* Overall Score */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '-80px 0 3rem', backgroundColor: '#fff', borderRadius: '20px', padding: '3rem', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }} className="animate-fade-up">
          <ScoreGauge score={results.overallScore} size={200} />
          <h2 style={{ marginTop: '1.5rem', color: '#0A1628', fontSize: '1.8rem' }}>Overall Health Score</h2>
          <p style={{ color: '#5a6b82', fontSize: '1.05rem', textAlign: 'center', maxWidth: '500px' }}>
            {results.overallScore >= 75 ? 'Excellent! You are in great health.' : results.overallScore >= 50 ? 'Good foundation with some areas to improve.' : 'Several areas need attention. Please consult a doctor.'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn-assess btn-assess-primary" onClick={downloadReport}>📄 Download Report</button>
            <button className="btn-assess btn-assess-secondary" onClick={onRestart}>🔄 Retake Assessment</button>
          </div>
        </div>

        {/* Category Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <CategoryCard title="Physical Health" icon="💪" data={results.physicalHealth} />
          <CategoryCard title="Mental Health" icon="🧠" data={results.mentalHealth} />
          <CategoryCard title="Cognitive Performance" icon="⚡" data={results.cognitivePerformance} />
          <CategoryCard title="Lifestyle Score" icon="🌿" data={results.lifestyleScore} />
        </div>

        {/* Urgent Alerts */}
        {results.urgentAlerts?.length > 0 && (
          <div style={{ backgroundColor: '#FFF5F5', border: '1px solid #FED7D7', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#EA4335', marginBottom: '1rem' }}>🚨 Urgent Alerts</h3>
            {results.urgentAlerts.map((alert, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', padding: '0.5rem 0', borderBottom: '1px solid #FED7D7', fontSize: '0.95rem', color: '#C53030' }}>
                <span>⚠</span><span>{alert}</span>
              </div>
            ))}
          </div>
        )}

        {/* Positive Highlights */}
        {results.positiveHighlights?.length > 0 && (
          <div style={{ backgroundColor: '#F0FFF4', border: '1px solid #C6F6D5', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#276749', marginBottom: '1rem' }}>✅ Your Strengths</h3>
            {results.positiveHighlights.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', padding: '0.5rem 0', borderBottom: '1px solid #C6F6D5', fontSize: '0.95rem', color: '#276749' }}>
                <span>✓</span><span>{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* Top Recommendations */}
        {results.topRecommendations?.length > 0 && (
          <div style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ color: '#0A1628', marginBottom: '1rem' }}>📋 Top Recommendations</h3>
            {results.topRecommendations.map((rec, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '0.8rem', borderRadius: '8px', backgroundColor: i % 2 === 0 ? '#F4F6F9' : '#fff', marginBottom: '0.5rem' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#0FA3B1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>{i+1}</span>
                <span style={{ fontSize: '0.95rem', color: '#0A1628', lineHeight: 1.5 }}>{rec}</span>
              </div>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <p style={{ textAlign: 'center', color: '#aaa', fontSize: '0.85rem', marginTop: '2rem' }}>{results.disclaimer}</p>
      </div>
    </div>
  );
};

export default AssessmentResults;
