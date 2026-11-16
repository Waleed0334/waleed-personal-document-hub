import React from 'react';
import {
  Menu,
  Shield,
  Upload,
  Lock,
  Sparkles,
  HelpCircle,
  Database,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export function Header({
  onToggleMobileSidebar,
  onOpenUpload,
  onOpenSetupGuide,
  currentViewTitle,
}) {
  const { isDemoMode, isConfigured, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-white/80 dark:bg-navy-950/80 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/80 sticky top-0 z-30 px-3 sm:px-6 flex items-center justify-between transition-colors duration-200">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation menu"
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 truncate">
          <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500 shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight truncate">
            {currentViewTitle}
          </h2>
        </div>
      </div>

      {/* Right: Theme Switcher, Demo Badge, Upload CTA, Lock */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Demo Mode Badge */}
        {isDemoMode && (
          <div className="hidden xs:flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Demo</span>
            <button
              type="button"
              onClick={onOpenSetupGuide}
              className="underline hover:text-amber-900 dark:hover:text-white ml-0.5 sm:ml-1"
            >
              Connect
            </button>
          </div>
        )}

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-300 bg-slate-100 dark:bg-navy-900 hover:bg-slate-200 dark:hover:bg-navy-800 border border-slate-200 dark:border-slate-800 transition cursor-pointer"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700 transition-transform duration-200 hover:-rotate-12" />
          )}
        </button>

        {/* Quick Upload CTA */}
        <button
          type="button"
          onClick={() => onOpenUpload(null)}
          className="px-3 sm:px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload</span>
        </button>

        {/* Lock Vault */}
        <button
          type="button"
          onClick={logout}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100 dark:bg-navy-900 hover:bg-slate-200 dark:hover:bg-navy-800 border border-slate-200 dark:border-slate-800 transition"
          title="Lock Vault Immediately"
          aria-label="Lock Vault"
        >
          <Lock className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
