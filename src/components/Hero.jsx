import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section id="home" className="hero container animate-fade-in">
      <div className="hero-text">
        <div className="badge glass-panel">Modern Healthcare System</div>
        <h1 className="gradient-text">Next-Generation Healthcare System</h1>
        <p className="subheading">Experience a new era of digital healthcare with proactive support, seamless integration, and state-of-the-art medical operations.</p>
        <div className="hero-cta">
          <button className="btn-primary">Get Started Now</button>
          <a href="#service" className="btn-outline">Our Services</a>
        </div>
      </div>
      <div className="hero-image">
        <div className="circle-collage">
          <div className="bg-graphic graphic-hero"></div>
          <div className="main-circle glass-panel">
             {/* Stylish SVG medical placeholders */}
             <div className="img-placeholder img-1">
               <svg viewBox="0 0 100 100" className="placeholder-svg">
                 <path d="M10,50 L35,50 L42,30 L48,70 L55,40 L60,55 L65,50 L90,50" fill="none" stroke="var(--primary-blue)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                 <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary-blue)" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
               </svg>
               <span className="placeholder-text-tag">Pulse Line</span>
             </div>
             
             <div className="img-placeholder img-2">
               <svg viewBox="0 0 100 100" className="placeholder-svg">
                 <path d="M30,50 L70,50 M50,30 L50,70" fill="none" stroke="var(--secondary-blue)" strokeWidth="5" strokeLinecap="round" />
                 <circle cx="50" cy="50" r="35" fill="none" stroke="var(--secondary-blue)" strokeWidth="2" strokeDasharray="4 4" />
                 <circle cx="50" cy="50" r="45" fill="none" stroke="var(--secondary-blue)" strokeWidth="1" opacity="0.2" />
               </svg>
               <span className="placeholder-text-tag">Core Care</span>
             </div>
             
             <div className="img-placeholder img-3">
               <svg viewBox="0 0 100 100" className="placeholder-svg">
                 <path d="M30,25 C50,20 50,20 70,25 C70,50 50,75 50,75 C50,75 30,50 30,25 Z" fill="none" stroke="var(--primary-blue)" strokeWidth="3" strokeLinejoin="round"/>
                 <path d="M50,35 C50,35 45,30 40,35 C35,40 45,50 50,55 C55,50 65,40 60,35 C55,30 50,35 50,35 Z" fill="var(--primary-blue)" />
               </svg>
               <span className="placeholder-text-tag">Security</span>
             </div>
          </div>
          
          <div className="floating-card glass-panel stats-card">
            <div className="stats-number">10k+</div>
            <div className="stats-text">Patients Served</div>
          </div>
          
          <div className="floating-dots">
             <span className="dot dot-animate-1"></span>
             <span className="dot dot-animate-2"></span>
             <span className="dot dot-animate-3"></span>
             <span className="dot dot-animate-4"></span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
