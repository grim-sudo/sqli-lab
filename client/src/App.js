import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Level1 from './components/Level1';
import Level2 from './components/Level2';
import Level3 from './components/Level3';
import Navigation from './components/Navigation';
import axios from './axios-config';
import { labApi } from './lib/labApi';

function App() {
  const [levels, setLevels] = useState([]);
  const [progress, setProgress] = useState({
    level1: false,
    level2: false,
    level3: false
  });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchLevels();
    initializeUser();
  }, []);

  const initializeUser = async () => {
    try {
      const user = await labApi.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        loadProgress(user.user_id);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      loadProgress('guest'); // Fallback for development
    }
  };

  const fetchLevels = async () => {
    try {
      const response = await axios.get('/api/levels');
      setLevels(response.data.levels);
    } catch (error) {
      console.error('Error fetching levels:', error);
    }
  };

  const loadProgress = (userId) => {
    const storageKey = `sqli_progress_${userId}`;
    const savedProgress = localStorage.getItem(storageKey);
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    } else {
      setProgress({ level1: false, level2: false, level3: false });
    }
  };

  const updateProgress = (level, completed) => {
    const newProgress = { ...progress, [level]: completed };
    setProgress(newProgress);
    const userId = currentUser?.user_id || 'guest';
    const storageKey = `sqli_progress_${userId}`;
    localStorage.setItem(storageKey, JSON.stringify(newProgress));
  };

  const resetProgress = () => {
    const resetState = { level1: false, level2: false, level3: false };
    setProgress(resetState);
    const userId = currentUser?.user_id || 'guest';
    const storageKey = `sqli_progress_${userId}`;
    localStorage.setItem(storageKey, JSON.stringify(resetState));
  };

  return (
    <Router>
      <div className="App">
        <Navigation progress={progress} resetProgress={resetProgress} />
        <Routes>
          <Route path="/" element={<Home levels={levels} progress={progress} />} />
          <Route 
            path="/level1" 
            element={<Level1 updateProgress={updateProgress} completed={progress.level1} />} 
          />
          <Route 
            path="/level2" 
            element={
              progress.level1 ? (
                <Level2 updateProgress={updateProgress} completed={progress.level2} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/level3" 
            element={
              progress.level2 ? (
                <Level3 updateProgress={updateProgress} completed={progress.level3} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
