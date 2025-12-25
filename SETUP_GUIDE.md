# 🚀 Setup Guide - SQL Injection Lab

This guide will walk you through setting up the SQL Injection Lab step by step.

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js** (version 14 or higher)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`
  
- **npm** (comes with Node.js)
  - Verify installation: `npm --version`

## 🔧 Installation Steps

### Step 1: Navigate to Project Directory

```bash
cd sqli
```

### Step 2: Install Server Dependencies

```bash
cd server
npm install
```

This will install:
- express (web server)
- cors (cross-origin resource sharing)
- sqlite3 (database)
- body-parser (request parsing)

### Step 3: Install Client Dependencies

```bash
cd ../client
npm install
```

This will install:
- react & react-dom (UI framework)
- react-router-dom (navigation)
- axios (HTTP client)
- react-scripts (build tools)

### Step 4: Initialize the Database

```bash
cd ../server
npm run setup
```

You should see:
```
✅ Database setup complete!
📊 Tables created: users, products, admin_secrets
🎯 Ready for SQL Injection Lab!
```

## 🎮 Running the Application

### Option A — Run Using Docker (recommended for quick start)

This will build the image and run the lab with the server serving the built client. It is the fastest way to get the full app running in a containerized environment.

From the project root run:

```bash
docker-compose up -d --build
```

- Open the app in your browser at: `http://localhost` (Traefik/router configuration may use port 80)
- View container logs:

```bash
docker-compose logs -f
```

To stop and remove containers:

```bash
docker-compose down
```

If you need to force rebuild the images:

```bash
docker-compose up -d --build --force-recreate
```

### Option B — Run Locally with npm (development)

Use this when developing the client and server separately. Start the database seed, backend, then client.

**Terminal 1 — Initialize the database (required once or when you want new flags):**
```bash
cd server
npm run setup
```

**Terminal 2 — Start the Backend:**
```bash
cd server
npm start
```

You should see the server start message and the port it listens on.

**Terminal 3 — Start the Frontend:**
```bash
cd client
npm start
```

The React app will open at `http://localhost:3000` by default.

## ✅ Verify Installation

1. **Check Server**: Visit `http://localhost:5000/api/health`
   - You should see: `{"status":"OK","message":"SQL Injection Lab Server is running"}`

2. **Check Client**: Visit `http://localhost:3000`
   - You should see the SQL Injection Lab home page

3. **Test a Level**: Click on "Level 1" and try the login form

## 🐛 Troubleshooting

### Problem: "Port 5000 already in use"

**Solution**: Kill the process using port 5000 or change the port

**Windows:**
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:5000 | xargs kill -9
```

Or change the port in `server/server.js`:
```javascript
const PORT = 5001; // Change to any available port
```

### Problem: "Port 3000 already in use"

**Solution**: The client will prompt you to use a different port (usually 3001). Type 'Y' to accept.

### Problem: Database errors

**Solution**: Re-initialize the database
```bash
cd server
npm run setup
```

### Problem: Module not found errors

**Solution**: Reinstall dependencies
```bash
# In server directory
npm install

# In client directory
cd ../client
npm install
```

### Problem: React app won't start

**Solution**: Clear cache and reinstall
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

## 🔄 Reset Everything

If you want to start fresh:

```bash
# Remove all dependencies
rm -rf server/node_modules client/node_modules

# Remove database
rm server/*.db

# Reinstall everything
cd server && npm install
cd ../client && npm install

# Reinitialize database
cd ../server && npm run setup
```

## 📱 Accessing from Other Devices

To access the lab from other devices on your network:

1. Find your computer's IP address:
   - **Windows**: `ipconfig`
   - **Mac/Linux**: `ifconfig` or `ip addr`

2. Update CORS settings in `server/server.js` if needed

3. Access from other devices:
   - Frontend: `http://YOUR_IP:3000`
   - Backend: `http://YOUR_IP:5000`

## 🎯 Next Steps

Once everything is running:

1. Visit `http://localhost:3000`
2. Read the home page introduction
3. Start with Level 1
4. Progress through all three levels
5. Learn and have fun! 🎓

## 📞 Need Help?

If you encounter issues:

1. Check that Node.js is properly installed
2. Ensure all dependencies are installed
3. Verify both servers are running
4. Check the browser console for errors
5. Check the server terminal for error messages

## 🎉 You're Ready!

If you see the SQL Injection Lab home page, you're all set! Start learning and enjoy the lab.

**Remember**: This is for educational purposes only. Always practice ethical hacking! 🛡️
