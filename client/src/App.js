import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Level1 from './components/Level1';
import Level2 from './components/Level2';
import Level3 from './components/Level3';
import Navigation from './components/Navigation';
import axios from 'axios';

function App() {
  const [levels, setLevels] = useState([]);
  const [progress, setProgress] = useState({
    level1: false,
    level2: false,
    level3: false
  });

  useEffect(() => {
    fetchLevels();
    loadProgress();
  }, []);

  const fetchLevels = async () => {
    try {
      const response = await axios.get('/api/levels');
      setLevels(response.data.levels);
    } catch (error) {
      console.error('Error fetching levels:', error);
    }
  };

  const loadProgress = () => {
    const savedProgress = localStorage.getItem('sqli_progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  };

  const updateProgress = (level, completed) => {
    const newProgress = { ...progress, [level]: completed };
    setProgress(newProgress);
    localStorage.setItem('sqli_progress', JSON.stringify(newProgress));
  };

  const resetProgress = () => {
    const resetState = { level1: false, level2: false, level3: false };
    setProgress(resetState);
    localStorage.setItem('sqli_progress', JSON.stringify(resetState));
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
