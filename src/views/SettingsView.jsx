import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  KeyRound,
  Clock,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  HardDrive,
  ExternalLink,
  Lock,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDocuments } from '../context/DocumentContext';
import { useTheme } from '../context/ThemeContext';
import { checkSupabaseHealth, isSupabaseConfigured } from '../lib/supabase';

export function SettingsView({ onOpenSetupGuide }) {
  const { user, isDemoMode, timeoutMinutes, updateTimeoutMinutes, updatePassword } = useAuth();
  const { stats } = useDocuments();
  const { theme, isDark, setTheme } = useTheme();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);

  const [healthStatus, setHealthStatus] = useState(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  const runHealthCheck = async () => {
    setCheckingHealth(true);
    const result = await checkSupabaseHealth();
    setHealthStatus(result);
    setCheckingHealth(false);
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setPasswordLoading(true);
    try {
      await updatePassword(newPassword);
      setPasswordMsg({ type: 'success', text: 'Vault master password updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-4xl mx-auto pb-12 min-w-0">
      {/* Settings Header */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-vault-accent flex items-center justify-center border border-blue-500/20 dark:border-blue-500/30 shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Vault Security &amp; Settings</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Configure theme, access controls, timeouts, and credentials</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenSetupGuide}
          className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition text-center"
        >
          View Setup Guide
        </button>
      </div>

      {/* Theme & Appearance Settings Card */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-blue-600 dark:text-vault-accent uppercase tracking-wider">
          <Sun className="w-4 h-4" />
          <span>Appearance &amp; Display</span>
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Theme Selection</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Select your preferred interface color scheme. Saved in your browser and automatically restored on your next visit.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Light Theme */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
              theme === 'light'
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-sm ring-2 ring-blue-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20 shrink-0">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">Light Mode</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Clean &amp; crisp</span>
            </div>
            {theme === 'light' && (
              <CheckCircle2 className="w-4 h-4 text-blue-600 ml-auto shrink-0" />
            )}
          </button>

          {/* Dark Theme */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
              theme === 'dark'
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-sm ring-2 ring-blue-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 dark:bg-blue-600/20 text-blue-600 dark:text-vault-accent flex items-center justify-center border border-blue-500/20 shrink-0">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">Dark Mode</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Deep navy vault</span>
            </div>
            {theme === 'dark' && (
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-vault-accent ml-auto shrink-0" />
            )}
          </button>

          {/* System Theme */}
          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
              theme === 'system'
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-sm ring-2 ring-blue-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-navy-950 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center border border-purple-500/20 shrink-0">
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">System Preference</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Matches OS ({isDark ? 'Dark' : 'Light'})
              </span>
            </div>
            {theme === 'system' && (
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-vault-accent ml-auto shrink-0" />
            )}
          </button>
        </div>
      </div>

      {/* Grid: Inactivity & Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Inactivity Auto-Logout */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col justify-between shadow-sm transition-colors duration-200">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-blue-600 dark:text-vault-accent uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Inactivity Session Guard</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Automatic Vault Lock</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              To prevent unauthorized physical access when your device is left unattended, the vault automatically locks after a period of user inactivity.
            </p>

            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Auto-Lock After Inactivity
            </label>
            <select
              value={timeoutMinutes}
              onChange={(e) => updateTimeoutMinutes(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 bg-slate-100 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 dark:focus:ring-vault-accent focus:outline-none cursor-pointer"
            >
              <option value={5}>5 Minutes of Inactivity</option>
              <option value={15}>15 Minutes of Inactivity (Recommended)</option>
              <option value={30}>30 Minutes of Inactivity</option>
              <option value={60}>1 Hour of Inactivity</option>
            </select>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-500 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Active monitoring triggers countdown warning before locking</span>
          </div>
        </div>

        {/* Change Master Password */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm transition-colors duration-200">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-blue-600 dark:text-vault-accent uppercase tracking-wider">
            <KeyRound className="w-4 h-4" />
            <span>Authentication</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Update Master Password</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
            Change your password credentials with Supabase Auth encryption.
          </p>

          {passwordMsg && (
            <div
              className={`p-3 rounded-xl mb-3 text-xs flex items-center gap-2 ${
                passwordMsg.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300'
              }`}
            >
              {passwordMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              )}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <div>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password (min 8 chars)"
                className="w-full px-3 py-2 bg-slate-100 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:ring-2 focus:ring-blue-500 dark:focus:ring-vault-accent focus:outline-none"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                className="w-full px-3 py-2 bg-slate-100 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:ring-2 focus:ring-blue-500 dark:focus:ring-vault-accent focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/30 transition disabled:opacity-50 cursor-pointer"
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>

      {/* Supabase Connection Health Status */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-vault-accent shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Supabase Cloud Connection</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Status of your private PostgreSQL database &amp; Storage</p>
            </div>
          </div>

          <button
            type="button"
            onClick={runHealthCheck}
            disabled={checkingHealth}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition"
            title="Refresh Connection Status"
            aria-label="Refresh Connection Status"
          >
            <RefreshCw className={`w-4 h-4 ${checkingHealth ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
              Configuration Mode
            </span>
            <span
              className={`text-xs font-bold ${
                isSupabaseConfigured() ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {isSupabaseConfigured() ? 'Supabase Connected' : 'Synthetic Demo Mode'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
              Backend Endpoint
            </span>
            <span className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate block">
              {healthStatus?.url || 'Local In-Memory'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
              Vault Bucket
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>vault (Private Bucket)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Security Best Practices Checklist */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Security Checklist</h3>
        </div>

        <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white">Strict Row Level Security (RLS):</strong> Documents and categories are bound strictly to <code>auth.uid() = user_id</code>.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white">Private Storage Bucket:</strong> The <code>vault</code> bucket has public access permanently disabled. All downloads and previews require short-lived signed tokens.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white">Git Repository Safety:</strong> The <code>.gitignore</code> file is configured to exclude <code>.env</code> files and sensitive document binaries.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white">Zero Public Key Leakage:</strong> Only the anon publishable key is used in client-side code; the service-role key is never stored or exposed.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
