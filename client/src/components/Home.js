import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home({ levels, progress }) {
  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalLevels = 3;

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to SQL Injection Lab</h1>
        <p className="hero-subtitle">
          Learn SQL Injection techniques in a safe, controlled environment
        </p>
        <div className="hero-stats">
          <div className="stat-card">
            <div className="stat-number">{totalLevels}</div>
            <div className="stat-label">Levels</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{completedCount}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{totalLevels - completedCount}</div>
            <div className="stat-label">Remaining</div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="info-section card">
          <h2>🎯 About This Lab</h2>
          <p>
            This interactive lab is designed to teach you about SQL Injection vulnerabilities
            through hands-on practice. Each level presents a different type of SQL injection
            attack, progressively increasing in difficulty.
          </p>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-icon">🔒</div>
              <h3>Safe Environment</h3>
              <p>Practice without risk in an isolated sandbox</p>
            </div>
            <div className="info-item">
              <div className="info-icon">📚</div>
              <h3>Learn by Doing</h3>
              <p>Hands-on exercises with real vulnerabilities</p>
            </div>
            <div className="info-item">
              <div className="info-icon">💡</div>
              <h3>Hints Available</h3>
              <p>Get help when you need it with progressive hints</p>
            </div>
          </div>
        </div>

        <div className="levels-section">
          <h2>🎮 Choose Your Level</h2>
          <div className="levels-grid">
            {levels.map((level) => {
              // Check if previous level is completed (Level 1 is always unlocked)
              const isUnlocked = level.id === 1 || progress[`level${level.id - 1}`];
              
              return (
                <div key={level.id} className={`level-card ${!isUnlocked ? 'locked' : ''}`}>
                  <div className="level-header">
                    <h3>
                      <span className={`level-number level-${level.id}`}>{level.id}</span>
                      {level.title}
                    </h3>
                    {progress[`level${level.id}`] && (
                      <span className="completed-badge">✓ Completed</span>
                    )}
                    {!isUnlocked && (
                      <span className="locked-badge">🔒 Locked</span>
                    )}
                  </div>
                  <p className="level-description">{level.description}</p>
                  <div className="level-objective">
                    <strong>Objective:</strong> {level.objective}
                  </div>
                  <span className={`badge badge-${level.difficulty.toLowerCase()}`}>
                    {level.difficulty}
                  </span>
                  {isUnlocked ? (
                    <Link to={`/level${level.id}`} className={`btn btn-level-${level.id}`}>
                      {progress[`level${level.id}`] ? 'Review Level' : 'Launch Exercise'}
                    </Link>
                  ) : (
                    <button className="btn btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                      Complete Level {level.id - 1} First
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
