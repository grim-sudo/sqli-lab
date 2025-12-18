import React, { useState } from 'react';
import axios from 'axios';
import './Level.css';

function Level3({ updateProgress, completed }) {
  const [userId, setUserId] = useState('1');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);

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
    "The users table has 4 columns: id, username, email, role. You need to match this in your UNION SELECT.",
    "Try: 1 UNION SELECT id, secret_key, secret_value, access_level FROM admin_secrets-- to extract data from another table!",
    "To find the master flag, look for the secret with access_level 3 or search for 'FLAG{' in the results.",
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
                <h4>🔑 Complete Solution:</h4>
                <p>Enter this as the User ID:</p>
                <div className="code-block">
                  1 UNION SELECT id, secret_key, secret_value, access_level FROM admin_secrets--
                </div>
                <p>This creates the following SQL query:</p>
                <div className="code-block">
                  {`SELECT id, username, email, role FROM users WHERE id = 1 
UNION 
SELECT id, secret_key, secret_value, access_level FROM admin_secrets--`}
                </div>
                <p>The UNION combines user data with secret data. Look for the entry with access_level 3 to find the master flag!</p>
              </div>
            )}
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
