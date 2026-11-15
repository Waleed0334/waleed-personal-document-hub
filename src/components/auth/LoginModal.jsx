import React, { useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, Sparkles, KeyRound, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function GithubIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function LoginModal({ onOpenSetupOwner, onOpenResetPassword, onOpenSetupGuide }) {
  const { login, loginWithGitHub, enterDemoMode, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-navy-950 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-vault-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-navy-900/90 border border-slate-800 rounded-2xl shadow-2xl p-8 backdrop-blur-xl relative z-10">
        {/* Top Vault Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-vault-accent text-white shadow-lg shadow-blue-500/20 mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Waleed's Document Vault</h1>
          <p className="text-sm text-slate-400 mt-1">Authorized Owner Access Only</p>
        </div>

        {/* Warning if Supabase is not configured */}
        {!isConfigured && (
          <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block text-amber-200">Supabase Backend Unconfigured</span>
              No active `.env` credentials detected. You can view the setup guide or explore using synthetic demo documents.
              <button
                type="button"
                onClick={onOpenSetupGuide}
                className="mt-1 text-vault-accent hover:underline flex items-center gap-1 font-medium"
              >
                <HelpCircle className="w-3 h-3" /> View Supabase Setup Instructions
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="wa006514@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 bg-navy-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-vault-accent focus:border-transparent text-sm transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Vault Password
              </label>
              <button
                type="button"
                onClick={onOpenResetPassword}
                className="text-xs text-vault-accent hover:text-sky-300 transition"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-navy-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-vault-accent focus:border-transparent text-sm transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !isConfigured}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-vault-blue hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-xl shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Unlock Vault</span>
              </>
            )}
          </button>

          {isConfigured && (
            <>
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-[11px]">
                  <span className="bg-navy-900 px-2 text-slate-500">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  try {
                    setError('');
                    await loginWithGitHub();
                  } catch (err) {
                    setError(err.message || 'GitHub OAuth failed');
                  }
                }}
                className="w-full py-2 px-3 rounded-xl bg-navy-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <GithubIcon className="w-4 h-4 text-white" />
                <span>Sign in with GitHub</span>
              </button>
            </>
          )}
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-3">
          {/* Owner Registration Button */}
          {isConfigured && (
            <button
              type="button"
              onClick={onOpenSetupOwner}
              className="w-full py-2 px-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white text-xs font-medium transition flex items-center justify-center gap-1.5"
            >
              First Visit? Setup Owner Account
            </button>
          )}

          {/* Demo Mode Button */}
          <button
            type="button"
            onClick={enterDemoMode}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-sky-300 text-xs font-semibold transition flex items-center justify-center gap-2 group"
          >
            <Sparkles className="w-3.5 h-3.5 text-vault-accent group-hover:rotate-12 transition-transform" />
            <span>Enter Synthetic Demo Mode</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={onOpenSetupGuide}
              className="text-xs text-slate-500 hover:text-slate-300 transition"
            >
              Supabase Setup &amp; Deployment Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
