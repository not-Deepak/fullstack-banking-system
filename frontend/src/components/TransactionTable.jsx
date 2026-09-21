import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Search, Filter, Calendar, Copy, Check, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const TransactionTable = ({ transactions = [], userAccounts = [] }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, DEBIT, CREDIT
  const [copiedId, setCopiedId] = useState(null);
  const [selectedTx, setSelectedTx] = useState(null);

  const userAccountIds = new Set(userAccounts.map((a) => a._id));

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTransactions = transactions.filter((tx) => {
    const fromId = typeof tx.fromAccount === 'object' ? tx.fromAccount?._id : tx.fromAccount;
    const toId = typeof tx.toAccount === 'object' ? tx.toAccount?._id : tx.toAccount;
    const matchesSearch =
      tx._id.toLowerCase().includes(search.toLowerCase()) ||
      (fromId && fromId.toLowerCase().includes(search.toLowerCase())) ||
      (toId && toId.toLowerCase().includes(search.toLowerCase())) ||
      (tx.idempotencyKey && tx.idempotencyKey.toLowerCase().includes(search.toLowerCase()));

    const isDebit = userAccountIds.has(fromId);
    const isCredit = userAccountIds.has(toId);

    if (filterType === 'DEBIT' && !isDebit) return false;
    if (filterType === 'CREDIT' && !isCredit) return false;

    return matchesSearch;
  });

  return (
    <div className="glass-panel p-6 border-slate-800">
      
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Ledger Transaction History</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-normal">
              {filteredTransactions.length} Total
            </span>
          </h3>
          <p className="text-xs text-slate-400">Real-time immutable ledger entries & status verification</p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search account, ID, or key..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-dark text-xs pl-9 pr-3 py-2.5 w-full"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 shrink-0">
            {['ALL', 'DEBIT', 'CREDIT'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  filterType === type
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Transaction ID</th>
              <th className="py-3 px-4">Sender (From)</th>
              <th className="py-3 px-4">Recipient (To)</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date & Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12 text-slate-500 font-sans">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>No transaction history found.</p>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => {
                const fromId = typeof tx.fromAccount === 'object' ? tx.fromAccount?._id : tx.fromAccount;
                const toId = typeof tx.toAccount === 'object' ? tx.toAccount?._id : tx.toAccount;
                const isDebit = userAccountIds.has(fromId);

                return (
                  <tr
                    key={tx._id}
                    onClick={() => setSelectedTx(tx)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    {/* Type Badge */}
                    <td className="py-3.5 px-4 font-sans">
                      {isDebit ? (
                        <span className="badge badge-debit">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span>DEBIT</span>
                        </span>
                      ) : (
                        <span className="badge badge-credit">
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                          <span>CREDIT</span>
                        </span>
                      )}
                    </td>

                    {/* Tx ID */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                        <span className="truncate max-w-[100px]">{tx._id}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(tx._id);
                          }}
                          className="text-slate-500 hover:text-cyan-400 p-0.5 rounded"
                        >
                          {copiedId === tx._id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* From */}
                    <td className="py-3.5 px-4 text-slate-400">
                      <span className="truncate max-w-[110px] block" title={fromId}>
                        {fromId}
                      </span>
                    </td>

                    {/* To */}
                    <td className="py-3.5 px-4 text-slate-400">
                      <span className="truncate max-w-[110px] block" title={toId}>
                        {toId}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-bold text-sm">
                      <span className={isDebit ? 'text-rose-400' : 'text-emerald-400'}>
                        {isDebit ? '-' : '+'}₹{tx.amount?.toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 font-sans">
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        {tx.status || 'COMPLETED'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-400 font-sans text-[11px]">
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleString('en-IN') : 'Just now'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
