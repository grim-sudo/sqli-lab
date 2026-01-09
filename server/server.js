const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 80;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const dbPath = path.join(__dirname, 'sqli_lab.db');
const db = new sqlite3.Database(dbPath);

// Helper to fetch generated flags from DB
function fetchFlag(level, callback) {
  db.get('SELECT flag FROM flags WHERE level = ?', [level], (err, row) => {
    if (err) return callback(err);
    return callback(null, row ? row.flag : null);
  });
}

// Validate a submitted flag for a level
app.post('/api/submit-flag', (req, res) => {
  const { level, flag } = req.body || {};
  const lvl = parseInt(level, 10);

  if (!lvl || !flag) {
    return res.status(400).json({ success: false, valid: false, message: 'Level and flag are required' });
  }

  db.get('SELECT flag FROM flags WHERE level = ?', [lvl], (err, row) => {
    if (err) return res.status(500).json({ success: false, valid: false, message: 'Database error', error: err.message });
    if (!row) return res.status(404).json({ success: false, valid: false, message: 'No flag configured for this level' });

    const isValid = row.flag === flag;

    return res.json({ success: true, valid: isValid, message: isValid ? 'Flag is valid!' : 'Invalid flag', level: lvl });
  });
});

// ==================== LEVEL 1: Login Bypass ====================
// Vulnerable login endpoint - Classic authentication bypass
app.post('/api/level1/login', (req, res) => {
  const { username, password } = req.body;

  // VULNERABLE: Direct string concatenation
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  console.log('🔍 Level 1 Query:', query);

  db.get(query, (err, row) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
        query: query,
        message: 'SQL Database Error!'
      });
    }

    if (row) {
      // Check if admin role was accessed
      const isAdmin = row.role === 'admin';
      const completed = isAdmin;

      if (completed) {
        // fetch level 1 flag and include it in the response
        return fetchFlag(1, (fErr, flag) => {
          const payload = {
            success: true,
            completed: true,
            user: {
              id: row.id,
              username: row.username,
              email: row.email,
              role: row.role
            },
            flag: flag || null,
            message: '🎉 Level 1 Complete! You successfully bypassed authentication and accessed the admin account!'
          };
          if (fErr) delete payload.flag;
          return res.json(payload);
        });
      }

      return res.json({
        success: true,
        completed: false,
        user: {
          id: row.id,
          username: row.username,
          email: row.email,
          role: row.role
        },
        message: 'Login successful, but you need to access the admin account to complete this level.'
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }
  });
});

// ==================== LEVEL 2: Data Extraction ====================
// Vulnerable search endpoint - Extract hidden data
app.get('/api/level2/search', (req, res) => {
  const { query } = req.query;

  // VULNERABLE: Direct string concatenation in WHERE clause
  const sqlQuery = `SELECT id, name, description, price, category FROM products WHERE name LIKE '%${query}%' AND hidden = 0`;

  console.log('🔍 Level 2 Query:', sqlQuery);

  db.all(sqlQuery, (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
        query: sqlQuery,
        message: 'SQL Database Error!'
      });
    }

    // Check if the secret flag product was found
    const foundSecret = rows.some(row => 
      row.description && row.description.includes('FLAG{')
    );

    if (foundSecret) {
      return fetchFlag(2, (fErr, flag) => {
        const payload = {
          success: true,
          completed: true,
          products: rows,
          count: rows.length,
          flag: flag || null,
          message: '🎉 Level 2 Complete! You successfully extracted hidden data!'
        };
        if (fErr) delete payload.flag;
        return res.json(payload);
      });
    }

    return res.json({
      success: true,
      completed: false,
      products: rows,
      count: rows.length,
      message: 'Search completed. Try to find the hidden product with the flag.'
    });
  });
});

// ==================== LEVEL 3: Union-Based Injection ====================
// Vulnerable user profile endpoint - UNION SELECT attack
app.get('/api/level3/profile', (req, res) => {
  const { userId } = req.query;

  // VULNERABLE: Direct string concatenation allowing UNION
  const query = `SELECT id, username, email, role FROM users WHERE id = ${userId}`;

  console.log('🔍 Level 3 Query:', query);

  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
        query: query,
        message: 'SQL Database Error!'
      });
    }

    // Check if master flag was retrieved
    const foundMasterFlag = rows.some(row => {
      // Check all columns for FLAG since UNION maps columns differently
      const values = Object.values(row).filter(val => typeof val === 'string');
      return values.some(val => val.includes('FLAG{'));
    });

    if (foundMasterFlag) {
      return fetchFlag(3, (fErr, flag) => {
        const payload = {
          success: true,
          completed: true,
          profiles: rows,
          flag: flag || null,
          message: '🎉 Level 3 Complete! You mastered UNION-based SQL injection!'
        };
        if (fErr) delete payload.flag;
        return res.json(payload);
      });
    }

    return res.json({
      success: true,
      completed: false,
      profiles: rows,
      message: 'Profile data retrieved. Try to extract data from other tables using UNION.'
    });
  });
});

// ==================== Helper Endpoints ====================
// Get all levels status
app.get('/api/levels', (req, res) => {
  res.json({
    levels: [
      {
        id: 1,
        title: 'Authentication Bypass',
        difficulty: 'Easy',
        description: 'Bypass the login form to access the admin account',
        objective: 'Login as admin without knowing the password',
        hint: 'Think about how SQL comments work...'
      },
      {
        id: 2,
        title: 'Hidden Data Extraction',
        difficulty: 'Medium',
        description: 'Find and extract hidden product information',
        objective: 'Retrieve the hidden product containing the flag',
        hint: 'What if you could change the WHERE clause logic?'
      },
      {
        id: 3,
        title: 'Union-Based Injection',
        difficulty: 'Hard',
        description: 'Extract sensitive data from other tables',
        objective: 'Use advanced techniques to retrieve data from other tables',
        hint: 'Observe how the application responds to different inputs and craft payloads that change the shape of returned rows. Focus on experimenting rather than relying on specific internal names.'
      }
    ]
  });
});

// Reset progress endpoint
app.post('/api/reset', (req, res) => {
  res.json({
    success: true,
    message: 'Progress reset successfully'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SQL Injection Lab Server is running' });
});

// Serve React client build (if present)
const clientBuildPath = path.join(__dirname, 'public');
if (fs.existsSync(clientBuildPath)) {
  // Inject runtime config before serving static files
  app.get('/config.js', (req, res) => {
    const mainWebUrl = process.env.MAIN_WEB_URL || 'https://letushack.com';
    res.type('application/javascript');
    res.send(`window.__APP_CONFIG__ = { MAIN_WEB_URL: "${mainWebUrl}" };`);
  });

  app.use(express.static(clientBuildPath));

  // For any non-API routes, serve index.html (React Router support)
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    }
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SQL Injection Lab Server running on http://localhost:${PORT}`);
  console.log(`📚 Ready to learn SQL Injection!`);
});
