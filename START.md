# 🚀 Quick Start Instructions

## First Time Setup

1. **Install dependencies:**
   ```powershell
   cd server
   npm install
   cd ..\client
   npm install
   cd ..
   ```

2. **Setup database:**
   ```powershell
   cd server
   npm run setup
   cd ..
   ```

## Running the Lab

**You need TWO terminal windows:**

### Terminal 1 - Backend Server
```powershell
cd server
npm start
```
Wait for: `🚀 SQL Injection Lab Server running on http://localhost:5000`

### Terminal 2 - Frontend Client
```powershell
cd client
npm start
```
Browser will automatically open to `http://localhost:3000`

## ✅ You're Ready!

The SQL Injection Lab should now be running. Start with Level 1!

## 🔄 Reset Database
```powershell
cd server
npm run setup
```

## 📖 Need Help?
- Read `README.md` for full documentation
- Check `SETUP_GUIDE.md` for troubleshooting
- View `SOLUTIONS.md` for answers (try solving first!)
