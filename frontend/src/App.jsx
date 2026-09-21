import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthView } from './components/AuthView';
import { Dashboard } from './components/Dashboard';
import { RefreshCw } from 'lucide-react';

const MainApp = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400">
        <div className="text-center space-y-3">
          <RefreshCw className="w-10 h-10 animate-spin mx-auto text-cyan-400" />
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400">Initializing BankLedger Security Context...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <AuthView />;
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
