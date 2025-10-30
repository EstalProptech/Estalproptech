# ⚡ ESTAL Platform - Quick Start Guide

Get the ESTAL PropTech platform running in **under 5 minutes**.

---

## 🎯 Instant Demo (No Setup Required)

1. **Start the development server**:
   ```bash
   npm install
   npm run dev
   ```

2. **Open in browser**: http://localhost:5173

3. **Login with demo credentials**:
   - **Admin**: `admin@estal.com` / `admin123`
   - **Accountant**: `accountant@estal.com` / `accountant123`
   - **Owner**: `owner@estal.com` / `owner123`

4. **Explore!** No database setup needed for demo mode.

---

## 📦 Prerequisites

- **Node.js**: Version 18 or higher ([Download](https://nodejs.org/))
- **npm**: Version 9 or higher (comes with Node.js)
- **Git**: For version control ([Download](https://git-scm.com/))

**Verify installation**:
```bash
node -v   # Should be v18.0.0 or higher
npm -v    # Should be 9.0.0 or higher
```

---

## 🚀 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/estal-platform.git
cd estal-platform
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- React 18
- TypeScript
- Tailwind CSS
- Supabase client
- All UI components and utilities

### 3. Start Development Server

```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 4. Open in Browser

Navigate to **http://localhost:5173**

You'll see the ESTAL login page.

---

## 🔐 Demo Login

Click **"Try Demo Account"** and select a role:

- 👨‍💼 **Admin** - Full platform access
- 💰 **Accountant** - Financial reports focus
- 🏢 **Owner** - Property management focus

Or manually enter:
- Email: `admin@estal.com`
- Password: `admin123`

---

## 📱 Test Responsive Design

### Desktop View (Default)
- Open at full screen width (1920px recommended)
- Sidebar navigation visible

### Tablet View
- Resize browser to 768px - 1024px
- Sidebar collapses, navigation adapts

### Mobile View
- Resize to < 768px width
- Hamburger menu appears
- Touch-optimized interactions

**Pro Tip**: Use Chrome DevTools (F12) → Toggle Device Toolbar (Ctrl+Shift+M) to test different screen sizes.

---

## 🛠️ Available Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript checks

# Testing (coming soon)
npm run test             # Run unit tests
npm run test:e2e         # Run end-to-end tests
```

---

## 📁 Project Overview

```
estal-platform/
├── components/          # React components (UI, pages, context)
├── data/               # Demo/mock data for testing
├── docs/               # 📚 Complete documentation
├── hooks/              # Custom React hooks
├── styles/             # Global CSS and Tailwind config
├── utils/              # Helper functions
├── App.tsx             # Main application entry point
└── README.md           # Project overview
```

---

## 🎨 Key Features to Explore

### 1. Dashboard View
- Real-time KPIs (properties, revenue, expenses)
- Animated counters
- Interactive charts (Recharts)
- AI insights panel

### 2. Properties Management
- Search and filter properties
- Add/Edit property details
- View property analytics
- Occupancy tracking

### 3. Maintenance Requests
- Create and assign tickets
- Priority levels (Low, Medium, High)
- Status tracking (New, In Progress, Completed)
- Cost estimation

### 4. Financial Reports
- Monthly revenue/expense breakdown
- ROI calculations
- Export to PDF/Excel (coming soon)
- Trend analysis

### 5. Analytics
- Predictive insights
- Occupancy trends
- Revenue forecasting
- Security alerts

### 6. Role-Based Access
- Different dashboards per role
- Page-level access control
- Feature restrictions based on permissions

---

## 🔄 Next Steps

### For Users
→ Explore the [User Manual](./docs/user-guides/USER_MANUAL_EN.md)

### For Developers
→ Read the [Architecture Guide](./docs/ARCHITECTURE.md)
→ Check [Component Library](./docs/COMPONENT_LIBRARY.md)

### For Deployment
→ Follow the [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)
→ Set up [Supabase Backend](./docs/SUPABASE_SETUP.md)

---

## 🐛 Troubleshooting

### Port Already in Use

If you see `Port 5173 is already in use`:

```bash
# Kill the process using port 5173
npx kill-port 5173

# Or use a different port
npm run dev -- --port 3000
```

### Dependencies Install Failed

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Demo Login Not Working

- ✅ Use exact credentials: `admin@estal.com` / `admin123` (case-sensitive)
- ✅ Clear browser cache: Ctrl+Shift+Delete
- ✅ Try incognito mode
- ✅ Check browser console for errors (F12)

**More help**: [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)

---

## 📞 Need Help?

1. **Check Documentation**: [docs/README.md](./docs/README.md)
2. **Common Issues**: [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
3. **GitHub Issues**: Submit a bug report or feature request
4. **Authentication Guide**: [docs/AUTHENTICATION_GUIDE.md](./docs/AUTHENTICATION_GUIDE.md)

---

## 🎉 You're Ready!

The ESTAL platform is now running locally. 

**Explore the demo, test features, and start building!**

For production deployment, follow the [Complete Deployment Guide](./docs/DEPLOYMENT_GUIDE.md).

---

**Happy coding! 🚀**
