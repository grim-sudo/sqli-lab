import React, { useState } from 'react';
import axios from 'axios';
import './Level.css';

function Level1({ updateProgress, completed }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [flagInput, setFlagInput] = useState('');
  const [flagResponse, setFlagResponse] = useState(null);
  const [flagLoading, setFlagLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await axios.post('/api/level1/login', {
        username,
        password
      });

      setResponse(res.data);
      if (res.data.completed) {
        updateProgress('level1', true);
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
    "SQL comments can be used to ignore the rest of a query. In SQL, -- is a comment.",
    "Try crafting inputs that change how the WHERE clause is parsed; small changes can have big effects.",
    "Combine commenting techniques with incremental tests and observe the constructed query in debug output. Avoid using full payloads provided verbatim; experiment instead.",
  ];

  return (
    <div className="container">
      <div className="level-header-section card">
        <div className="level-title-row">
          <div>
            <h1>Level 1: Authentication Bypass</h1>
            <span className="badge badge-easy">Easy</span>
            {completed && <span className="badge badge-completed">✓ Completed</span>}
          </div>
        </div>
        
        <div className="level-info">
          <div className="info-block">
            <h3>🎯 Objective</h3>
            <p>Bypass the login form and access the admin account without knowing the password.</p>
          </div>
          
          <div className="info-block">
            <h3>📖 Background</h3>
            <p>
              This login form is vulnerable to SQL injection. The application constructs a SQL query
              by directly concatenating user input without proper sanitization. This is one of the most
              common and dangerous web vulnerabilities.
            </p>
          </div>

          <div className="info-block">
            <h3>🔍 What You'll Learn</h3>
            <ul>
              <li>How SQL injection works in authentication systems</li>
              <li>Using SQL comments to bypass security checks</li>
              <li>The importance of parameterized queries</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="challenge-section card">
        <h2>🔐 Login Form</h2>
        <p className="challenge-description">
          Try to login as the admin user. The admin username is "admin", but you don't know the password...
        </p>

        <form onSubmit={handleSubmit} className="challenge-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="text"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {response && (
          <div className={`alert ${response.success ? 'alert-success' : 'alert-error'}`}>
            <strong>{response.success ? '✓ Success!' : '✗ Failed'}</strong>
            <p>{response.message}</p>
            {response.user && (
              <div className="user-info">
                <h4>User Information:</h4>
                <p><strong>ID:</strong> {response.user.id}</p>
                <p><strong>Username:</strong> {response.user.username}</p>
                <p><strong>Email:</strong> {response.user.email}</p>
                <p><strong>Role:</strong> {response.user.role}</p>
              </div>
            )}
            {response.flag && (
              <div className="flag-box">
                <h4>🏳️ Flag</h4>
                <code style={{ display: 'block', marginTop: '8px', fontSize: '16px' }}>{response.flag}</code>
              </div>
            )}
            {response.error && (
              <div className="error-details">
                <h4>{response.error}</h4>
                {response.query && (
                  <code style={{ display: 'block', marginTop: '10px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                    {response.query}
                  </code>
                )}
              </div>
            )}
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
              Click the buttons below to reveal hints progressively. Try to solve it yourself first!
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
                <p>If you're stuck, try small, incremental inputs and observe how the server logs the resulting query. Focus on how comments interact with string literals and adjust your input step-by-step.</p>
                <p>The learning outcome is to understand the interaction between input parsing and query construction rather than copying a single payload.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flag-submit-section card" style={{ marginTop: '16px' }}>
        <h3>Submit Flag</h3>
        <p>Have a flag for Level 1? Submit it here to validate and mark the level complete.</p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setFlagLoading(true);
            setFlagResponse(null);
            try {
              const res = await axios.post('/api/submit-flag', { level: 1, flag: flagInput });
              setFlagResponse(res.data);
              if (res.data.valid) updateProgress('level1', true);
            } catch (err) {
              setFlagResponse({ success: false, valid: false, message: err.response?.data?.message || 'Error submitting flag' });
            } finally {
              setFlagLoading(false);
            }
          }}
          className="challenge-form"
        >
          <div className="input-group">
            <label htmlFor="flag1">Flag</label>
            <input id="flag1" type="text" value={flagInput} onChange={(e) => setFlagInput(e.target.value)} placeholder="Enter flag (e.g., FLAG{...})" />
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
            <h3>1. Use Parameterized Queries</h3>
            <div className="code-block">
              {`// Secure approach
const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
db.get(query, [username, password], callback);`}
            </div>
          </div>
          
          <div className="prevention-item">
            <h3>2. Use ORM Libraries</h3>
            <p>Modern ORMs like Sequelize, TypeORM, or Prisma handle parameterization automatically.</p>
          </div>
          
          <div className="prevention-item">
            <h3>3. Input Validation</h3>
            <p>Validate and sanitize all user inputs. Never trust user data!</p>
          </div>
          
          <div className="prevention-item">
            <h3>4. Principle of Least Privilege</h3>
            <p>Database users should only have the minimum necessary permissions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Level1;
