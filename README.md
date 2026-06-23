# 💰 BudgetWise

> **A Modern Personal Finance Dashboard for Smart Money Management**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![C++](https://img.shields.io/badge/C++-Backend-00599C?style=for-the-badge&logo=cplusplus)](https://cplusplus.com/)

---

## 📋 Table of Contents

- [About](#about)
- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [📦 Prerequisites](#-prerequisites)
- [🚀 Getting Started](#-getting-started)
- [💻 Usage Guide](#-usage-guide)
- [📁 Project Structure](#-project-structure)
- [🔐 Authentication](#-authentication)
- [📊 Available Routes](#-available-routes)
- [🐳 Docker Deployment](#-docker-deployment)

---

## About

**BudgetWise** is a comprehensive personal finance management dashboard designed to help you take control of your money. Track expenses, manage budgets, analyze spending patterns, and make informed financial decisions with beautiful visualizations and intelligent insights.

Whether you're saving for a goal, managing monthly expenses, or optimizing your spending habits, BudgetWise provides the tools you need to achieve financial wellness.

---

## ✨ Features

### 📊 **Dashboard & Analytics**
- **Interactive Summary Cards** - Quick overview of your financial status
- **Expense Pie Chart** - Visualize spending distribution across categories
- **Monthly Line Chart** - Track spending trends over time
- **Savings Trend Chart** - Monitor your savings progress
- **Category Bar Chart** - Compare expenses by category

### 💳 **Budget Management**
- **Budget Tracking** - Create and monitor budget limits
- **Budget Progress Bars** - Visual indicators of budget usage
- **Smart Budget Optimizer** - AI-powered suggestions to optimize spending

### 🔄 **Transaction Management**
- **Transaction Recording** - Log income and expenses with details
- **Recent Transactions List** - Quick view of latest activities
- **Transaction Filtering & Search** - Find transactions easily
- **Delete & Manage** - Full control over your transaction history

### 📈 **Reports & Insights**
- **Financial Reports** - Comprehensive expense and income analysis
- **Insights Timeline** - Smart insights about your spending patterns
- **PDF Export** - Generate and download financial reports
- **Monthly Analytics** - Detailed breakdowns of monthly finances

### 🎨 **User Experience**
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations** - Framer Motion & GSAP for fluid interactions
- **Dark/Light Theme Support** - Customizable interface appearance
- **Quick Actions** - Fast access to common features
- **Command Palette** - Quick navigation and actions

---

## 🛠 Tech Stack

### **Frontend**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.1.6 | React framework with SSR & static generation |
| **React** | 19.2.3 | UI component library |
| **Tailwind CSS** | 4 | Utility-first CSS framework |
| **Chart.js** | 4.5.1 | Data visualization |
| **Framer Motion** | 12.38.0 | Animation library |
| **GSAP** | 3.15.0 | Advanced animations |
| **Lucide React** | 0.577.0 | Icon library |
| **React Lenis** | 0.0.47 | Smooth scrolling |
| **NextAuth.js** | 4.24.14 | Authentication & session management |
| **Axios** | 1.13.6 | HTTP client |
| **jsPDF** | 4.2.1 | PDF generation |

### **Backend**
| Technology | Purpose |
|-----------|---------|
| **C++** | High-performance backend server |
| **http-lib** | HTTP server library |
| **JSON (nlohmann)** | JSON parsing and serialization |

### **DevOps & Deployment**
- **Docker** - Containerization
- **Fly.io** - Cloud hosting platform
- **ESLint** - Code quality & linting

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package managers
- **Git** - Version control
- **C++ Compiler** (for backend development) - [MinGW](https://www.mingw-w64.org/) or [MSVC](https://visualstudio.microsoft.com/)
- **Docker** (optional, for containerized deployment) - [Download](https://www.docker.com/)

---

## 🚀 Getting Started

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/alimurtazatweet/budgetwise.git
cd budgetwise
```

### **Step 2: Install Dependencies**
```bash
npm install
# or with yarn
yarn install
```

### **Step 3: Set Up Environment Variables**

Create a `.env.local` file in the root directory:
```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8080

# Database/File paths (if applicable)
DATABASE_PATH=./data
```

### **Step 4: Run the Development Server**

**Frontend Only:**
```bash
npm run dev
```
The application will open at [http://localhost:3000](http://localhost:3000)

**With Backend (C++):**
```bash
# Terminal 1 - Start C++ backend
cd backend
# Compile and run your C++ backend

# Terminal 2 - Start Next.js frontend
npm run dev
```

### **Step 5: Verify Installation**
- Frontend loads at `http://localhost:3000`
- You should see the login/registration page
- Navigate through the dashboard after authentication

---

## 💻 Usage Guide

### **Getting Started with BudgetWise**

#### **1. Create Your Account**
- Click **Register** on the login page
- Enter your email and create a secure password
- Verify your email (if applicable)

#### **2. Set Up Your Budget**
- Navigate to **Budgets** page
- Click **Create Budget** 
- Set spending limits for different categories (e.g., Food, Transport, Entertainment)
- Save your budget configuration

#### **3. Record Your Transactions**
- Go to **Transactions** page
- Click **Add Transaction**
- Fill in:
  - **Amount** - How much you spent/earned
  - **Category** - What it was for
  - **Date** - When it happened
  - **Description** - Any notes
- Click **Save** to log the transaction

#### **4. Review Your Dashboard**
- **Summary Cards** - See total expenses, income, and balance
- **Charts** - Visualize where your money is going
- **Recent Transactions** - Quick view of latest activity
- **Quick Actions** - Fast access to common tasks

#### **5. Analyze Reports**
- Visit **Reports** page for detailed financial analysis
- **Monthly Analytics** - Break down by month
- **Category Analysis** - See spending by category
- **Export as PDF** - Download reports for record-keeping

#### **6. Get Smart Insights**
- Check **Analytics** for:
  - Spending trends over time
  - Savings progress
  - Budget optimization suggestions
  - Unusual spending patterns

#### **7. Optimize Your Budget**
- Use the **Smart Budget Optimizer** feature
- Get AI-powered recommendations to:
  - Reduce spending in high-cost categories
  - Identify savings opportunities
  - Improve your financial health

#### **8. Customize Your Experience**
- Go to **Settings**
- Adjust display preferences
- Choose theme (dark/light)
- Manage notification preferences

---

## 📁 Project Structure

```
budgetwise/
├── pages/                    # Next.js pages & API routes
│   ├── _app.js             # App wrapper & theme setup
│   ├── _document.js        # HTML document structure
│   ├── dashboard.js        # Main dashboard
│   ├── login.js            # Authentication page
│   ├── transactions.js     # Transactions management
│   ├── budgets.js          # Budget tracking
│   ├── analytics.js        # Analytics & insights
│   ├── reports.js          # Financial reports
│   ├── settings.js         # User settings
│   ├── premium.js          # Premium features
│   └── api/                # Backend API routes
│       ├── auth/           # Authentication endpoints
│       ├── transaction/    # Transaction endpoints
│       └── budgets/        # Budget endpoints
│
├── components/             # Reusable React components
│   ├── DashboardLayout.jsx # Main layout wrapper
│   ├── Navbar.jsx          # Top navigation
│   ├── Sidebar.jsx         # Side navigation
│   ├── SummaryCards.jsx    # Financial overview cards
│   ├── ExpensePieChart.jsx # Category distribution chart
│   ├── MonthlyLineChart.jsx # Spending trend chart
│   ├── BudgetProgress.jsx  # Budget usage indicators
│   ├── RecentTransactions.jsx # Latest transactions list
│   ├── InsightsTimeline.jsx   # Smart insights display
│   ├── CategoryBarChart.jsx   # Category comparison chart
│   ├── SavingsTrendChart.jsx  # Savings progress chart
│   ├── QuickActions.jsx    # Fast action buttons
│   ├── CommandPalette.jsx  # Command search
│   └── ThemeProvider.jsx   # Theme management
│
├── styles/                 # Global styles
│   └── globals.css         # Tailwind CSS
│
├── utils/                  # Utility functions
│   ├── api.js             # API helper functions
│   ├── budgetOptimizer.js # Smart optimizer logic
│   ├── insights.js        # Insight generation
│   └── sanitize.js        # Data sanitization
│
├── data/                   # JSON data files
│   ├── users.json         # User data
│   ├── transactions.json  # Transaction records
│   └── budgets.json       # Budget configurations
│
├── backend/               # C++ Backend
│   ├── main.cpp          # Server entry point
│   ├── api/              # API route handlers
│   │   ├── routes.cpp
│   │   └── server.cpp
│   ├── core/             # Core business logic
│   │   ├── User.cpp/h
│   │   ├── Transaction.cpp/h
│   │   ├── Budget.cpp/h
│   │   └── Analytics.cpp/h
│   ├── managers/         # Data managers
│   │   ├── UserManager.cpp/h
│   │   ├── TransactionManager.cpp/h
│   │   └── BudgetManager.cpp/h
│   ├── utils/            # Backend utilities
│   │   ├── Crypto.h      # Encryption
│   │   └── FileHandler.cpp/h # File operations
│   └── include/          # External headers
│
├── public/                # Static assets
│   └── assets/
│
├── package.json           # Dependencies
├── next.config.mjs        # Next.js configuration
├── tailwind.config.js     # Tailwind CSS config
├── postcss.config.mjs     # PostCSS config
├── Dockerfile             # Container image
├── fly.toml              # Fly.io deployment config
└── README.md             # This file
```

---

## 🔐 Authentication

BudgetWise uses **NextAuth.js** for secure authentication:

- **Session Management** - Secure session tokens
- **Protected Routes** - Automatic redirection for unauthorized access

### **Authentication Flow:**
1. User registers or logs in
2. Credentials are validated against backend
3. JWT token is issued for API requests
4. Token is stored in secure HTTP-only cookies
5. Token is automatically refreshed as needed

---

## 📊 Available Routes

### **Public Pages**
- `GET /` - Landing page
- `GET /login` - Login page
- `GET /register` - Registration page

### **Protected Pages** (Requires Authentication)
- `GET /dashboard` - Main dashboard with overview
- `GET /transactions` - Transaction list and management
- `GET /budgets` - Budget tracking and creation
- `GET /reports` - Financial reports and analysis
- `GET /analytics` - Detailed analytics and insights
- `GET /notifications` - Notifications and alerts
- `GET /settings` - User preferences and settings
- `GET /premium` - Premium features and upgrades

### **API Routes**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/user` - Get user profile
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - List transactions
- `DELETE /api/transaction/delete` - Delete transaction
- `POST /api/budgets` - Create budget
- `GET /api/budgets` - List budgets
- `POST /api/budgets/optimize` - Get budget optimization suggestions
- `GET /api/analytics` - Get analytics data

---

## 🐳 Docker Deployment

### **Build Docker Image**
```bash
docker build -t budgetwise:latest .
```

### **Run Container Locally**
```bash
docker run -p 3000:3000 \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e NEXTAUTH_SECRET=your-secret \
  budgetwise:latest
```

### **Deploy to Fly.io**
```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login to Fly
flyctl auth login

# Deploy
flyctl deploy
```

The configuration is already set up in `fly.toml` - just update with your app name and custom domain.

---

## 🚀 Build & Production

### **Create Production Build**
```bash
npm run build
npm start
```

### **Export Static Site** (if not using SSR)
```bash
npm run export
```

### **Lint Code Quality**
```bash
npm run lint
```

---

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] Recurring transactions
- [ ] Bill reminders
- [ ] Multi-user accounts
- [ ] Investment tracking
- [ ] Advanced forecasting
- [ ] AI-powered insights

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 💡 Tips for Best Results

✅ **Do:**
- Regularly update your transactions for accurate insights
- Set realistic budget limits
- Review reports monthly
- Use the PDF export for record-keeping
- Enable notifications for budget alerts

❌ **Don't:**
- Share your login credentials
- Use the same password across platforms
- Ignore budget warnings
- Delete important transaction records

---

## 🆘 Support & Troubleshooting

### **Common Issues**

**Q: Application won't start**
- Ensure Node.js v18+ is installed
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check that port 3000 is available

**Q: API requests failing**
- Verify backend server is running
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure CORS is properly configured

**Q: Authentication not working**
- Generate a new `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- Clear browser cookies and cache
- Verify `NEXTAUTH_URL` matches your domain

**Q: Charts not displaying**
- Ensure Chart.js is properly installed
- Check browser console for JavaScript errors
- Verify data is being fetched from the API

---

## 📞 Contact & Support

- **Issues** - Open an issue on GitHub
- **Email** - contact@budgetwise.com OR alimurtazatweet@gmail.com

---

## 🌟 Show Your Support

If you find BudgetWise helpful, you can:
- ⭐ Star this repository
- 🐛 Report bugs and issues
- 💬 Share feedback and suggestions

---

**Happy budgeting! 💰✨**

*Last Updated: June 23, 2026*