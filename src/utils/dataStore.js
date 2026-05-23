// src/utils/dataStore.js

const DB_KEY = 'affectra_db';

const getInitialDB = () => ({
  user: {
    name: 'User',
    email: 'user@example.com',
    password: 'password123',
    picture: null,
    aiModel: 'google/gemini-2.0-flash-exp:free',
    overallHealth: 0,
  },
  tests: [],
  journal: [],
  aiChatHistory: []
});

// Initialize DB if it doesn't exist
const initDB = () => {
  const existing = localStorage.getItem(DB_KEY);
  if (!existing) {
    localStorage.setItem(DB_KEY, JSON.stringify(getInitialDB()));
  }
};

export const getDB = () => {
  initDB();
  return JSON.parse(localStorage.getItem(DB_KEY));
};

export const saveDB = (data) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
};

export const addJournalEntry = (content) => {
  const db = getDB();
  const newEntry = {
    id: Date.now(),
    date: new Date().toISOString(),
    content
  };
  db.journal.unshift(newEntry);
  saveDB(db);
  return newEntry;
};

export const addTestResult = (testName, score) => {
  const db = getDB();
  db.tests.unshift({
    id: Date.now(),
    date: new Date().toISOString(),
    testName,
    score
  });
  // Update overall health to average of recent tests or just the latest
  db.user.overallHealth = score;
  saveDB(db);
};

export const saveAssessmentResult = (apiResult) => {
  const db = getDB();
  const overallScore = apiResult.overallScore || 0;
  
  db.tests.unshift({
    id: Date.now(),
    date: new Date().toISOString(),
    testName: 'Health Optimizer Assessment',
    score: overallScore,
    details: apiResult
  });
  
  db.user.overallHealth = overallScore;
  saveDB(db);
};

export const updateUser = (userData) => {
  const db = getDB();
  db.user = { ...db.user, ...userData };
  saveDB(db);
  return db.user;
};

export const addChatMessage = (role, content) => {
  const db = getDB();
  const newMessage = { role, content, id: Date.now() };
  db.aiChatHistory.push(newMessage);
  saveDB(db);
  return newMessage;
};

export const clearChatHistory = () => {
  const db = getDB();
  db.aiChatHistory = [];
  saveDB(db);
};
