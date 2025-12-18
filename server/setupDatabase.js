const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'sqli_lab.db');
const db = new sqlite3.Database(dbPath);

function generateFlag() {
  return `FLAG{${crypto.randomBytes(10).toString('hex')}}`;
}

db.serialize(() => {
  // Drop existing tables
  db.run('DROP TABLE IF EXISTS users');
  db.run('DROP TABLE IF EXISTS products');
  db.run('DROP TABLE IF EXISTS admin_secrets');
  db.run('DROP TABLE IF EXISTS flags');

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

  // Level 3: Admin Panel (admin_secrets table)
  db.run(`CREATE TABLE admin_secrets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    secret_key TEXT NOT NULL,
    secret_value TEXT NOT NULL,
    access_level INTEGER DEFAULT 1
  )`);

  // Flags table to hold per-level random flags
  db.run(`CREATE TABLE flags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    level INTEGER NOT NULL,
    flag TEXT NOT NULL
  )`);

  // Generate flags for each level
  const level1Flag = generateFlag();
  const level2Flag = generateFlag();
  const level3Flag = generateFlag();

  // Insert sample products for Level 2; include generated flag in a hidden product description
  const products = [
    ['Laptop', 'High-performance laptop', 999.99, 'Electronics', 0],
    ['Mouse', 'Wireless mouse', 29.99, 'Electronics', 0],
    ['Keyboard', 'Mechanical keyboard', 79.99, 'Electronics', 0],
    ['Monitor', '4K Ultra HD monitor', 399.99, 'Electronics', 0],
    ['Secret Flag Product', level2Flag, 0.00, 'Hidden', 1],
    ['Headphones', 'Noise-cancelling headphones', 199.99, 'Electronics', 0],
    ['Webcam', 'HD webcam', 89.99, 'Electronics', 0]
  ];

  const insertProduct = db.prepare('INSERT INTO products (name, description, price, category, hidden) VALUES (?, ?, ?, ?, ?)');
  products.forEach(product => insertProduct.run(product));
  insertProduct.finalize();

  // Insert secrets for Level 3 with generated master flag
  const secrets = [
    ['database_version', 'SQLite 3.36.0', 1],
    ['server_location', 'US-EAST-1', 1],
    ['master_flag', level3Flag, 3],
    ['backup_schedule', 'Daily at 2 AM UTC', 2],
    ['encryption_key', 'AES-256-GCM', 2]
  ];

  const insertSecret = db.prepare('INSERT INTO admin_secrets (secret_key, secret_value, access_level) VALUES (?, ?, ?)');
  secrets.forEach(secret => insertSecret.run(secret));
  insertSecret.finalize();

  // Insert flags into flags table
  const insertFlag = db.prepare('INSERT INTO flags (level, flag) VALUES (?, ?)');
  insertFlag.run(1, level1Flag);
  insertFlag.run(2, level2Flag);
  insertFlag.run(3, level3Flag);
  insertFlag.finalize();

  console.log('✅ Database setup complete!');
  console.log('📊 Tables created: users, products, admin_secrets, flags');
  console.log('🎯 Generated flags:');
  console.log('  Level 1:', level1Flag);
  console.log('  Level 2:', level2Flag);
  console.log('  Level 3:', level3Flag);
});

db.close();
