import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { Navbar } from './Navbar';
import { AccountCard } from './AccountCard';
import { TransferModal } from './TransferModal';
import { InitialFundsModal } from './InitialFundsModal';
import { TransactionTable } from './TransactionTable';
import { 
  Wallet, 
  PlusCircle, 
  RefreshCw, 
  Send, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  CreditCard
} from 'lucide-react';

export const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingAccount, setCreatingAccount] = useState(false);

  // Modals state
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isInitialFundsOpen, setIsInitialFundsOpen] = useState(false);
  const [selectedFromAccount, setSelectedFromAccount] = useState(null);
  const [selectedTargetAccount, setSelectedTargetAccount] = useState(null);

  // Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [accRes, txRes] = await Promise.all([
        apiClient.get('/accounts'),
        apiClient.get('/transactions/history')
      ]);

      if (accRes.data && accRes.data.accounts) {
        setAccounts(accRes.data.accounts);
      }
      if (txRes.data && txRes.data.transactions) {
        setTransactions(txRes.data.transactions);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      showToast('Failed to sync latest ledger data from backend', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAccount = async () => {
    setCreatingAccount(true);
    try {
      const res = await apiClient.post('/accounts');
      if (res.data && res.data.account) {
        showToast('New Bank Account opened successfully!');
        fetchData();
      }
    } catch (err) {
      console.error('Create account error:', err);
      showToast('Failed to open new account', 'error');
    } finally {
      setCreatingAccount(false);
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(totalBalance);

  const openTransferModalForAcc = (acc) => {
    setSelectedFromAccount(acc);
    setIsTransferOpen(true);
  };

  const openDepositModalForAcc = (acc) => {
    setSelectedTargetAccount(acc);
    setIsInitialFundsOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-16">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-xs font-semibold ${
              toast.type === 'error'
                ? 'bg-rose-950/90 text-rose-300 border-rose-500/40'
                : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        onOpenTransfer={() => {
          setSelectedFromAccount(null);
          setIsTransferOpen(true);
        }}
        onOpenInitialFunds={() => {
          setSelectedTargetAccount(null);
          setIsInitialFundsOpen(true);
        }}
      />

      <main className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 mt-10 space-y-12 flex-1">
        
        {/* Top Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Total Net Worth */}
          <div className="glass-panel p-6 border-slate-800 relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Portfolio Net Worth</span>
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
                {formattedTotal}
              </div>
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Across {accounts.length} Active Ledger Accounts</span>
              </p>
            </div>
          </div>

          {/* Card 2: Quick Actions */}
          <div className="glass-panel p-6 border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Quick Financial Operations</span>
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={handleCreateAccount}
                disabled={creatingAccount}
                className="btn-secondary py-2.5 px-3 text-xs justify-center"
              >
                {creatingAccount ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4 text-cyan-400" />
                    <span>Open Account</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setSelectedFromAccount(null);
                  setIsTransferOpen(true);
                }}
                className="btn-primary py-2.5 px-3 text-xs justify-center"
              >
                <Send className="w-4 h-4 fill-current" />
                <span>Send Money</span>
              </button>
            </div>
          </div>

          {/* Card 3: System Status & Sync */}
          <div className="glass-panel p-6 border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Engine & Sync Status</span>
              <button
                onClick={fetchData}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Sync Balance & Transactions"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
              </button>
            </div>

            <div className="mt-4 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Database</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  MongoDB Connected
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Ledger Integrity</span>
                <span className="text-cyan-400">Immutable Double-Entry</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bank Accounts Grid Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-cyan-400" />
                <span>Your Bank Accounts</span>
              </h2>
              <p className="text-xs text-slate-400">Digital accounts backed by ACID double-entry ledger</p>
            </div>

            <button
              onClick={handleCreateAccount}
              disabled={creatingAccount}
              className="btn-primary text-xs py-2 px-4 rounded-xl"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Open New Account</span>
            </button>
          </div>

          {accounts.length === 0 ? (
            <div className="glass-panel p-12 text-center text-slate-400 space-y-3">
              <Wallet className="w-12 h-12 text-slate-600 mx-auto opacity-50" />
              <p className="text-sm font-semibold">No bank accounts found for your user.</p>
              <button
                onClick={handleCreateAccount}
                className="btn-primary text-xs py-2 px-4"
              >
                Create Your First Account Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((acc, index) => (
                <AccountCard
                  key={acc._id}
                  account={acc}
                  index={index}
                  onQuickTransfer={openTransferModalForAcc}
                  onQuickDeposit={openDepositModalForAcc}
                />
              ))}
            </div>
          )}
        </section>

        {/* Transaction History Section */}
        <section className="space-y-4">
          <TransactionTable transactions={transactions} userAccounts={accounts} />
        </section>

      </main>

      {/* Modals */}
      <TransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        accounts={accounts}
        initialFromAccount={selectedFromAccount}
        onSuccess={() => {
          showToast('Transfer completed!');
          fetchData();
        }}
      />

      <InitialFundsModal
        isOpen={isInitialFundsOpen}
        onClose={() => setIsInitialFundsOpen(false)}
        targetAccount={selectedTargetAccount}
        onSuccess={() => {
          showToast('Initial funds deposited!');
          fetchData();
        }}
      />

    </div>
  );
};
