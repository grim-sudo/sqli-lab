# 🚀 Get Started - SQL Injection Lab

## Welcome! 👋

You now have a complete, production-ready SQL Injection Lab inspired by OWASP Juice Shop!

---

## ⚡ Quick Start (5 Minutes)

### 1️⃣ Install Dependencies
Open PowerShell in the `sqli` folder:

```powershell
cd server
npm install
cd ..\client
npm install
cd ..
```

### 2️⃣ Setup Database
```powershell
cd server
npm run setup
```

You should see: ✅ Database setup complete!

### 3️⃣ Start the Lab

**Terminal 1 (Server):**
```powershell
cd server
npm start
```

**Terminal 2 (Client):**
```powershell
cd client
npm start
```

### 4️⃣ Open Browser
Go to: **http://localhost:3000**

---

## 🎯 What You've Got

### ✨ Features
- **3 Progressive Levels**: Easy → Medium → Hard
- **Clean Modern UI**: Purple gradient theme, responsive design
- **Educational Content**: Objectives, hints, solutions, prevention guides
- **Progress Tracking**: LocalStorage persistence, completion badges
- **User-Friendly Navigation**: Sticky navbar, visual progress bar

### 📊 The Levels

**Level 1: Authentication Bypass** (Easy)
- Bypass login using SQL comments
- Solution: `admin'--`

**Level 2: Hidden Data Extraction** (Medium)
- Extract hidden products with OR logic
- Solution: `' OR 1=1--`

**Level 3: Union-Based Injection** (Hard)
- Use UNION SELECT for cross-table queries
- Solution: `1 UNION SELECT id, secret_key, secret_value, access_level FROM admin_secrets--`

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| **START.md** | Quick reference for running the lab |
| **README.md** | Complete documentation |
| **SETUP_GUIDE.md** | Detailed setup & troubleshooting |
| **SOLUTIONS.md** | Complete solutions (for instructors) |
| **TEACHING_GUIDE.md** | For educators using this in courses |
| **ARCHITECTURE.md** | Technical architecture & diagrams |
| **PROJECT_OVERVIEW.md** | Feature list & project structure |

---

## 🎓 For Students

1. **Start with the home page** - Read about each level
2. **Try Level 1 first** - It's the easiest
3. **Use hints if stuck** - They reveal progressively
4. **Learn from solutions** - Understand why they work
5. **Read prevention methods** - Learn secure coding

**Remember**: This is for education only. Never use these techniques on systems you don't own!

---

## 👨‍🏫 For Instructors

1. **Review TEACHING_GUIDE.md** - Lesson plans & strategies
2. **Check SOLUTIONS.md** - All answers & explanations
3. **Read ARCHITECTURE.md** - Understand the technical design
4. **Customize if needed** - Add your own levels or branding

**Suggested time**: 3-4 hours total (can split across sessions)

---

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- SQLite3 database
- Intentionally vulnerable endpoints

**Frontend:**
- React 18
- React Router v6
- Axios for HTTP
- Pure CSS (no frameworks)

---

## 🎨 UI Highlights

- **Modern gradient design** (purple theme)
- **Card-based layout** for clean organization
- **Responsive** - works on mobile & desktop
- **Smooth animations** and hover effects
- **Clear visual hierarchy** for easy navigation
- **Progress indicators** throughout

---

## 🔧 Common Commands

```powershell
# Install everything
npm run install-all

# Setup database
cd server
npm run setup

# Start server
cd server
npm start

# Start client (in new terminal)
cd client
npm start

# Reset database
cd server
npm run setup
```

---

## ❓ Troubleshooting

### Port 5000 in use?
Change the port in `server/server.js`:
```javascript
const PORT = 5001; // or any available port
```

### Database errors?
Re-run setup:
```powershell
cd server
npm run setup
```

### Module not found?
Reinstall dependencies:
```powershell
cd server
npm install
cd ..\client
npm install
```

### More help?
Check **SETUP_GUIDE.md** for detailed troubleshooting.

---

## 🎯 Success Criteria

You'll know it's working when:
- ✅ Server shows: "SQL Injection Lab Server running on http://localhost:5000"
- ✅ Browser opens to http://localhost:3000
- ✅ You see the purple gradient home page
- ✅ You can navigate between levels
- ✅ You can submit forms and see responses

---

## 🌟 What Makes This Special

### Inspired by Juice Shop
- Progressive difficulty
- Educational focus
- Real vulnerabilities
- Clean, modern UI

### Student-Friendly
- Clear objectives
- Progressive hints
- Complete solutions
- Prevention guides
- Visual feedback

### Instructor-Ready
- Comprehensive documentation
- Teaching guide included
- Grading rubric provided
- Customizable content

---

## 🎉 You're Ready!

Everything is set up and ready to go. Just follow the Quick Start steps above and you'll be learning SQL injection in minutes!

### Next Steps:
1. ⚡ Run the Quick Start commands
2. 🌐 Open http://localhost:3000
3. 🎮 Start with Level 1
4. 📚 Learn and have fun!

---

## 📞 Need Help?

- **Setup issues?** → SETUP_GUIDE.md
- **Want to teach?** → TEACHING_GUIDE.md
- **Need answers?** → SOLUTIONS.md
- **Technical details?** → ARCHITECTURE.md

---

## ⚠️ Important Reminder

This lab contains **intentionally vulnerable code** for educational purposes.

**DO NOT:**
- Deploy to production
- Use on real systems
- Test without permission
- Store real data

**DO:**
- Learn and practice
- Use ethically
- Improve security
- Share knowledge

---

## 🎓 Learning Outcomes

After completing this lab, you'll understand:
- ✅ How SQL injection works
- ✅ Different attack techniques
- ✅ Real-world security implications
- ✅ How to write secure code
- ✅ Prevention best practices

---

**Happy Learning! Stay Ethical! 🛡️**

*Built with ❤️ for cybersecurity education*
