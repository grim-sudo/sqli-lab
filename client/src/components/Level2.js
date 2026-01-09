import React, { useState } from 'react';
import axios from '../axios-config';
import './Level.css';
import { labApi } from '../lib/labApi';

function Level2({ updateProgress, completed }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [flagInput, setFlagInput] = useState('');
  const [flagResponse, setFlagResponse] = useState(null);
  const [flagLoading, setFlagLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await axios.get('/api/level2/search', {
        params: { query: searchQuery }
      });

      setResponse(res.data);
      if (res.data.completed) {
        updateProgress('level2', true);
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
    "The query checks for 'hidden = 0'. What if you could make this condition always true?",
    "Use logical operators to alter the WHERE clause without breaking the surrounding query structure.",
    "Experiment with OR and comment sequences gradually; inspect returned results and iterate. Avoid copying explicit payloads from hints.",
  ];

  return (
    <div className="container">
      <div className="level-header-section card">
        <div className="level-title-row">
          <div>
            <h1>Level 2: Hidden Data Extraction</h1>
            <span className="badge badge-medium">Medium</span>
            {completed && <span className="badge badge-completed">✓ Completed</span>}
          </div>
        </div>
        
        <div className="level-info">
          <div className="info-block">
            <h3>🎯 Objective</h3>
            <p>Find and extract the hidden product that contains a secret flag in its description.</p>
          </div>
          
          <div className="info-block">
            <h3>📖 Background</h3>
            <p>
              This product search feature is vulnerable to SQL injection. The application filters
              products to only show non-hidden items (hidden = 0), but you can manipulate the WHERE
              clause to bypass this restriction and reveal hidden data.
            </p>
          </div>

          <div className="info-block">
            <h3>🔍 What You'll Learn</h3>
            <ul>
              <li>Manipulating WHERE clause logic with OR operators</li>
              <li>Extracting hidden or restricted data</li>
              <li>Understanding boolean-based SQL injection</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="challenge-section card">
        <h2>🔍 Product Search</h2>
        <p className="challenge-description">
          Search for products in our catalog. There's a hidden product with a flag that you need to find!
        </p>

        <form onSubmit={handleSearch} className="challenge-form">
          <div className="input-group">
            <label htmlFor="search">Search Products</label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter product name (e.g., Laptop, Mouse)"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {response && (
          <div className={`alert ${response.completed ? 'alert-success' : 'alert-info'}`}>
            <strong>{response.completed ? '🎉 Level Complete!' : '📊 Search Results'}</strong>
            <p>{response.message}</p>
            <p><strong>Found {response.count} product(s)</strong></p>
            {response.flag && (
              <div className="flag-box" style={{ marginTop: '10px' }}>
                <h4>🏳️ Flag</h4>
                <code style={{ display: 'block', marginTop: '8px', fontSize: '16px' }}>{response.flag}</code>
              </div>
            )}
          </div>
        )}

        

        {response && response.products && response.products.length > 0 && (
          <div className="products-grid">
            {response.products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-header">
                  <h3>{product.name}</h3>
                  <span className="product-category">{product.category}</span>
                </div>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">
                    ${product.price ? product.price.toFixed(2) : '0.00'}
                  </span>
                  <span className="product-id">ID: {product.id}</span>
                </div>
              </div>
            ))}
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
                <p>Try small modifications to your search input and observe how results change. Build your payload step-by-step, and prefer understanding the effect of each change rather than applying a single copied string.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flag-submit-section card" style={{ marginTop: '16px' }}>
        <h3>Submit Flag</h3>
        <p>Submit a Level 2 flag to validate it and complete the level.</p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setFlagLoading(true);
            setFlagResponse(null);
            try {
              const res = await axios.post('/api/submit-flag', { level: 2, flag: flagInput });
              setFlagResponse(res.data);
              if (res.data.valid) {
                updateProgress('level2', true);
                // Submit score to main platform
                try {
                  const user = await labApi.getCurrentUser();
                  if (user) {
                    const result = await labApi.updateLabScore({
                      user_id: user.user_id,
                      lab_id: 3, // SQL Injection lab_id
                      level: 2,
                      score: 33,
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
            <label htmlFor="flag2">Flag</label>
            <input id="flag2" type="text" value={flagInput} onChange={(e) => setFlagInput(e.target.value)} placeholder="Enter flag (e.g., FLAG{...})" />
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
            <h3>1. Parameterized Queries</h3>
            <div className="code-block">
              {`// Secure approach
const query = 'SELECT * FROM products WHERE name LIKE ? AND hidden = 0';
db.all(query, ['%' + searchTerm + '%'], callback);`}
            </div>
          </div>
          
          <div className="prevention-item">
            <h3>2. Whitelist Input Validation</h3>
            <p>Only allow alphanumeric characters and spaces in search queries.</p>
          </div>
          
          <div className="prevention-item">
            <h3>3. Escape Special Characters</h3>
            <p>Properly escape SQL special characters like quotes, dashes, and semicolons.</p>
          </div>
          
          <div className="prevention-item">
            <h3>4. Use Search Libraries</h3>
            <p>Consider using dedicated search solutions like Elasticsearch for complex searches.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Level2;
