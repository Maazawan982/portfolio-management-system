import React, { useState } from 'react';
import { X, Lock, Mail, User, ArrowRight, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';
import { api } from '../lib/api';
import { AuthSession } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (session: AuthSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const session = await api.login(username, password);
        onSuccess(session);
        onClose();
      } else {
        const session = await api.register(username, name, email, password);
        onSuccess(session);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (u: string, p: string) => {
    setMode('login');
    setUsername(u);
    setPassword(p);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle developer accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>

        <button
          id="auth-modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-zinc-100 font-mono">
              {mode === 'login' ? 'Creator Authentication' : 'Create Creator Account'}
            </h2>
          </div>
          <p className="text-xs text-zinc-400">
            {mode === 'login' 
              ? 'Access your developer portfolio dashboard, manage projects, and update APIs.' 
              : 'Claim your username and publish your developer portfolio in seconds.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-start gap-2">
            <span className="font-mono text-red-400 font-bold">[ERR]</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    id="auth-reg-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivers"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    id="auth-reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@domain.dev"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">
              {mode === 'login' ? 'Username or Email' : 'Unique Username'}
            </label>
            <div className="relative">
              <span className="text-zinc-500 absolute left-3 top-2 text-xs font-mono">@</span>
              <input
                id="auth-input-username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={mode === 'login' ? 'alexdev or alex@rivers.dev' : 'e.g. johndoe'}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-700 text-zinc-100 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            {mode === 'register' && (
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Public profile will be accessible at: /portfolio/{username || 'username'}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                id="auth-input-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-zinc-950 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2 px-4 rounded-md bg-emerald-500 text-zinc-950 font-medium font-mono text-xs hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to Dashboard' : 'Create & Claim Portfolio'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Demo Logins for instant evaluation */}
        <div className="mt-5 pt-4 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
              <KeyRound className="w-3 h-3 text-emerald-400" />
              Quick Demo Logins (1-Click Test):
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              id="demo-login-alex"
              type="button"
              onClick={() => fillDemoAccount('alexdev', 'alex123')}
              className="px-2 py-1.5 rounded bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 text-[11px] font-mono text-zinc-300 hover:text-emerald-400 transition-colors text-center"
            >
              @alexdev
            </button>
            <button
              id="demo-login-sarah"
              type="button"
              onClick={() => fillDemoAccount('sarahcodes', 'sarah123')}
              className="px-2 py-1.5 rounded bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 text-[11px] font-mono text-zinc-300 hover:text-emerald-400 transition-colors text-center"
            >
              @sarahcodes
            </button>
            <button
              id="demo-login-john"
              type="button"
              onClick={() => fillDemoAccount('johndoe', 'john123')}
              className="px-2 py-1.5 rounded bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 text-[11px] font-mono text-zinc-300 hover:text-emerald-400 transition-colors text-center"
            >
              @johndoe
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            id="auth-toggle-mode-btn"
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError(null);
            }}
            className="text-xs text-zinc-400 hover:text-emerald-400 font-mono transition-colors"
          >
            {mode === 'login' 
              ? "Don't have a portfolio yet? Click here to register" 
              : "Already have a portfolio? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};
