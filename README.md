# 🏦 LAXMI CHIT FUNDS — BankLedger Full-Stack System

A state-of-the-art, high-performance **Full-Stack Banking & Double-Entry Ledger Application** built with **Node.js, Express 5, MongoDB, React, Vite, Axios, and Tailwind CSS**.

Featuring an immutable financial ledger engine, atomic transaction processing with idempotency key protection, automated email notifications (DEBIT, CREDIT, and Failure alerts), and a responsive, futuristic **Obsidian Glassmorphic Dark-Theme Frontend Dashboard**.

**Project owner and maintainer:** Deepak Kumar  
**GitHub repository:** [not-Deepak/fullstack-banking-system](https://github.com/not-Deepak/fullstack-banking-system)

---

## ✨ Features

### 🛡️ Core Banking & Ledger Engine
- **Immutable Double-Entry Ledger**: Every money transfer generates matching DEBIT and CREDIT ledger entries using MongoDB transactional sessions for strict ACID compliance.
- **Idempotency Protection**: Prevents duplicate charge attempts by tracking unique idempotency keys per transaction.
- **Aggregated Account Balances**: Real-time balance calculations derived directly from immutable ledger history.
- **System Initial Funds Faucet**: Faucet mechanism for depositing test liquidity into target accounts.

### 📧 Automated Email Notifications (Nodemailer + Gmail)
- **Welcome Emails**: Sent automatically upon user registration.
- **DEBIT Alerts**: Sent to sender when money is transferred, showing deducted amount, recipient account ID, and updated remaining balance.
- **CREDIT Alerts**: Sent to recipient when money is received, showing credited amount, sender account ID, and updated total balance.
- **Failed Transaction Alerts**: Sent to sender if a transaction fails (e.g. insufficient funds or inactive accounts), confirming that 0 amount was deducted.

### 🎨 Widescreen Obsidian Glassmorphic Frontend
- **Obsidian Dark Theme**: Built with rich HSL design tokens, ambient radial glows, glassmorphism backdrop blurs, and metallic bank card views.
- **Widescreen Responsive Layout**: Stretches across modern 1080p, 2K, and 4K displays (`max-w-[1800px]`).
- **Interactive Banking Cards**: Copyable Account IDs with 1-click clipboard integration, live balance badges, and quick payment triggers.
- **Money Transfer Modal**: Includes quick amount chips (+₹100, +₹500, +₹1,000, +₹5,000), UUID idempotency key auto-generation, recipient account validation, and animated receipt modal.
- **Ledger Transaction History Table**: Real-time searchable and filterable table (ALL, DEBIT, CREDIT) with status badges and copyable transaction IDs.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, Axios, Lucide Icons, Tailwind CSS |
| **Backend Framework** | Node.js, Express 5, CORS |
| **Database & ORM** | MongoDB Atlas, Mongoose (ACID Sessions & Aggregation) |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs, Cookie-Parser |
| **Email Service** | Nodemailer (Gmail OAuth2 / App Password) |

---

## 📁 Repository Structure

```text
complete back project/
├── bankLedger/                 # Backend Node.js / Express Application
│   ├── src/
│   │   ├── contollers/        # Auth, Account & Transaction Controllers
│   │   ├── db/                # MongoDB Database Connection
│   │   ├── middleware/        # JWT Authentication Middleware
│   │   ├── models/            # Mongoose Schemas (User, Account, Ledger, Transaction, Blacklist)
│   │   ├── routes/            # Express Endpoint Routers
│   │   └── services/          # Nodemailer Email Notification Service
│   ├── .env.example           # Environment variables template
│   ├── package.json
│   └── server.js              # Backend Entry Point
│
├── frontend/                  # React + Vite Widescreen Glassmorphic App
│   ├── src/
│   │   ├── api/               # Axios Client Instance with Interceptors
│   │   ├── components/        # Navbar, AccountCard, TransferModal, InitialFundsModal, TransactionTable, AuthView
│   │   ├── context/           # AuthContext Provider
│   │   ├── App.jsx            # Main App Entry
│   │   └── index.css          # Design System & Tailwind CSS Directives
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore                 # Root Security GitIgnore (Hides .env, node_modules, dist)
└── README.md                  # Project Documentation
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB Atlas** database URI or local MongoDB instance

---

### 2. Backend Setup (`bankLedger`)

```bash
cd bankLedger
npm install
```

Create a `.env` file inside `bankLedger/`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/bankingBackend
JWT_SEC=your_jwt_secret_key_here

# Gmail Notification Credentials (Option 1: App Password - Recommended)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password

# Gmail OAuth2 Credentials (Option 2)
CLIENT_ID=your_google_client_id.apps.googleusercontent.com
CLIENT_SECRET=your_google_client_secret
REFRESH_TOKEN=your_google_oauth2_refresh_token
```

Start the backend server:

```bash
npm start
# Server starts on http://localhost:3000
```

---

### 3. Frontend Setup (`frontend`)

Open a new terminal tab:

```bash
cd frontend
npm install
npm run dev
# Frontend starts on http://localhost:5173
```

---

## 🔌 API Reference

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Registers a new user & dispatches welcome email | No |
| `POST` | `/api/auth/login` | Logins user & returns JWT token + user details | No |
| `GET` | `/api/auth/me` | Re-hydrates current authenticated user session | Yes |
| `POST` | `/api/auth/logout` | Blacklists current session token & clears cookie | Yes |

### Bank Accounts Endpoints (`/api/accounts`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/accounts` | Fetches all accounts for logged-in user with live balances | Yes |
| `POST` | `/api/accounts` | Creates a new digital bank account | Yes |
| `GET` | `/api/accounts/balance/:accountId` | Returns specific account balance | Yes |

### Transaction & Ledger Endpoints (`/api/transactions`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/transactions` | Transfers money atomically, updates ledger, and emails receipt | Yes |
| `POST` | `/api/transactions/system/initial-funds` | System deposit faucet to add liquidity | Yes (System User) |
| `GET` | `/api/transactions/history` | Returns transaction and ledger history for user's accounts | Yes |

---

## 🔒 Security & Git Notice

This repository contains strict `.gitignore` configurations at both root and package levels to prevent sensitive environment files (`.env`), secrets, JWT tokens, and build artifacts from being committed to GitHub.

Always verify that `.env` is listed in your `.gitignore` before pushing to any public repository!
