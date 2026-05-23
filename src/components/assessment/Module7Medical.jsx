import React, { useState, useEffect } from 'react';

const CONDITIONS = ['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Arthritis', 'Thyroid Disorder', 'Depression', 'Anxiety', 'Epilepsy', 'Cancer', 'None of the above'];
const FAMILY_CONDITIONS = ['Heart Disease', 'Diabetes', 'Cancer', 'Mental Illness', 'Alzheimer\'s', 'Hypertension', 'None Known'];
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
const CHECKUP_OPTIONS = ['Within 3 months', '3–6 months', '6–12 months', 'Over a year ago', 'Never'];

const SectionHeader = ({ title, icon }) => (
  <div style={{ backgroundColor: '#0A1628', borderRadius: '8px 8px 0 0', padding: '1rem 1.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <span style={{ fontSize: '1.2rem' }}>{icon}</span>
    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{title}</h4>
  </div>
);

const Section = ({ title, icon, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ border: '1px solid var(--assess-border)', borderRadius: '8px', marginBottom: '1.5rem', overflow: 'hidden' }}>
      <div onClick={() => setOpen(!open)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0A1628', padding: '1rem 1.5rem', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>{icon}</span>
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{title}</h4>
        </div>
        <span style={{ transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'none' }}>▼</span>
      </div>
      {open && <div style={{ padding: '1.5rem', backgroundColor: 'var(--assess-bg)' }}>{children}</div>}
    </div>
  );
};

const CheckboxGrid = ({ options, selected, onChange }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.7rem' }}>
    {options.map(opt => {
      const isChecked = selected.includes(opt);
      return (
        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.7rem', borderRadius: '8px', border: `1px solid ${isChecked ? 'var(--assess-primary)' : 'var(--assess-border)'}`, background: isChecked ? 'rgba(15,163,177,0.08)' : 'var(--assess-card-bg)', cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.2s' }}>
          <input type="checkbox" checked={isChecked} onChange={() => {
            if (opt === 'None of the above' || opt === 'None Known') {
              onChange(isChecked ? [] : [opt]);
            } else {
              const cleared = selected.filter(s => s !== 'None of the above' && s !== 'None Known');
              onChange(isChecked ? cleared.filter(s => s !== opt) : [...cleared, opt]);
            }
          }} style={{ accentColor: 'var(--assess-primary)' }} />
          {opt}
        </label>
      );
    })}
  </div>
);

