import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <section id="about" className="about-section">
      <div className="bg-graphic graphic-left"></div>
      <div className="container about-container">
        <div className="about-image animate-fade-in">
          <div className="image-wrapper">
            <div className="placeholder-doc-image">
              <svg viewBox="0 0 200 200" fill="none" className="about-placeholder-svg">
                <defs>
                  <linearGradient id="aboutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="var(--accent-blue)" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="90" fill="url(#aboutGrad)" stroke="rgba(30, 144, 255, 0.1)" strokeWidth="2" />
                <circle cx="100" cy="75" r="30" stroke="var(--primary-blue)" strokeWidth="4" fill="none" />
                <path d="M55,145 C55,120 75,110 100,110 C125,110 145,120 145,145" stroke="var(--primary-blue)" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M85,110 C85,130 115,130 115,110" stroke="var(--secondary-blue)" strokeWidth="3" fill="none" />
                <path d="M85,110 L80,105 M115,110 L120,105" stroke="var(--secondary-blue)" strokeWidth="3" fill="none" />
              </svg>
              <span className="placeholder-label">Affectra Specialist</span>
            </div>
            <div className="glass-decorator glass-1">
              <svg viewBox="0 0 100 100" fill="none" stroke="var(--primary-blue)" strokeWidth="3">
                <path d="M20,50 L40,50 L48,25 L52,75 L60,40 L65,55 L70,50 L90,50" />
              </svg>
            </div>
            <div className="glass-decorator glass-2">
              <span className="decorator-badge">Verified Operator</span>
            </div>
          </div>
        </div>
        <div className="about-text animate-fade-in" style={{animationDelay: '0.2s'}}>
          <h2 className="section-title">About Us</h2>
          <p className="about-desc">
            Affectra healthcare is a hospital operator that helps encourage companies to think differently about health care business models that have begun to change radically and prepare companies for future businesses in order to compete fairly in an increasingly complex health care market. With a continuous focus on research and development we make:
          </p>
          
          <div className="services-list">
            <div className="service-item glass-panel">
              <div className="icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
              </div>
              <p>Business development with latest digital technology</p>
            </div>
            <div className="service-item glass-panel">
              <div className="icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <p>Provides active assistance in management and market access</p>
            </div>
            <div className="service-item glass-panel">
              <div className="icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <p>Licensing services to drug and supporting equipment</p>
            </div>
            <div className="service-item glass-panel">
              <div className="icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
              </div>
              <p>We provide hospital operator service</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
