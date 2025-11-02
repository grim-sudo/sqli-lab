# 🎯 SQL Injection Lab - Project Overview

## 📁 Project Structure

```
sqli/
├── 📄 README.md              # Main documentation
├── 📄 SETUP_GUIDE.md         # Detailed setup instructions
├── 📄 START.md               # Quick start guide
├── 📄 SOLUTIONS.md           # Complete solutions (instructor guide)
├── 📄 PROJECT_OVERVIEW.md    # This file
├── 📄 package.json           # Root package configuration
├── 📄 .gitignore            # Git ignore rules
│
├── 📂 server/                # Backend (Express + SQLite)
│   ├── server.js            # Main server with vulnerable endpoints
│   ├── setupDatabase.js     # Database initialization script
│   └── package.json         # Server dependencies
│
└── 📂 client/                # Frontend (React)
    ├── package.json         # Client dependencies
    ├── public/
    │   └── index.html       # HTML template
    └── src/
        ├── index.js         # React entry point
        ├── index.css        # Global styles
        ├── App.js           # Main app component
        ├── App.css          # App styles
        └── components/
            ├── Home.js           # Landing page
            ├── Home.css          # Home styles
            ├── Navigation.js     # Top navigation bar
            ├── Navigation.css    # Navigation styles
            ├── Level1.js         # Authentication bypass challenge
            ├── Level2.js         # Data extraction challenge
            ├── Level3.js         # UNION injection challenge
            └── Level.css         # Shared level styles
```

## 🎮 Features Implemented

### ✅ Backend Features
- **Express Server** on port 5000
- **SQLite Database** with 3 tables:
  - `users` - For authentication bypass
  - `products` - For data extraction
  - `admin_secrets` - For UNION injection
- **3 Vulnerable Endpoints**:
  - `/api/level1/login` - String concatenation vulnerability
  - `/api/level2/search` - LIKE clause injection
  - `/api/level3/profile` - UNION SELECT vulnerability
- **Helper Endpoints**:
  - `/api/levels` - Get level information
  - `/api/health` - Health check
  - `/api/reset` - Reset progress

### ✅ Frontend Features
- **Modern React UI** with gradient design
- **Responsive Layout** - Works on mobile and desktop
- **Navigation System**:
  - Sticky navigation bar
  - Progress tracking (X/3 completed)
  - Reset progress option
  - Active page highlighting
- **Home Page**:
  - Hero section with statistics
  - Level cards with descriptions
  - Educational information
  - Security warnings
- **Level Pages** (All 3):
  - Clear objectives and background
  - Interactive challenge forms
  - Real-time feedback
  - Progressive hint system (3 hints per level)
  - Complete solutions (revealed progressively)
  - Prevention methods and secure code examples
  - Educational content
- **Progress Tracking**:
  - LocalStorage persistence
  - Completion badges
  - Visual progress bar

## 🎓 Educational Content

### Level 1: Authentication Bypass (Easy)
- **Vulnerability**: String concatenation in login query
- **Technique**: SQL comments (`--`)
- **Solution**: `admin'--`
- **Learning**: Basic SQL injection, authentication bypass

### Level 2: Hidden Data Extraction (Medium)
- **Vulnerability**: Unfiltered search with LIKE
- **Technique**: OR logic manipulation
- **Solution**: `' OR 1=1--`
- **Learning**: Boolean-based injection, data extraction

### Level 3: Union-Based Injection (Hard)
- **Vulnerability**: Numeric parameter without validation
- **Technique**: UNION SELECT
- **Solution**: `1 UNION SELECT id, secret_key, secret_value, access_level FROM admin_secrets--`
- **Learning**: Advanced injection, cross-table queries

## 🎨 Design Highlights

### Color Scheme
- **Primary**: Purple gradient (#667eea to #764ba2)
- **Success**: Green (#28a745)
- **Warning**: Yellow (#ffc107)
- **Error**: Red (#dc3545)
- **Background**: White cards on gradient background

### UI/UX Features
- Clean, modern card-based layout
- Smooth transitions and hover effects
- Clear visual hierarchy
- Intuitive navigation
- Mobile-responsive design
- Accessible color contrasts
- Loading states
- Error handling with helpful messages

## 🔧 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite3** - Database
- **CORS** - Cross-origin support
- **Body-parser** - Request parsing

### Frontend
- **React 18** - UI framework
- **React Router v6** - Navigation
- **Axios** - HTTP client
- **CSS3** - Styling (no external UI libraries)

## 📊 Database Schema

### users table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'user'
)
```

### products table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL,
  category TEXT,
  hidden INTEGER DEFAULT 0
)
```

### admin_secrets table
```sql
CREATE TABLE admin_secrets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  secret_key TEXT NOT NULL,
  secret_value TEXT NOT NULL,
  access_level INTEGER DEFAULT 1
)
```

## 🚀 Quick Commands

```powershell
# Install everything
npm run install-all

# Setup database
npm run setup

# Start server (Terminal 1)
npm run start-server

# Start client (Terminal 2)
npm run start-client

# Development mode with auto-reload
npm run dev-server
```

## 🎯 Learning Objectives

Students will learn:
1. How SQL injection vulnerabilities occur
2. Different types of SQL injection attacks
3. Practical exploitation techniques
4. Prevention methods and secure coding
5. Real-world security implications

## 🛡️ Security Features

- **Intentionally Vulnerable** - For education only
- **Isolated Environment** - No external connections
- **Clear Warnings** - Ethical use emphasized
- **No Real Data** - Sample data only
- **Local Only** - Not meant for deployment

## 📈 Success Metrics

- ✅ 3 complete levels with progressive difficulty
- ✅ Clean, intuitive UI inspired by Juice Shop
- ✅ Comprehensive educational content
- ✅ Progressive hint system
- ✅ Complete solutions and prevention guides
- ✅ Progress tracking and persistence
- ✅ Responsive design
- ✅ Detailed documentation

## 🎉 Ready to Use!

The lab is complete and ready for students. Follow the START.md guide to get running!
