# Health Optimizer

An AI-powered health assessment dashboard that analyzes data from 8 behavioral and clinical modules and returns a holistic health report with scores, alerts, and personalized recommendations.

---

## Overview

Health Optimizer collects structured JSON data from 8 assessment modules, sends it to an AI model for clinical analysis, and renders a rich results UI with:

- An animated overall health score gauge (0–100)
- Four category score cards: Physical, Mental, Cognitive, Lifestyle
- Urgent alerts, strengths, and top recommendations
- A downloadable plain-text report

---

## Modules

The dashboard expects JSON input covering all 8 modules:

| Module | Key | What it captures |
|---|---|---|
| Lifestyle habits | `lifestyle` | Sleep, exercise, diet, smoking, alcohol, stress, hydration |
| Typing behavior | `typing` | WPM, error rate, rhythm, pause patterns |
| Motor coordination | `motor` | Reaction time, tremor index, coordination, balance |
| Vision | `vision` | Acuity, color blindness, contrast sensitivity, eye strain |
| Mood | `mood` | PHQ-9, GAD-7, energy, social engagement, variability |
| Speech | `speech` | Clarity, articulation, pace, hesitation |
| Medical history | `medical` | BMI, blood pressure, heart rate, conditions, medications |
| Psychological evaluation | `psychology` | Resilience, cognitive flexibility, memory, attention |

### Example input

```json
{
  "lifestyle": {
    "sleep_hours": 6.5,
    "exercise_days_per_week": 3,
    "diet_quality": "moderate",
    "smoking": false,
    "alcohol_units_week": 8,
    "stress_level": 7,
    "hydration_glasses": 5
  },
  "typing": {
    "wpm": 72,
    "error_rate": 0.04,
    "rhythm_consistency": 0.78,
    "pause_patterns": "normal"
  },
  "motor": {
    "reaction_time_ms": 310,
    "tremor_index": 0.12,
    "coordination_score": 82,
    "balance_test": "pass"
  },
  "vision": {
    "acuity": "20/25",
    "color_blindness": false,
    "contrast_sensitivity": "normal",
    "eye_strain_score": 6
  },
  "mood": {
    "phq9_score": 7,
    "anxiety_gad7": 9,
    "energy_level": 5,
    "social_engagement": "moderate",
    "mood_variability": "mild"
  },
  "speech": {
    "clarity_score": 88,
    "articulation": "normal",
    "pace_wpm": 145,
    "hesitation_index": 0.08
  },
  "medical": {
    "bmi": 26.4,
    "blood_pressure": "128/82",
    "resting_hr": 72,
    "known_conditions": ["mild hypertension"],
    "medications": ["lisinopril 5mg"],
    "last_checkup_months": 14
  },
  "psychology": {
    "resilience_score": 65,
    "cognitive_flexibility": 70,
    "memory_test_score": 78,
    "attention_span": "moderate"
  }
}
```

---

## API Integration

The dashboard calls an AI completions endpoint with a clinical analyst system prompt and your module JSON as the user message.

### Default setup (Anthropic API — works in claude.ai)

```javascript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: JSON.stringify(moduleData) }]
  })
});
```

### Switching to OpenRouter

Replace the fetch block with:

```javascript
const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_OPENROUTER_KEY",
    "HTTP-Referer": "your-site.com",
    "X-Title": "Health Optimizer"
  },
  body: JSON.stringify({
    model: "google/gemini-2.0-flash-001",
    max_tokens: 1000,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: JSON.stringify(moduleData) }
    ]
  })
});
```

### Response schema

The AI returns JSON in this exact shape:

```json
{
  "overallScore": 72,
  "physicalHealth": {
    "score": 68,
    "summary": "...",
    "flags": ["mild hypertension"],
    "recommendations": ["..."]
  },
  "mentalHealth": {
    "score": 61,
    "summary": "...",
    "flags": ["elevated anxiety (GAD-7: 9)"],
    "recommendations": ["..."]
  },
  "cognitivePerformance": {
    "score": 78,
    "summary": "...",
    "flags": [],
    "recommendations": ["..."]
  },
  "lifestyleScore": {
    "score": 64,
    "summary": "...",
    "flags": ["alcohol above recommended limit"],
    "recommendations": ["..."]
  },
  "urgentAlerts": [],
  "topRecommendations": ["...", "..."],
  "positiveHighlights": ["...", "..."],
  "disclaimer": "This is not a medical diagnosis."
}
```

---

## UI Features

| Element | Description |
|---|---|
| Score gauge | Animated circular arc showing overall score, color-coded green / amber / red |
| Category cards | Tap to expand — shows summary, flags (as badges), and per-category recommendations |
| Alerts section | Shown in red only when `urgentAlerts` is non-empty |
| Strengths section | Shown in green for `positiveHighlights` |
| Recommendations | Numbered action cards from `topRecommendations` |
| Download report | Exports a plain `.txt` file with the full report |
| Reset | Clears all state and starts a new analysis |

---

## Score color thresholds

| Range | Color | Meaning |
|---|---|---|
| 75–100 | Green | Good |
| 50–74 | Amber | Moderate — attention advised |
| 0–49 | Red | Poor — action recommended |

---

## Disclaimer

This tool is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider with any questions regarding a medical condition.
