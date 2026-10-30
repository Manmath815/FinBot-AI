# FinBot AI — Digital Financial Literacy Chatbot

> **AI-Powered Digital Financial Literacy Assistant** built using **IBM Watsonx.ai**, **IBM Granite Models**, **Python FastAPI**, and **React + TypeScript + Tailwind CSS**.

FinBot AI is an intelligent financial technology companion designed to empower Indian citizens, students, and beginners with practical digital financial literacy. It features digital payment safety (UPI / QR codes), fraud and scam detection, investment planning (SIP, compounding), salary budgeting (50/30/20), interactive financial calculators, and multi-lingual conversation support across major Indian languages.

---

## 📸 Reference Screenshots & Design Reproduction

The interface matches the reference design with high fidelity:

1. **FinBot AI Chat Interface**:
   - **Left Column**: 10 clickable Quick Prompts (UPI Safety, Avoid Scams, Start SIP, Compound Interest, 50/30/20 Budget, Govt Schemes, CIBIL Score, UPI PIN vs OTP, Emergency Fund, Tax Basics) & About FinBot with IBM Granite badge.
   - **Center Column**: AI Chat Assistant with online status, clear chat button, markdown financial formatting, bullet points, interactive prompts, and character counter (`0/1000`).
   - **Right Column**: Verified Indian Fraud Hotlines (**1930** Cyber Crime Helpline, **14431** DigiSaathi, RBI Helpline, Bank Fraud Helpline) and official portals (RBI India, Cyber Crime Portal, NCFE, SEBI Investor Ed, MyMoney.gov.in).
2. **FinBot AI Financial Calculators Interface**:
   - Two-column grid of financial calculator cards with blue-purple gradient headers:
     - **SIP Calculator** (Monthly investment, return rate %, investment period years, visual maturity breakdown).
     - **Loan EMI Calculator** (Loan amount, annual interest rate, loan tenure, monthly EMI & interest ratio).
     - **Compound Interest Calculator** (Compounding frequency: monthly, quarterly, half-yearly, annually).
     - **50/30/20 Budget Planner** (Interactive Needs %, Wants %, Savings % allocation).
     - **Savings Goal Calculator** & **Simple Interest Calculator**.
3. **FinBot AI Dashboard & Management**:
   - Financial Literacy Health score, active savings goals progress, 50/30/20 budget visual summary, quick action shortcuts, scam checker, and learning modules.

---

## 🚀 Quick Start Guide

### 1. Requirements
- **Python 3.10+** (Python 3.14 recommended)
- **Node.js 20+** and **npm**

### 2. Start the Server Directly (One-Click)

Run `run.bat` or execute in PowerShell:

```bash
# Windows Command Prompt
run.bat

# OR PowerShell
.\run.ps1
```

Or run manually:

```bash
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 5000
```

Open your browser at:
👉 **`http://localhost:5000`**

---

## 🛠️ Project Architecture

```
Digital Financial Literacy/
├── backend/
│   ├── main.py                 # FastAPI application, SPA static server, REST endpoints
│   ├── watsonx_client.py       # IBM Watsonx.ai IAM auth & Granite model client + fallback engine
│   ├── knowledge.py            # Financial literacy knowledge base (UPI, scams, SIP, CIBIL, schemes)
│   ├── scam_analyzer.py        # Rule-based & heuristic scam detection (urgency, PIN, APKs, fake URLs)
│   ├── calculator_service.py   # Accurate financial formulas (SIP, Loan EMI, Compound, 50/30/20)
│   ├── database.py             # SQLAlchemy models & SQLite database initialization
│   └── requirements.txt        # Python backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx              # Top navigation bar with language selector & dark mode
│   │   │   ├── QuickPromptsSidebar.tsx # Left column quick prompt pills & About section
│   │   │   ├── ChatPanel.tsx           # Center AI chat assistant with markdown & typing indicators
│   │   │   ├── SafetyCards.tsx         # Right column fraud hotlines & official resource links
│   │   │   ├── CalculatorsPage.tsx     # 2-column financial calculators matching reference UI
│   │   │   ├── DashboardPage.tsx       # Literacy dashboard, savings goals & budget summary
│   │   │   ├── GoalsPage.tsx           # Goal planner with contribution tracking & date milestones
│   │   │   ├── ScamCheckPage.tsx       # Scam detection analyzer for SMS, UPI requests & links
│   │   │   └── LearnPage.tsx           # 7 interactive learning modules with quizzes & scoring
│   │   ├── types/index.ts              # TypeScript type definitions
│   │   ├── App.tsx                     # Main application state and layout container
│   │   └── index.css                   # Tailwind CSS styling, custom scrollbars, light/dark themes
│   ├── vite.config.ts                  # Vite config with @tailwindcss/vite & port 5000 proxy
│   └── package.json                    # Frontend dependencies
├── test_app.py                         # Full test suite covering all APIs & calculators
├── .env                                # Environment variables (IBM Watsonx credentials)
├── .env.example                        # Template for environment configuration
├── run.bat                             # Windows 1-click batch launcher
└── run.ps1                             # PowerShell 1-click script launcher
```

---

## 🔒 Security Best Practices

1. **Credential Safety**:
   - Backend API keys are stored in `.env` and never exposed to the client.
   - Sensitive financial secrets (UPI PINs, OTPs, CVVs, netbanking passwords) are **never requested or stored**.
2. **Official Emergency Hotlines**:
   - Verified National Cyber Crime Helpline: **1930** (`tel:1930`).
   - Verified DigiSaathi Digital Payments Helpline: **14431** (`tel:14431`).
3. **Resilient AI Fallback**:
   - If the IBM Cloud Watsonx API endpoint times out or is unreachable on restricted local networks, FinBot automatically uses its built-in Indian Financial Knowledge and Reasoning Engine so the application is always functional.

---

## 🧪 Testing

Run the included automated test suite:

```bash
python test_app.py
```

All 9 test suites cover:
- Health status check
- English and Hindi multi-lingual conversations
- Contextual chat history and clear chat
- Scam detector with critical risk red flags
- SIP, Loan EMI, Compound Interest, and 50/30/20 Budget calculations
- Financial Goals CRUD persistence
- Learning modules & interactive quiz scoring
