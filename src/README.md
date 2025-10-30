# 🏢 ESTAL PropTech Platform

> Modern real estate management dashboard for property owners, managers, and accountants

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web-success)]()
[![Framework](https://img.shields.io/badge/Framework-React_18-61dafb)]()
[![Database](https://img.shields.io/badge/Database-Supabase-3ecf8e)]()
[![Deployment](https://img.shields.io/badge/Deploy-Vercel-black)]()
[![Status](https://img.shields.io/badge/Status-Ready_to_Deploy-green)]()

**🚀 Deployment Status**: Ready for production deployment  
**⏱️ Time to Deploy**: ~15 minutes  
**📘 Quick Start**: See [`/START_HERE_CONNECTION_COMPLETE.md`](/START_HERE_CONNECTION_COMPLETE.md) 🎯 **START HERE**  
**⚡ 3-Step Setup**: [`/QUICK_ACTION_CHECKLIST.md`](/QUICK_ACTION_CHECKLIST.md) ⚡ 15-min complete setup  
**🔌 Supabase**: Connected to `ttsasgbrmswtjtenmksw` ✅ **VERIFIED**

---

## 🎯 Overview

**ESTAL** (formerly KLZ) is a comprehensive PropTech platform designed for real estate professionals who need to:

- 📊 Track property portfolios and performance metrics
- 🔧 Manage maintenance requests and workflows
- 💰 Analyze financial reports and ROI
- 👥 Communicate with tenants and clients
- 📈 Visualize data-driven insights with AI recommendations

**Built with modern technologies**: React, TypeScript, Tailwind CSS, Supabase, and deployed on Vercel's edge network.

---

## ✨ Key Features

### 🎨 **Modern Design System**
- Neutral grayscale palette with soft green accents (#9BAE84)
- 20px rounded corners, soft shadows, clean Inter typography
- Inspired by Notion, Linear, and RealPage dashboards
- Fully responsive: Desktop → Tablet → Mobile

### 🔐 **Role-Based Access Control (3 User Types)**
- **Admin (مدير)**: Full platform access
- **Accountant (محاسب)**: Financial focus (reports, analytics, invoices)
- **Owner (مالك عقار)**: Property management focus (maintenance, tenants)

### 📱 **7 Core Pages**
1. **Dashboard**: Real-time KPIs and analytics
2. **Properties**: Portfolio management with filters
3. **Maintenance**: Request tracking and assignment
4. **Financial Reports**: Revenue, expenses, ROI analysis
5. **Analytics**: Charts, trends, predictive insights
6. **Clients**: Tenant and client management
7. **User Management**: Admin-only user controls

### 🤖 **AI-Driven Intelligence**
- Predictive maintenance alerts
- Financial trend analysis
- Anomaly detection for security
- Smart notifications and recommendations

### 🚀 **Developer Experience**
- TypeScript for type safety
- Component-based architecture
- Shadcn/UI component library
- KV Store for optimized data access
- Automated deployment via Vercel

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Supabase account (free tier works)
- Vercel account for deployment (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/EstalProptech/Estal.git
cd Estal

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Demo Login (Instant Access)

No database setup required! Use these demo credentials:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@estal.com | admin123 |
| **Accountant** | accountant@estal.com | accountant123 |
| **Owner** | owner@estal.com | owner123 |

---

## 📚 Documentation

### 🚀 Quick Start Guides
- **[START HERE](./START_HERE.md)** - Complete overview and next steps
- **[Quick Deploy (20 min)](./QUICK_DEPLOY.md)** - Fastest path to production
- **[Database Deployment](./DATABASE_DEPLOYMENT_NOW.md)** - Step-by-step database setup

### 🔧 Backend Setup
- 🗄️ [Database Setup Guide](./SUPABASE_DATABASE_SETUP.md) - PostgreSQL schema deployment
- 🔐 [Environment Setup](./ENVIRONMENT_SETUP.md) - API keys and credentials
- ⚡ [Edge Function Deployment](./DEPLOY_EDGE_FUNCTION.md) - API deployment

### 🌐 Deployment
- ✅ [Final Deployment Checklist](./FINAL_DEPLOYMENT_CHECKLIST.md) - Complete verification
- 🚀 [Production Deployment](./docs/DEPLOYMENT_GUIDE.md) - Vercel hosting
- 🌍 [Custom Domain Setup](./DOMAIN_SETUP_QUICK_START.md) - DNS configuration
- 📦 [Git Setup Guide](./GIT_SETUP_GUIDE.md) - Version control

### 📖 Features & Usage
- 🔑 [Authentication Guide](./docs/AUTHENTICATION_GUIDE.md) - User management
- 🏗️ [Data Flow Diagram](./docs/KV_STORE_DATA_FLOW_DIAGRAM.md) - Backend architecture
- 📊 [Performance Optimization](./docs/PERFORMANCE_OPTIMIZATION_REPORT.md) - Speed tips
- 🔒 [Security Guide](./docs/SECURITY_QUICK_REFERENCE.md) - Best practices

### 🆘 Support
- 🐛 [Troubleshooting](./docs/TROUBLESHOOTING.md) - Common issues and solutions
- 📱 [Mobile Testing](./docs/MOBILE_TESTING_GUIDE.md) - Device compatibility
- 🤝 [Contributing](./CONTRIBUTING.md) - How to contribute

**Full documentation index**: [docs/README.md](./docs/README.md)

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS v4, Shadcn/UI |
| **Backend** | Supabase (Auth, Database, Storage, Edge Functions) |
| **Database** | PostgreSQL + KV Store |
| **Deployment** | Vercel (Edge Network) |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Animation** | Motion/React (Framer Motion) |

---

## 📁 Project Structure

```
estal-platform/
├── components/           # React components
│   ├── ui/              # Shadcn UI components
│   ├── figma/           # Figma import utilities
│   ├── AuthContext.tsx  # Authentication provider
│   ├── *View.tsx        # Page components
│   └── ...
├── data/                # Mock/demo data
├── docs/                # 📚 Complete documentation
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and clients
├── styles/              # Global CSS and design tokens
├── supabase/            # Backend functions and SQL
│   └── functions/
│       └── server/      # Hono edge functions
├── utils/               # Helper functions
└── App.tsx              # Main application entry
```

---

## 🎨 Design System

### Color Palette

```css
--background: #F5F5F1;     /* Soft gray background */
--card: #FFFFFF;            /* Clean white cards */
--primary: #9BAE84;         /* Soft green accent */
--secondary: #7A8F6C;       /* Darker green */
--text: #1A1A1A;            /* Near black text */
--muted: #6B7280;           /* Gray text */
```

### Typography

- **Font Family**: Inter (Google Fonts)
- **Border Radius**: 20px (modern, friendly)
- **Shadows**: Soft, layered elevation
- **Spacing**: 8px base unit

Full design tokens: [docs/DESIGN_TOKENS.md](./docs/DESIGN_TOKENS.md)

---

## 🔒 Security

- ✅ Role-based access control (RBAC)
- ✅ Supabase Row Level Security (RLS)
- ✅ HTTPS-only (enforced by Vercel)
- ✅ Secure session management
- ✅ Environment variable protection
- ✅ Input validation and sanitization

**Security audit**: [docs/SECURITY_GUIDE.md](./docs/SECURITY_GUIDE.md)

---

## 📊 Performance

- ⚡ First Contentful Paint: < 1.8s
- ⚡ Lighthouse Score: 90+
- ⚡ Bundle Size: < 500KB (gzipped)
- ⚡ Edge caching via Vercel CDN
- ⚡ Lazy loading for routes and images

**Optimization guide**: [docs/PERFORMANCE_OPTIMIZATION.md](./docs/PERFORMANCE_OPTIMIZATION.md)

---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](./CONTRIBUTING.md) before submitting PRs.

### Development Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and test
npm run dev

# Build and verify
npm run build
npm run preview

# Commit with conventional commits
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/your-feature
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 📞 Support & Contact

- **Documentation**: [docs/README.md](./docs/README.md)
- **GitHub Repository**: [EstalProptech/Estal](https://github.com/EstalProptech/Estal)
- **Issues**: [GitHub Issues](https://github.com/EstalProptech/Estal/issues)
- **Troubleshooting**: [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)

### 🚨 Common Issues & Quick Fixes

**Connection & Setup:**
- **Quick Start**: [QUICK_ACTION_CHECKLIST.md](./QUICK_ACTION_CHECKLIST.md) ⚡ 15-min complete setup
- **Verify Connection**: [SUPABASE_CONNECTION_VERIFIED.md](./SUPABASE_CONNECTION_VERIFIED.md) ✅ Connection status

**Database Errors:**
- **"Column user_id does not exist"**: [FIX_USER_ID_ERROR_NOW.md](./FIX_USER_ID_ERROR_NOW.md) ⚡ 3-min fix
- **"LINE 1: /supabase/functions/..."**: [FIX_SQL_PATH_ERROR.md](./FIX_SQL_PATH_ERROR.md) ⚡ 2-min fix  
- **Database setup guide**: [DATABASE_FIX_USER_ID_ERROR.md](./DATABASE_FIX_USER_ID_ERROR.md)
- **Architecture explained**: [DATABASE_ARCHITECTURE_DIAGRAM.md](./DATABASE_ARCHITECTURE_DIAGRAM.md)

**Edge Function Errors:**
- **"Module not found: securityMiddleware"**: [SUPABASE_MODULE_ERROR_QUICK_FIX.md](./SUPABASE_MODULE_ERROR_QUICK_FIX.md) ⚡ 3-min fix
- **Complete troubleshooting**: [FIX_SUPABASE_MODULE_ERROR.md](./FIX_SUPABASE_MODULE_ERROR.md)

**Security Setup:**
- **Row Level Security (RLS)**: [RLS_QUICK_REFERENCE.md](./RLS_QUICK_REFERENCE.md) ⚡ 5-min setup
- **Complete RLS guide**: [SETUP_RLS_ESTALPROPTECH_TABLE.md](./SETUP_RLS_ESTALPROPTECH_TABLE.md)

---

## 🗺️ Roadmap

- [x] Core dashboard with RBAC
- [x] Authentication system (demo + production)
- [x] 7 main pages with responsive design
- [x] AI insights and predictive analytics
- [x] Supabase backend integration
- [x] Vercel deployment ready
- [ ] 2FA authentication
- [ ] Multi-language support (Arabic + English)
- [ ] Mobile app (React Native)
- [ ] Third-party integrations (payment gateways, accounting software)
- [ ] Multi-tenant architecture for SaaS

---

## 🙏 Acknowledgments

- **Design Inspiration**: Notion, Linear, RealPage
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/)
- **Icons**: [Lucide](https://lucide.dev/)
- **Backend**: [Supabase](https://supabase.com/)
- **Hosting**: [Vercel](https://vercel.com/)

---

<div align="center">

**Built with ❤️ by the ESTAL Development Team**

[Documentation](./docs) • [Quick Start](./QUICK_START.md) • [Contributing](./CONTRIBUTING.md)

</div>
