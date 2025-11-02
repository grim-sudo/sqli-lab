const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const dbPath = path.join(__dirname, 'sqli_lab.db');
const db = new sqlite3.Database(dbPath);

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

      return res.json({
        success: true,
        completed: completed,
        user: {
          id: row.id,
          username: row.username,
          email: row.email,
          role: row.role
        },
        message: completed 
          ? '🎉 Level 1 Complete! You successfully bypassed authentication and accessed the admin account!' 
          : 'Login successful, but you need to access the admin account to complete this level.'
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

    return res.json({
      success: true,
      completed: foundSecret,
      products: rows,
      count: rows.length,
      message: foundSecret 
        ? '🎉 Level 2 Complete! You successfully extracted hidden data!' 
        : 'Search completed. Try to find the hidden product with the flag.'
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

    return res.json({
      success: true,
      completed: foundMasterFlag,
      profiles: rows,
      message: foundMasterFlag 
        ? '🎉 Level 3 Complete! You mastered UNION-based SQL injection!' 
        : 'Profile data retrieved. Try to extract data from other tables using UNION.'
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
        objective: 'Use UNION SELECT to retrieve the master flag from admin_secrets',
        hint: 'UNION requires matching column counts. The admin_secrets table has interesting data...'
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
