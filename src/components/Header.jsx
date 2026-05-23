import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import logo from './logo.jpg';

import { updateUser } from '../utils/dataStore';

const Header = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`, {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}`, Accept: 'application/json' }
        });
        const profile = await res.json();
        
        updateUser({
          name: profile.name || profile.given_name || 'Google User',
          email: profile.email,
          picture: profile.picture
        });
        
        setShowSignUp(false);
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to fetch Google profile', err);
        // Fallback
        setShowSignUp(false);
        navigate('/dashboard');
      }
    },
    onError: (error) => console.error('Google Login Error:', error)
  });


  return (
    <header className="header">
      <div className="container header-content">
        <div className="logo">
          <img src={logo} alt="Affectra Logo" className="logo-img" />
        </div>
        <nav className="nav">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About us</a></li>
            <li><a href="#service">Service</a></li>
            <li><a href="#blogs">Blogs</a></li>
            <li><a href="#contact">Contact us</a></li>
            <li>
              <button onClick={() => setShowSignUp(true)} className="nav-signup-btn">
                Sign Up 
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginLeft: '6px', verticalAlign: 'text-bottom'}}>
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {showSignUp && (
        <div className="modal-overlay" onClick={() => setShowSignUp(false)}>
          <div className="modal-content glass-panel animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowSignUp(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="modal-header">
              <h2>Join Affectra</h2>
              <p>Create an account to access premium health operator features.</p>
            </div>

            <button type="button" className="btn-google" onClick={() => loginWithGoogle()}>
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>

            <div className="modal-divider">
              <span>or sign up with email</span>
            </div>

            <form onSubmit={(e) => { 
              e.preventDefault(); 
              setShowSignUp(false); 
              navigate('/dashboard'); 
            }} className="signup-form">
              <div className="form-group">
                <label>Name</label>
                <input type="text" placeholder="John Doe" required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="john@affectra.com" required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="••••••••" required />
              </div>
              <div className="form-checkbox">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">I agree to the Terms of Service & Privacy Policy</label>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Create Account</button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