const Module7Medical = ({ saveData, initialData, onNext }) => {
  const [data, setData] = useState(initialData || {
    personalInfo: { age: '', sex: '', height: '', weight: '', bloodType: '' },
    conditions: [],
    medications: '',
    hasSurgery: 'No',
    surgeryDetails: '',
    familyHistory: [],
    allergies: [],
    lastCheckup: ''
  });
  const [allergyInput, setAllergyInput] = useState('');

  useEffect(() => { saveData(data); }, [data, saveData]);

  const update = (key, value) => setData(prev => ({ ...prev, [key]: value }));
  const updatePersonal = (key, value) => setData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, [key]: value } }));
  const addAllergy = (e) => {
    if (e.key === 'Enter' && allergyInput.trim()) {
      update('allergies', [...data.allergies, allergyInput.trim()]);
      setAllergyInput('');
    }
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h2 className="module-title">Medical History</h2>
        <p className="module-subtitle">Your information is stored locally and never shared.</p>
      </div>

      <div style={{ overflowY: 'auto', maxHeight: '60vh', paddingRight: '0.5rem' }}>

        {/* Personal Info */}
        <Section title="Personal Information" icon="👤">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="assess-label" style={{ fontSize: '0.9rem' }}>Age</label>
              <input type="number" className="assess-input" value={data.personalInfo.age} onChange={e => updatePersonal('age', e.target.value)} placeholder="e.g. 28" />
            </div>
            <div>
              <label className="assess-label" style={{ fontSize: '0.9rem' }}>Biological Sex</label>
              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                {['Male', 'Female', 'Other'].map(s => (
                  <div key={s} className={`assess-option-card ${data.personalInfo.sex === s ? 'selected' : ''}`} style={{ padding: '0.6rem 1rem', flex: 1 }} onClick={() => updatePersonal('sex', s)}>{s}</div>
                ))}
              </div>
            </div>
            <div>
              <label className="assess-label" style={{ fontSize: '0.9rem' }}>Height (cm)</label>
              <input type="number" className="assess-input" value={data.personalInfo.height} onChange={e => updatePersonal('height', e.target.value)} placeholder="e.g. 175" />
            </div>
            <div>
              <label className="assess-label" style={{ fontSize: '0.9rem' }}>Weight (kg)</label>
              <input type="number" className="assess-input" value={data.personalInfo.weight} onChange={e => updatePersonal('weight', e.target.value)} placeholder="e.g. 70" />
            </div>
            <div>
              <label className="assess-label" style={{ fontSize: '0.9rem' }}>Blood Type</label>
              <select className="assess-input" value={data.personalInfo.bloodType} onChange={e => updatePersonal('bloodType', e.target.value)}>
                <option value="">Select...</option>
                {BLOOD_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
        </Section>

        {/* Chronic Conditions */}
        <Section title="Chronic Conditions" icon="🏥">
          <CheckboxGrid options={CONDITIONS} selected={data.conditions} onChange={val => update('conditions', val)} />
        </Section>

        {/* Medications */}
        <Section title="Current Medications" icon="💊">
          <label className="assess-label" style={{ fontSize: '0.9rem' }}>List any medications you currently take (name + dosage if known)</label>
          <textarea className="assess-input" rows="3" value={data.medications} onChange={e => update('medications', e.target.value)} placeholder="e.g. Metformin 500mg, Aspirin 100mg..." />
        </Section>

        {/* Surgeries */}
        <Section title="Surgeries / Hospitalizations" icon="🔬">
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            {['Yes', 'No'].map(o => (
              <div key={o} className={`assess-option-card ${data.hasSurgery === o ? 'selected' : ''}`} style={{ flex: 1, textAlign: 'center' }} onClick={() => update('hasSurgery', o)}>{o}</div>
            ))}
          </div>
          {data.hasSurgery === 'Yes' && (
            <textarea className="assess-input" rows="2" value={data.surgeryDetails} onChange={e => update('surgeryDetails', e.target.value)} placeholder="Please describe briefly..." />
          )}
        </Section>

        {/* Family History */}
        <Section title="Family History" icon="👨‍👩‍👧">
          <CheckboxGrid options={FAMILY_CONDITIONS} selected={data.familyHistory} onChange={val => update('familyHistory', val)} />
        </Section>

        {/* Allergies */}
        <Section title="Allergies" icon="⚠️">
          <label className="assess-label" style={{ fontSize: '0.9rem' }}>Type an allergy and press Enter</label>
          <input className="assess-input" value={allergyInput} onChange={e => setAllergyInput(e.target.value)} onKeyDown={addAllergy} placeholder="e.g. Penicillin, Peanuts..." />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.8rem' }}>
            {data.allergies.map((a, i) => (
              <span key={i} style={{ padding: '0.4rem 0.8rem', backgroundColor: 'rgba(15,163,177,0.1)', border: '1px solid var(--assess-primary)', borderRadius: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {a}
                <span style={{ cursor: 'pointer', color: 'red' }} onClick={() => update('allergies', data.allergies.filter((_, j) => j !== i))}>×</span>
              </span>
            ))}
          </div>
        </Section>

        {/* Last Checkup */}
        <Section title="Last Medical Checkup" icon="📅">
          <div className="assess-options-grid">
            {CHECKUP_OPTIONS.map(opt => (
              <div key={opt} className={`assess-option-card ${data.lastCheckup === opt ? 'selected' : ''}`} onClick={() => update('lastCheckup', opt)}>{opt}</div>
            ))}
          </div>
        </Section>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'right' }}>
        <button className="btn-assess btn-assess-primary" onClick={onNext}>Next Module</button>
      </div>
    </div>
  );
};

export default Module7Medical;
