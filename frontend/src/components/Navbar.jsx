import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogOut, Landmark, User, Zap, CircleDot } from 'lucide-react';

export const Navbar = ({ onOpenTransfer, onOpenInitialFunds }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
            <Landmark className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">LAXMI CHIT FUNDS</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono font-medium">v1.0</span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <CircleDot className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
              <span>Backend Connected: localhost:3000</span>
            </p>
          </div>
        </div>

        {/* User & Actions */}
        {user && (
          <div className="flex items-center gap-3">
            {/* System User Badge or Deposit Faucet */}
            <button
              onClick={onOpenInitialFunds}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/30 hover:bg-violet-500/20 transition-all cursor-pointer shadow-sm shadow-violet-500/10"
              title="System Initial Deposit Faucet"
            >
              <Zap className="w-4 h-4 text-violet-400" />
              <span>Initial Funds Faucet</span>
            </button>

            <button
              onClick={onOpenTransfer}
              className="btn-primary text-xs py-2 px-4 rounded-xl"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Send Money</span>
            </button>

            <div className="h-8 w-px bg-slate-800 mx-1 hidden sm:block"></div>

            {/* Profile Pill */}
            <div className="flex items-center gap-3 pl-2">
              <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold">
                {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-sm font-semibold text-white leading-tight flex items-center gap-1">
                  {user.name}
                  {user.systemUser && <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" title="System User Privilege" />}
                </div>
                <div className="text-xs text-slate-400 font-mono truncate max-w-[140px]">{user.email}</div>
              </div>
              
              <button
                onClick={logout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors border border-transparent hover:border-rose-500/20 ml-1 cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
