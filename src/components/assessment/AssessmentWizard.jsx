import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Assessment.css';

// We will create these modules in subsequent steps
import Module1Lifestyle from './Module1Lifestyle';
import Module2Typing from './Module2Typing';
import Module3Puzzle from './Module3Puzzle';
import Module4Vision from './Module4Vision';
import Module5Mood from './Module5Mood';
import Module6Speech from './Module6Speech';
import Module7Medical from './Module7Medical';
import Module8Psych from './Module8Psych';
import AssessmentResults from './AssessmentResults';

const MODULES = [
  { id: 1, name: 'Daily Lifestyle', component: Module1Lifestyle },
  { id: 2, name: 'Emotional Expression', component: Module2Typing },
  { id: 3, name: 'Motor Coordination', component: Module3Puzzle },
  { id: 4, name: 'Vision & Focus', component: Module4Vision },
  { id: 5, name: 'Mood Assessment', component: Module5Mood },
  { id: 6, name: 'Speech Analysis', component: Module6Speech },
  { id: 7, name: 'Medical History', component: Module7Medical },
  { id: 8, name: 'Psychological Eval', component: Module8Psych },
];

const AssessmentWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0); // 0-7 for modules, 8 for results
  
  // Master JSON state holding all data for the final API call
  const [assessmentData, setAssessmentData] = useState({
    lifestyle: null,
    typing: null,
    motor: null,
    vision: null,
    mood: null,
    speech: null,
    medical: null,
    psych: null
  });

  const handleNext = () => {
    if (currentStep < MODULES.length) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    } else {
      navigate('/dashboard');
    }
  };

  const saveData = (moduleKey, data) => {
    setAssessmentData(prev => ({
      ...prev,
      [moduleKey]: data
    }));
  };

  // Calculate progress percentage
  const progressPercentage = currentStep === MODULES.length 
    ? 100 
    : ((currentStep) / MODULES.length) * 100;

  // Render the Results screen if we are past the last module
  if (currentStep === MODULES.length) {
    return <AssessmentResults data={assessmentData} onRestart={() => setCurrentStep(0)} />;
  }

  const CurrentModuleComponent = MODULES[currentStep].component;
  const currentModuleKey = Object.keys(assessmentData)[currentStep];

  return (
    <div className="assessment-layout">
      {/* Progress Bar */}
      <div className="assessment-progress-container">
        <div 
          className="assessment-progress-bar" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="assessment-main">
        {/* Floating Sidebar */}
        <aside className="assessment-sidebar">
          <div className="assessment-sidebar-title">Health Optimizer</div>
          <ul className="assessment-nav-list">
            {MODULES.map((mod, index) => {
              let statusClass = '';
              if (index === currentStep) statusClass = 'active';
              else if (index < currentStep) statusClass = 'completed';

              return (
                <li key={mod.id} className={`assessment-nav-item ${statusClass}`}>
                  <div className="nav-status-icon">
                    {index < currentStep ? '✓' : mod.id}
                  </div>
                  <span>{mod.name}</span>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Content Area */}
        <div className="assessment-content-wrapper">
          <div className="assessment-card">
            {/* Render the current module, passing down saveData callback and existing data */}
            <CurrentModuleComponent 
              saveData={(data) => saveData(currentModuleKey, data)}
              initialData={assessmentData[currentModuleKey]}
              onNext={handleNext}
            />

            {/* Navigation Footer */}
            <div className="assessment-footer">
              <button className="btn-assess btn-assess-secondary" onClick={handleBack}>
                {currentStep === 0 ? 'Exit' : 'Back'}
              </button>
              <button 
                className="btn-assess btn-assess-primary" 
                onClick={handleNext}
                // We could disable this until current module is valid, 
                // but for now we let users skip or we let modules trigger onNext directly.
              >
                {currentStep === MODULES.length - 1 ? 'Analyze Results' : 'Next Step'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentWizard;
