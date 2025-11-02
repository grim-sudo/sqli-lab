const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'sqli_lab.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Drop existing tables
  db.run('DROP TABLE IF EXISTS users');
  db.run('DROP TABLE IF EXISTS products');
  db.run('DROP TABLE IF EXISTS admin_secrets');

  // Level 1: Basic Login Bypass (users table)
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT,
    role TEXT DEFAULT 'user'
  )`);

  // Insert sample users for Level 1
  const users = [
    ['john_doe', 'password123', 'john@example.com', 'user'],
    ['jane_smith', 'securePass456', 'jane@example.com', 'user'],
    ['admin', 'superSecretAdminPass!2024', 'admin@sqlilab.com', 'admin'],
    ['guest', 'guest', 'guest@example.com', 'user']
  ];

  const insertUser = db.prepare('INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)');
  users.forEach(user => insertUser.run(user));
  insertUser.finalize();

  // Level 2: Product Search (products table)
  db.run(`CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL,
    category TEXT,
    hidden INTEGER DEFAULT 0
  )`);

  // Insert sample products for Level 2
  const products = [
    ['Laptop', 'High-performance laptop', 999.99, 'Electronics', 0],
    ['Mouse', 'Wireless mouse', 29.99, 'Electronics', 0],
    ['Keyboard', 'Mechanical keyboard', 79.99, 'Electronics', 0],
    ['Monitor', '4K Ultra HD monitor', 399.99, 'Electronics', 0],
    ['Secret Flag Product', 'FLAG{pr0duct_3xtr4ct10n_m4st3r}', 0.00, 'Hidden', 1],
    ['Headphones', 'Noise-cancelling headphones', 199.99, 'Electronics', 0],
    ['Webcam', 'HD webcam', 89.99, 'Electronics', 0]
  ];

  const insertProduct = db.prepare('INSERT INTO products (name, description, price, category, hidden) VALUES (?, ?, ?, ?, ?)');
  products.forEach(product => insertProduct.run(product));
  insertProduct.finalize();

  // Level 3: Admin Panel (admin_secrets table)
  db.run(`CREATE TABLE admin_secrets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    secret_key TEXT NOT NULL,
    secret_value TEXT NOT NULL,
    access_level INTEGER DEFAULT 1
  )`);

  // Insert secrets for Level 3
  const secrets = [
    ['database_version', 'SQLite 3.36.0', 1],
    ['server_location', 'US-EAST-1', 1],
    ['master_flag', 'FLAG{un10n_s3l3ct_ch4mp10n}', 3],
    ['backup_schedule', 'Daily at 2 AM UTC', 2],
    ['encryption_key', 'AES-256-GCM', 2]
  ];

  const insertSecret = db.prepare('INSERT INTO admin_secrets (secret_key, secret_value, access_level) VALUES (?, ?, ?)');
  secrets.forEach(secret => insertSecret.run(secret));
  insertSecret.finalize();

  console.log('✅ Database setup complete!');
  console.log('📊 Tables created: users, products, admin_secrets');
  console.log('🎯 Ready for SQL Injection Lab!');
});

db.close();
