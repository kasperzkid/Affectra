import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Quote from './components/Quote';
import AboutUs from './components/AboutUs';
import Service from './components/Service';
import Blogs from './components/Blogs';
import ContactUs from './components/ContactUs';
import Dashboard from './components/Dashboard';
import './App.css';

const LandingPage = () => (
  <div className="app-container">
    {/* Background Graphic Circles */}
    <div className="bg-circle circle-top-left"></div>
    <div className="bg-circle circle-mid-right"></div>
    <div className="bg-circle circle-bottom-left"></div>
    
    <div className="blob-bg blob-1"></div>
    <div className="blob-bg blob-2"></div>
    <div className="blob-bg blob-3"></div>

    <Header />
    <main>
      <Hero />
      <Quote />
      <AboutUs />
      <Service />
      <Blogs />
      <ContactUs />
    </main>
  </div>
);

import AssessmentWizard from './components/assessment/AssessmentWizard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/assessment" element={<AssessmentWizard />} />
    </Routes>
  );
}

export default App;
