import React, { useState } from 'react';
import axios from '../axios-config';
import './Level.css';
import { labApi } from '../lib/labApi';

function Level3({ updateProgress, completed }) {
  const [userId, setUserId] = useState('1');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [flagInput, setFlagInput] = useState('');
  const [flagResponse, setFlagResponse] = useState(null);
  const [flagLoading, setFlagLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await axios.get('/api/level3/profile', {
        params: { userId }
      });

      setResponse(res.data);
      if (res.data.completed) {
        updateProgress('level3', true);
      }
    } catch (error) {
      setResponse({
        success: false,
        message: error.response?.data?.message || 'An error occurred',
        error: error.response?.data?.error,
        query: error.response?.data?.query
      });
    } finally {
      setLoading(false);
    }
  };

  const hints = [
    "UNION allows you to combine results from multiple SELECT statements. They must have the same number of columns.",
    "Consider matching column counts and types, but avoid revealing exact internal table names.",
    "Iteratively discover column counts and data types by trying small UNIONs and inspecting results rather than using a full payload.",
    "Focus on gradually expanding your UNION queries and look for values that resemble flags (e.g., strings containing FLAG{).",
  ];

  return (
    <div className="container">
      <div className="level-header-section card">
        <div className="level-title-row">
          <div>
            <h1>Level 3: Union-Based Injection</h1>
            <span className="badge badge-hard">Hard</span>
            {completed && <span className="badge badge-completed">✓ Completed</span>}
          </div>
        </div>
        
        <div className="level-info">
          <div className="info-block">
            <h3>🎯 Objective</h3>
            <p>Use UNION-based SQL injection to extract the master flag from the admin_secrets table.</p>
          </div>
          
          <div className="info-block">
            <h3>📖 Background</h3>
            <p>
              This user profile viewer is vulnerable to UNION-based SQL injection. UNION allows you to
              append results from a second SELECT statement to the original query. This is one of the
              most powerful SQL injection techniques, allowing attackers to extract data from any table
              in the database.
            </p>
          </div>

          <div className="info-block">
            <h3>🔍 What You'll Learn</h3>
            <ul>
              <li>How UNION SELECT works in SQL injection</li>
              <li>Matching column counts and data types</li>
              <li>Extracting data from multiple tables</li>
              <li>Advanced SQL injection techniques</li>
            </ul>
          </div>

          <div className="info-block">
            <h3>📊 Database Schema Hints</h3>
            <ul>
              <li><strong>users table:</strong> id, username, email, role (4 columns)</li>
              <li><strong>admin_secrets table:</strong> id, secret_key, secret_value, access_level</li>
              <li>The master flag has access_level = 3</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="challenge-section card">
        <h2>👤 User Profile Viewer</h2>
        <p className="challenge-description">
          View user profiles by their ID. Can you extract sensitive data from other tables?
        </p>

        <form onSubmit={handleSubmit} className="challenge-form">
          <div className="input-group">
            <label htmlFor="userId">User ID</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user ID (e.g., 1, 2, 3)"
              required
            />
            <small>Try IDs 1-4 to see normal users, or inject your own query...</small>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Loading...' : 'View Profile'}
          </button>
        </form>

        {response && (
          <div className={`alert ${response.completed ? 'alert-success' : 'alert-info'}`}>
            <strong>{response.completed ? '🎉 Level Complete!' : '📊 Profile Data'}</strong>
            <p>{response.message}</p>
            {response.flag && (
              <div className="flag-box" style={{ marginTop: '10px' }}>
                <h4>🏳️ Flag</h4>
                <code style={{ display: 'block', marginTop: '8px', fontSize: '16px' }}>{response.flag}</code>
              </div>
            )}
          </div>
        )}

        

        {response && response.profiles && response.profiles.length > 0 && (
          <div className="profiles-container">
            <h3>Retrieved Profiles:</h3>
            <div className="profiles-grid">
              {response.profiles.map((profile, index) => (
                <div key={index} className="profile-card">
                  <div className="profile-row">
                    <strong>ID:</strong>
                    <span>{profile.id}</span>
                  </div>
                  <div className="profile-row">
                    <strong>Username:</strong>
                    <span className={String(profile.username || '').includes('FLAG{') ? 'flag-text' : ''}>
                      {profile.username}
                    </span>
                  </div>
                  <div className="profile-row">
                    <strong>Email:</strong>
                    <span className={String(profile.email || '').includes('FLAG{') ? 'flag-text' : ''}>
                      {profile.email}
                    </span>
                  </div>
                  <div className="profile-row">
                    <strong>Role:</strong>
                    <span className={String(profile.role || '').includes('FLAG{') ? 'flag-text' : ''}>
                      {profile.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {response && response.error && (
          <div className="alert alert-error">
            <h4>{response.error}</h4>
            {response.query && (
              <code style={{ display: 'block', marginTop: '10px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {response.query}
              </code>
            )}
            <p style={{ marginTop: '10px' }}>
              <small>Hint: UNION requires the same number of columns in both SELECT statements.</small>
            </p>
          </div>
        )}
      </div>

      <div className="hints-section card">
        <div className="hints-header">
          <h2>💡 Need Help?</h2>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowHints(!showHints)}
          >
            {showHints ? 'Hide Hints' : 'Show Hints'}
          </button>
        </div>

        {showHints && (
          <div className="hints-content">
            <p className="hints-intro">
              This is the most challenging level. Take your time and reveal hints as needed!
            </p>
            
            {hints.map((hint, index) => (
              <div key={index}>
                {hintLevel >= index + 1 ? (
                  <div className="hint-box">
                    <h4>Hint {index + 1}:</h4>
                    <p>{hint}</p>
                  </div>
                ) : (
                  <button
                    className="btn btn-secondary"
                    onClick={() => setHintLevel(index + 1)}
                    style={{ marginTop: '10px' }}
                  >
                    Reveal Hint {index + 1}
                  </button>
                )}
              </div>
            ))}

            {hintLevel >= hints.length && (
              <div className="solution-box">
                <h4>🔑 Final Hint (no spoilers)</h4>
                <p>Build your UNION payload incrementally: start by matching the number of columns with simple placeholders, then replace placeholders with likely column names. Inspect returned rows for values that look like secrets. Avoid copying an entire payload; discovery is the goal.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flag-submit-section card" style={{ marginTop: '16px' }}>
        <h3>Submit Flag</h3>
        <p>Submit a Level 3 flag to validate it and complete the level.</p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setFlagLoading(true);
            setFlagResponse(null);
            try {
              const res = await axios.post('/api/submit-flag', { level: 3, flag: flagInput });
              setFlagResponse(res.data);
              if (res.data.valid) {
                updateProgress('level3', true);
                // Submit score to main platform
                try {
                  const user = await labApi.getCurrentUser();
                  if (user) {
                    const result = await labApi.updateLabScore({
                      user_id: user.user_id,
                      lab_id: 3, // SQL Injection lab_id
                      level: 3,
                      score: 34,
                      solved: true,
                    });
                    // If already completed, that's fine - user is just practicing
                    if (!result) {
                      console.log('Level already completed previously - no points awarded');
                    }
                  }
                } catch (scoreError) {
                  // Silently handle if already completed
                  console.log('Score update result:', scoreError);
                }
              }
            } catch (err) {
              setFlagResponse({ success: false, valid: false, message: err.response?.data?.message || 'Error submitting flag' });
            } finally {
              setFlagLoading(false);
            }
          }}
          className="challenge-form"
        >
          <div className="input-group">
            <label htmlFor="flag3">Flag</label>
            <input id="flag3" type="text" value={flagInput} onChange={(e) => setFlagInput(e.target.value)} placeholder="Enter flag (e.g., FLAG{...})" />
          </div>
          <button type="submit" className="btn btn-secondary" disabled={flagLoading || !flagInput}>
            {flagLoading ? 'Checking...' : 'Submit Flag'}
          </button>
        </form>

        {flagResponse && (
          <div className={`alert ${flagResponse.valid ? 'alert-success' : 'alert-error'}`} style={{ marginTop: '10px' }}>
            <strong>{flagResponse.valid ? '✓ Valid Flag' : '✗ Invalid Flag'}</strong>
            <p>{flagResponse.message}</p>
          </div>
        )}
      </div>

      <div className="learning-section card">
        <h2>🛡️ How to Prevent This</h2>
        <div className="prevention-grid">
          <div className="prevention-item">
            <h3>1. Parameterized Queries (Critical!)</h3>
            <div className="code-block">
              {`// Secure approach
const query = 'SELECT id, username, email, role FROM users WHERE id = ?';
db.all(query, [userId], callback);`}
            </div>
          </div>
          
          <div className="prevention-item">
            <h3>2. Input Type Validation</h3>
            <p>Ensure numeric inputs are actually numbers. Use parseInt() or type checking.</p>
            <div className="code-block">
              {`const userId = parseInt(req.query.userId, 10);
if (isNaN(userId)) {
  return res.status(400).json({ error: 'Invalid ID' });
}`}
            </div>
          </div>
          
          <div className="prevention-item">
            <h3>3. Least Privilege Principle</h3>
            <p>Database users should only have access to tables they need. Separate read/write permissions.</p>
          </div>
          
          <div className="prevention-item">
            <h3>4. Web Application Firewall (WAF)</h3>
            <p>Use a WAF to detect and block SQL injection attempts. Tools like ModSecurity can help.</p>
          </div>
        </div>

        <div className="advanced-info">
          <h3>🎓 Advanced Concepts</h3>
          <p>
            UNION-based injection is powerful but requires knowledge of the database schema.
            In real-world scenarios, attackers might use:
          </p>
          <ul>
            <li><strong>Information Schema:</strong> Query system tables to discover table and column names</li>
            <li><strong>Error-based injection:</strong> Force errors to reveal database structure</li>
            <li><strong>Blind injection:</strong> Infer data through boolean or time-based responses</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Level3;
