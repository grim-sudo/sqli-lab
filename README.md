# 🛡️ SQL Injection Lab

An interactive, educational platform for learning SQL injection techniques in a safe, controlled environment. Inspired by OWASP Juice Shop, this lab features 3 progressively challenging levels designed to teach students about SQL injection vulnerabilities and how to prevent them.

## 🎯 Features

- **3 Progressive Levels**: From basic authentication bypass to advanced UNION-based injection
- **Clean, Modern UI**: User-friendly interface with easy navigation
- **Educational Content**: Each level includes detailed explanations and learning objectives
- **Progressive Hints System**: Get help when you need it without spoiling the challenge
- **Progress Tracking**: Track your completion status across all levels
- **Prevention Guides**: Learn how to write secure code and prevent SQL injection
- **Real Vulnerabilities**: Practice on actual vulnerable code in a safe environment

## 📚 Levels Overview

### Level 1: Authentication Bypass (Easy)
Learn how to bypass login forms using SQL comments and basic injection techniques.
- **Objective**: Access the admin account without knowing the password
- **Techniques**: SQL comments, authentication bypass
- **Flag**: Access admin role

### Level 2: Hidden Data Extraction (Medium)
Discover how to manipulate WHERE clauses to extract hidden data.
- **Objective**: Find and extract hidden products containing secret flags
- **Techniques**: Boolean-based injection, OR logic manipulation
- **Flag**: `FLAG{pr0duct_3xtr4ct10n_m4st3r}`

### Level 3: Union-Based Injection (Hard)
Master advanced UNION SELECT techniques to extract data from multiple tables.
- **Objective**: Extract the master flag from the admin_secrets table
- **Techniques**: UNION SELECT, column matching, cross-table queries
- **Flag**: `FLAG{un10n_s3l3ct_ch4mp10n}`

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or download the repository**
   ```bash
   cd sqli
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up the database**
   ```bash
   npm run setup
   ```

4. **Start the server** (in one terminal)
   ```bash
   npm run start-server
   ```

5. **Start the client** (in another terminal)
   ```bash
   npm run start-client
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🛠️ Development

### Project Structure
```
sqli-lab/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Home.js
│   │   │   ├── Level1.js
│   │   │   ├── Level2.js
│   │   │   ├── Level3.js
│   │   │   └── Navigation.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                # Express backend
│   ├── server.js         # Main server file
│   ├── setupDatabase.js  # Database initialization
│   └── package.json
└── README.md
```

### Available Scripts

- `npm run install-all` - Install all dependencies
- `npm run setup` - Initialize the database
- `npm run start-server` - Start the backend server
- `npm run start-client` - Start the React development server
- `npm run dev-server` - Start server with nodemon (auto-reload)
- `npm run build` - Build the client for production

## 🎓 Learning Objectives

By completing this lab, students will:

1. **Understand SQL Injection**
   - How SQL injection vulnerabilities occur
   - Different types of SQL injection attacks
   - Real-world impact of SQL injection

2. **Practice Attack Techniques**
   - Authentication bypass
   - Data extraction
   - UNION-based queries
   - SQL comments and logic manipulation

3. **Learn Prevention Methods**
   - Parameterized queries
   - Input validation
   - Least privilege principle
   - Secure coding practices

## 🔒 Security Notice

**⚠️ IMPORTANT: This application is intentionally vulnerable for educational purposes.**

- **DO NOT** deploy this application to a production environment
- **DO NOT** use these techniques on systems you don't own or have permission to test
- **DO NOT** store any real or sensitive data in this application
- This lab is for **educational purposes only**

Unauthorized access to computer systems is illegal. Always:
- Obtain proper authorization before testing
- Respect privacy and data protection laws
- Use your knowledge ethically to improve security

## 🎮 How to Use

1. **Start with the Home Page**: Read about each level and choose where to start
2. **Read the Objectives**: Understand what you're trying to accomplish
3. **Try It Yourself**: Attempt to solve the challenge before using hints
4. **Use Hints Progressively**: Reveal hints one at a time if you get stuck
5. **Learn from Solutions**: Study the complete solutions and prevention methods
6. **Track Your Progress**: Complete all three levels to master SQL injection

## 🐛 Troubleshooting

### Database Issues
If you encounter database errors:
```bash
cd server
npm run setup
```

### Port Conflicts
- Server runs on port 5000
- Client runs on port 3000
- Change ports in `server/server.js` and `client/package.json` if needed

### Reset Progress
Click the settings icon (⚙️) in the navigation bar and select "Reset Progress"

## 📖 Additional Resources

- [OWASP SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
- [PortSwigger SQL Injection](https://portswigger.net/web-security/sql-injection)
- [SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)

## 🤝 Contributing

This is an educational project. Feel free to:
- Report bugs or issues
- Suggest new levels or features
- Improve documentation
- Share with students and educators

## 📝 License

MIT License - Feel free to use this for educational purposes.

## 🙏 Acknowledgments

- Inspired by [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/)
- Built for cybersecurity education
- Designed with students in mind

---

**Happy Learning! Stay Ethical! 🛡️**
