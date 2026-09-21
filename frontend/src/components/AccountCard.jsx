import React, { useState } from 'react';
import { CreditCard, Copy, Check, Sparkles, PlusCircle } from 'lucide-react';

export const AccountCard = ({ account, index, onQuickTransfer, onQuickDeposit }) => {
  const [copied, setCopied] = useState(false);

  const cardVariants = ['bank-card-cyan', 'bank-card-violet', 'bank-card-emerald'];
  const variantClass = cardVariants[index % cardVariants.length];

  const handleCopy = () => {
    navigator.clipboard.writeText(account._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedBalance = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: account.currency || 'INR',
    maximumFractionDigits: 2,
  }).format(account.balance || 0);

  return (
    <div className={`bank-card ${variantClass} p-6 flex flex-col justify-between h-56 transition-all duration-300 hover:scale-[1.02]`}>
      
      {/* Top Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-10 bg-amber-400/20 border border-amber-400/40 rounded-md flex items-center justify-center">
            <div className="h-5 w-7 bg-gradient-to-tr from-amber-400 to-yellow-200 rounded-sm opacity-80"></div>
          </div>
          <span className="text-xs font-mono tracking-widest text-slate-300 font-semibold">
            {account.currency || 'INR'} DIGITAL LEDGER
          </span>
        </div>

        <span className="badge badge-active">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          {account.status || 'ACTIVE'}
        </span>
      </div>

      {/* Account Balance */}
      <div className="z-10 my-2">
        <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block">
          Current Available Balance
        </span>
        <div className="text-3xl font-extrabold text-white tracking-tight mt-1 font-mono">
          {formattedBalance}
        </div>
      </div>

      {/* Account ID & Copy */}
      <div className="z-10 pt-3 border-t border-white/10 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Account ID</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono text-xs text-slate-200 tracking-wider">
              {account._id}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-white/10 transition-colors cursor-pointer"
              title="Copy Account ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onQuickDeposit(account)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-all flex items-center gap-1 cursor-pointer border border-white/10"
            title="Deposit Initial Funds"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Add Funds</span>
          </button>
          <button
            onClick={() => onQuickTransfer(account)}
            className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-medium transition-all flex items-center gap-1 cursor-pointer border border-cyan-500/30"
            title="Transfer from this account"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Pay</span>
          </button>
        </div>
      </div>

    </div>
  );
};
