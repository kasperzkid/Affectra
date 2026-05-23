import React, { useState, useRef, useEffect } from 'react';

const SENTENCES = [
  "I feel healthy and ready to take on the day with full energy.",
  "Sometimes I struggle with my thoughts and need a moment to pause.",
  "My name is [say your name], and today I am feeling [say your mood]."
];

const Module6Speech = ({ saveData, initialData, onNext }) => {
  const [round, setRound] = useState(0);
  const [stage, setStage] = useState('ready'); // ready, recording, analyzing
  const [errorMsg, setErrorMsg] = useState('');
  const [results, setResults] = useState([]);

  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const animationRef = useRef(null);
  const audioChunksRef = useRef([]);
  const trackRef = useRef(null);

  // Stats accumulators for current recording
  const statsRef = useRef({
    pitches: [],
    volumes: [],
    silenceFrames: 0,
    startTime: 0,
  });

  useEffect(() => {
    return () => {
      stopAllMedia();
    };
  }, []);

  const stopAllMedia = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (trackRef.current) {
      trackRef.current.stop();
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
  };

  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = 'var(--assess-bg)';
      ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = 'var(--assess-primary)';
      ctx.beginPath();

      const sliceWidth = width * 1.0 / bufferLength;
      let x = 0;

      // Real-time analysis for pitch and volume
      let sumSquares = 0;
      let zeroCrossings = 0;
      let lastVal = 128;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * height / 2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x += sliceWidth;

        // Analytics maths
        const normalized = (dataArray[i] - 128) / 128.0;
        sumSquares += normalized * normalized;
        
        if ((lastVal >= 128 && dataArray[i] < 128) || (lastVal < 128 && dataArray[i] >= 128)) {
          zeroCrossings++;
        }
        lastVal = dataArray[i];
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Update stats if recording
      if (stage === 'recording') {
        const rms = Math.sqrt(sumSquares / bufferLength);
        statsRef.current.volumes.push(rms);
        
        if (rms < 0.02) {
          statsRef.current.silenceFrames++;
        } else {
          // Rough zero-crossing pitch estimate
          const sampleRate = audioContextRef.current.sampleRate;
          const pitchFreq = (sampleRate / bufferLength) * (zeroCrossings / 2);
          if (pitchFreq > 50 && pitchFreq < 1000) {
             statsRef.current.pitches.push(pitchFreq);
          }
        }
      }
    };
    draw();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      trackRef.current = stream.getTracks()[0];
      
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      source.connect(analyserRef.current);

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = processRecording;

      statsRef.current = { pitches: [], volumes: [], silenceFrames: 0, startTime: Date.now() };
      
      mediaRecorderRef.current.start();
      setStage('recording');
      setErrorMsg('');
      drawWaveform();

    } catch (err) {
      console.error(err);
      setErrorMsg('Microphone access denied or unavailable. Please check permissions.');
    }
  };

  const stopRecording = () => {
    setStage('analyzing');
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const processRecording = () => {
    const s = statsRef.current;
    const durationSec = (Date.now() - s.startTime) / 1000;
    
    const avgPitch = s.pitches.length > 0 ? s.pitches.reduce((a,b)=>a+b,0) / s.pitches.length : 0;
    const pitchVariance = s.pitches.length > 0 ? s.pitches.reduce((a,b)=>a+Math.pow(b-avgPitch,2),0) / s.pitches.length : 0;
    
    const avgVolume = s.volumes.length > 0 ? s.volumes.reduce((a,b)=>a+b,0) / s.volumes.length : 0;
    const volumeVariance = s.volumes.length > 0 ? s.volumes.reduce((a,b)=>a+Math.pow(b-avgVolume,2),0) / s.volumes.length : 0;
    
    // Rough estimate: Assuming reading the sentence took the whole active time
    const activeSec = durationSec - (s.silenceFrames * (2048 / 44100)); // approx frame duration
    const words = SENTENCES[round].split(' ').length;
    const wpm = activeSec > 0 ? (words / activeSec) * 60 : 0;

    const roundData = {
      avgPitch: Math.round(avgPitch),
      pitchVariance: Math.round(Math.sqrt(pitchVariance)),
      speakingPaceWpm: Math.round(wpm),
      volumeConsistency: Math.round(100 - (volumeVariance * 1000)), // arbitrary scale
      pauseFrames: s.silenceFrames
    };

    setResults(prev => [...prev, roundData]);
    
    setTimeout(() => {
      if (round < 2) {
        setRound(r => r + 1);
        setStage('ready');
      } else {
        finishModule([...results, roundData]);
      }
    }, 1500); // Fake analyzing delay for UI effect
  };

  const finishModule = (finalResults) => {
    // Aggregate results
    let sumPitch = 0, sumVar = 0, sumPace = 0, sumVol = 0, totalPauses = 0;
    finalResults.forEach(r => {
      sumPitch += r.avgPitch;
      sumVar += r.pitchVariance;
      sumPace += r.speakingPaceWpm;
      sumVol += r.volumeConsistency;
      totalPauses += r.pauseFrames;
    });

    saveData({
      avgPitch: Math.round(sumPitch / 3),
      pitchVariance: Math.round(sumVar / 3),
      speakingPace: Math.round(sumPace / 3),
      volumeConsistency: Math.round(sumVol / 3),
      pauseCount: totalPauses
    });
    onNext();
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h2 className="module-title">Speech & Vocal Analysis</h2>
        <p className="module-subtitle">Press record and read the sentence clearly. Speak naturally.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2rem 0' }}>
        
        <div style={{
          fontSize: '1.4rem',
          fontWeight: '600',
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: 'var(--assess-card-bg)',
          borderRadius: '16px',
          width: '100%',
          marginBottom: '2rem',
          minHeight: '120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {SENTENCES[round]}
        </div>

        {errorMsg && <div style={{ color: 'red', marginBottom: '1rem' }}>{errorMsg}</div>}

        <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem' }}>
          {stage === 'recording' && (
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundColor: 'rgba(234, 67, 53, 0.2)',
              animation: 'pulse 1s infinite'
            }}></div>
          )}
          
          <button 
            onClick={stage === 'recording' ? stopRecording : startRecording}
            disabled={stage === 'analyzing'}
            style={{
              width: '80px', height: '80px', borderRadius: '50%',
              border: 'none', cursor: stage === 'analyzing' ? 'not-allowed' : 'pointer',
              backgroundColor: stage === 'recording' ? '#EA4335' : (stage === 'analyzing' ? '#ccc' : 'var(--assess-primary)'),
              color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)', zIndex: 2, transition: 'all 0.3s'
            }}
          >
            {stage === 'recording' ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"></rect></svg>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
            )}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '1rem', fontWeight: 'bold', color: stage === 'analyzing' ? 'var(--assess-primary)' : 'var(--assess-text-muted)' }}>
          {stage === 'ready' && 'Ready to record'}
          {stage === 'recording' && 'Recording... Click stop when done'}
          {stage === 'analyzing' && 'Analyzing vocal patterns...'}
        </div>

        <canvas 
          ref={canvasRef} 
          width="400" 
          height="100" 
          style={{ 
            backgroundColor: 'var(--assess-bg)', 
            borderRadius: '8px', 
            border: '1px solid var(--assess-border)',
            opacity: stage === 'ready' ? 0.3 : 1
          }} 
        />
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'right' }}>
        <button className="btn-assess btn-assess-secondary" onClick={() => onNext()}>
          Skip Module
        </button>
      </div>
    </div>
  );
};

export default Module6Speech;
