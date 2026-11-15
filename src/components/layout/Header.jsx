import React from 'react';
import {
  Menu,
  Shield,
  Upload,
  Lock,
  Sparkles,
  HelpCircle,
  Database,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Header({
  onToggleMobileSidebar,
  onOpenUpload,
  onOpenSetupGuide,
  currentViewTitle,
}) {
  const { isDemoMode, isConfigured, logout } = useAuth();

  return (
    <header className="h-16 bg-navy-950/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
            {currentViewTitle}
          </h2>
        </div>
      </div>

      {/* Right: Status Badges, Upload CTA, Lock */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Demo Mode Badge */}
        {isDemoMode && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Synthetic Demo</span>
            <button
              type="button"
              onClick={onOpenSetupGuide}
              className="underline hover:text-white ml-1"
            >
              Connect Supabase
            </button>
          </div>
        )}

        {/* Quick Upload CTA */}
        <button
          type="button"
          onClick={() => onOpenUpload(null)}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload</span>
        </button>

        {/* Lock Vault */}
        <button
          type="button"
          onClick={logout}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-navy-900 border border-slate-800 transition"
          title="Lock Vault Immediately"
        >
          <Lock className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
