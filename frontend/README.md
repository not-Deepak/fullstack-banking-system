# 🎨 BankLedger Widescreen Obsidian Frontend

The frontend user interface for **LAXMI CHIT FUNDS / BankLedger**, built with **React, Vite, Axios, Lucide Icons, and Tailwind CSS**.

---

## ✨ Features

- **Obsidian Dark Theme**: Built with rich HSL design tokens, ambient radial glows, glassmorphism backdrop blurs, and metallic bank card views.
- **Widescreen Responsive Layout**: Stretches across modern 1080p, 2K, and 4K displays (`max-w-[1800px]`).
- **Interactive Banking Cards**: Copyable Account IDs with 1-click clipboard integration, live balance badges, and quick payment triggers.
- **Money Transfer Modal**: Includes quick amount chips (+₹100, +₹500, +₹1,000, +₹5,000), UUID idempotency key auto-generation, recipient account validation, and animated receipt modal.
- **Ledger Transaction History Table**: Real-time searchable and filterable table (ALL, DEBIT, CREDIT) with status badges and copyable transaction IDs.

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build for production
npm run build
```

The dev server runs at [http://localhost:5173](http://localhost:5173) and connects to the backend API at `http://localhost:3000/api`.
