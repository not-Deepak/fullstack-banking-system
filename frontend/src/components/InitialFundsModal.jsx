import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { X, Zap, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export const InitialFundsModal = ({ isOpen, onClose, targetAccount, onSuccess }) => {
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('10000');
  const [idempotencyKey, setIdempotencyKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const generateKey = () => {
    setIdempotencyKey('init-' + crypto.randomUUID());
  };

  useEffect(() => {
    if (isOpen) {
      if (targetAccount) {
        setToAccount(targetAccount._id);
      }
      generateKey();
      setError('');
      setSuccessMsg('');
    }
  }, [isOpen, targetAccount]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!toAccount.trim()) return setError('Please enter a target account ID');
    if (!amount || parseFloat(amount) <= 0) return setError('Please enter a valid deposit amount');

    setLoading(true);
    try {
      const res = await apiClient.post('/transactions/system/initial-funds', {
        toAccount: toAccount.trim(),
        amount: parseFloat(amount),
        idempotencyKey: idempotencyKey.trim()
      });

      setSuccessMsg(`Successfully deposited ₹${amount} into account ${toAccount}`);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err) {
      console.error('Initial funds error:', err);
      const msg = err.response?.data?.message || 'Failed to deposit initial funds. Ensure you have system user privileges or valid target account.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-modal w-full max-w-md overflow-hidden border border-violet-500/40 shadow-2xl shadow-violet-500/10">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-violet-950/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-300">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">System Initial Funds Faucet</h3>
              <p className="text-xs text-slate-400">Inject liquidity into target bank account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Target Account ID
            </label>
            <input
              type="text"
              placeholder="Target Account ID"
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              className="input-dark font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Deposit Amount (₹)
            </label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-dark text-lg font-bold font-mono text-white"
            />

            <div className="flex gap-2 mt-2">
              {[1000, 5000, 10000, 50000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val.toString())}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-violet-950/40 hover:bg-violet-900/60 text-violet-300 border border-violet-800/50 transition-colors"
                >
                  +₹{val}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Idempotency Key
            </label>
            <input
              type="text"
              value={idempotencyKey}
              onChange={(e) => setIdempotencyKey(e.target.value)}
              className="input-dark font-mono text-xs text-slate-400"
            />
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 py-2.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-emerald flex-1 py-2.5"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <span>Deposit Funds</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
