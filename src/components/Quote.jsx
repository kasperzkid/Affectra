import React from 'react';
import './Quote.css';

const Quote = () => {
  return (
    <section className="quote-section">
      <div className="bg-graphic graphic-quote"></div>
      <div className="container relative">
        <div className="quote-card glass-panel animate-fade-in">
          <svg className="quote-icon" width="48" height="48" viewBox="0 0 24 24" fill="var(--accent-blue)" stroke="var(--primary-blue)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
          <p className="quote-text">
            "In the next few days, we'll have a period of magnificent transformation because we are bringing the gap and missing puzzle for healthcare"
          </p>
          <div className="quote-author">
            <strong>Affectra Leadership</strong>
            <span>Vision 2026</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Quote;
