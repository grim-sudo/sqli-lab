import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation({ progress, resetProgress }) {
  const location = useLocation();
  const [showReset, setShowReset] = useState(false);

  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalLevels = 3;
  const progressPercentage = (completedCount / totalLevels) * 100;

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all progress?')) {
      resetProgress();
      setShowReset(false);
    }
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/">
            <h1>🛡️ SQL Injection Lab</h1>
          </Link>
        </div>

        <div className="nav-links">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Home
          </Link>
          <Link 
            to="/level1" 
            className={location.pathname === '/level1' ? 'nav-link active' : 'nav-link'}
          >
            Level 1 {progress.level1 && '✓'}
          </Link>
          {progress.level1 ? (
            <Link 
              to="/level2" 
              className={location.pathname === '/level2' ? 'nav-link active' : 'nav-link'}
            >
              Level 2 {progress.level2 && '✓'}
            </Link>
          ) : (
            <span className="nav-link disabled" title="Complete Level 1 first">
              Level 2 🔒
            </span>
          )}
          {progress.level2 ? (
            <Link 
              to="/level3" 
              className={location.pathname === '/level3' ? 'nav-link active' : 'nav-link'}
            >
              Level 3 {progress.level3 && '✓'}
            </Link>
          ) : (
            <span className="nav-link disabled" title="Complete Level 2 first">
              Level 3 🔒
            </span>
          )}
        </div>

        <div className="nav-progress">
          <span className="progress-text">{completedCount}/{totalLevels}</span>
          <button 
            className="reset-btn" 
            onClick={() => setShowReset(!showReset)}
            title="Reset Progress"
          >
            ⚙️
          </button>
          {showReset && (
            <div className="reset-dropdown">
              <button onClick={handleReset} className="reset-confirm-btn">
                Reset Progress
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="progress-bar-nav">
        <div 
          className="progress-fill-nav" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </nav>
  );
}

export default Navigation;
