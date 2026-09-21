import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { X, Send, RefreshCw, CheckCircle2, AlertCircle, Key, ArrowRight, ShieldCheck } from 'lucide-react';

export const TransferModal = ({ isOpen, onClose, accounts, initialFromAccount, onSuccess }) => {
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [idempotencyKey, setIdempotencyKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successReceipt, setSuccessReceipt] = useState(null);

  const generateKey = () => {
    setIdempotencyKey('idemp-' + crypto.randomUUID());
  };

  useEffect(() => {
    if (isOpen) {
      if (initialFromAccount) {
        setFromAccount(initialFromAccount._id);
      } else if (accounts && accounts.length > 0) {
        setFromAccount(accounts[0]._id);
      }
      generateKey();
      setError('');
      setSuccessReceipt(null);
    }
  }, [isOpen, initialFromAccount, accounts]);

  if (!isOpen) return null;

  const selectedAcc = accounts.find((a) => a._id === fromAccount);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fromAccount) return setError('Please select a sender account');
    if (!toAccount.trim()) return setError('Please enter a valid recipient account ID');
    if (fromAccount === toAccount.trim()) return setError('Sender and Recipient accounts cannot be the same');
    if (!amount || parseFloat(amount) <= 0) return setError('Please enter a valid amount greater than 0');
    if (!idempotencyKey.trim()) return setError('Idempotency key is required');

    if (selectedAcc && selectedAcc.balance < parseFloat(amount)) {
      return setError(`Insufficient balance. Available: ₹${selectedAcc.balance}`);
    }

    setLoading(true);
    try {
      const res = await apiClient.post('/transactions', {
        fromAccount,
        toAccount: toAccount.trim(),
        amount: parseFloat(amount),
        idempotencyKey: idempotencyKey.trim()
      });

      setSuccessReceipt(res.data.transaction || res.data);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Transaction error:', err);
      const msg = err.response?.data?.message || 'Transaction failed. Please check account details.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAmount = (val) => {
    setAmount(val.toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-modal w-full max-w-lg overflow-hidden border border-slate-700/60 shadow-2xl">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Transfer Money</h3>
              <p className="text-xs text-slate-400">Atomic ledger transaction with idempotency protection</p>
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
        <div className="p-6">
          {successReceipt ? (
            /* Success Receipt View */
            <div className="text-center py-4 space-y-4 animate-fade-in">
              <div className="h-16 w-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-white">Transaction Completed!</h4>
                <p className="text-xs text-slate-400 mt-1">Funds transferred successfully and written to double-entry ledger.</p>
              </div>

              <div className="glass-panel p-4 text-left font-mono text-xs space-y-2 bg-slate-900/60 border-slate-800">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Status</span>
                  <span className="text-emerald-400 font-bold">COMPLETED</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Amount</span>
                  <span className="text-white font-bold text-sm">₹{amount}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">From Account</span>
                  <span className="text-slate-300 truncate max-w-[200px]">{fromAccount}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">To Account</span>
                  <span className="text-slate-300 truncate max-w-[200px]">{toAccount}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">Idempotency Key</span>
                  <span className="text-slate-400 truncate max-w-[180px]">{idempotencyKey}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="btn-primary w-full py-3 mt-4"
              >
                Close Receipt
              </button>
            </div>
          ) : (
            /* Transaction Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* From Account Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Select Source Account
                </label>
                <select
                  value={fromAccount}
                  onChange={(e) => setFromAccount(e.target.value)}
                  className="input-dark text-sm bg-slate-900 cursor-pointer font-mono"
                >
                  {accounts.map((acc) => (
                    <option key={acc._id} value={acc._id}>
                      {acc._id} — Balance: ₹{acc.balance}
                    </option>
                  ))}
                </select>
                {selectedAcc && (
                  <p className="text-[11px] text-cyan-400 mt-1 font-mono">
                    Available Balance: ₹{selectedAcc.balance}
                  </p>
                )}
              </div>

              {/* Recipient Account Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Recipient Account ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 64b8f3e9c12a..."
                  value={toAccount}
                  onChange={(e) => setToAccount(e.target.value)}
                  className="input-dark font-mono text-sm"
                />
              </div>

              {/* Amount & Quick Chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Transfer Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  min="1"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-dark text-lg font-bold text-white font-mono"
                />

                {/* Quick Amount Chips */}
                <div className="flex items-center gap-2 mt-2">
                  {[100, 500, 1000, 5000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleQuickAmount(val)}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                    >
                      +₹{val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Idempotency Key */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-cyan-400" />
                    Idempotency Key
                  </label>
                  <button
                    type="button"
                    onClick={generateKey}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate
                  </button>
                </div>
                <input
                  type="text"
                  value={idempotencyKey}
                  onChange={(e) => setIdempotencyKey(e.target.value)}
                  className="input-dark font-mono text-xs text-slate-400"
                />
              </div>

              {/* Actions */}
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
                  className="btn-primary flex-1 py-2.5"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Execute Transfer</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
