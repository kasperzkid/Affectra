import React from 'react';
import './Service.css';

const Service = () => {
  return (
    <section id="service" className="service-section">
      <div className="bg-graphic graphic-right"></div>
      <div className="container service-container animate-fade-in">
        <div className="service-header">
          <h2 className="section-title">Behavioral Testing Services</h2>
          <p className="section-subtitle">Empowering patients and clinicians with evidence-based diagnostics for behavioral health and cognitive performance.</p>
        </div>
        <div className="service-grid">
          {[
            {
              title: 'Mental Health Test',
              desc: 'Comprehensive evaluation methodologies to screen for psychological wellness and personality stability indices.',
              icon: <><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></>
            },
            {
              title: 'Eye Strength Diagnostics',
              desc: 'Testing visual stamina, eye strain indexes, tracking, and optical fatigue to evaluate overall visual health.',
              icon: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
            },
            {
              title: 'Voice Health Analysis',
              desc: 'Acoustic monitoring of vocal properties to detect fatigue, respiratory strength, and psychological fluctuations.',
              icon: <><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></>
            },
            {
              title: 'Nervousness & Anxiety',
              desc: 'Standardized assessment programs targeting emotional turbulence, panic indicators, and somatic anxiety patterns.',
              icon: <><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></>
            },
            {
              title: 'Stress Screenings',
              desc: 'Physiological diagnostics and behavioral trackers designed to measure chronic cortisol indicators and acute stress.',
              icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>
            }
          ].map((srv, idx) => (
            <div key={idx} className="service-card glass-panel">
              <div className="service-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {srv.icon}
                </svg>
              </div>
              <h3>{srv.title}</h3>
              <p>{srv.desc}</p>
              <a href="#" className="read-more">Learn more <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Service;
