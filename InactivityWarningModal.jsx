import React from 'react';
import { Clock, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function InactivityWarningModal() {
  const { inactivityWarning, logout } = useAuth();

  if (!inactivityWarning?.isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-sm bg-navy-900 border border-amber-500/40 rounded-2xl shadow-2xl p-6 text-center animate-bounce-short">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        <h3 className="text-lg font-bold text-white">Inactivity Security Lock</h3>
        <p className="text-xs text-slate-300 mt-1">
          For your privacy and security, your vault session will lock in
        </p>

        <div className="my-5">
          <span className="text-4xl font-extrabold text-amber-400 font-mono">
            {inactivityWarning.secondsRemaining}s
          </span>
        </div>

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={logout}
            className="flex-1 py-2 px-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-medium transition cursor-pointer"
          >
            Lock Now
          </button>
          <button
            type="button"
            onClick={inactivityWarning.stayLoggedIn}
            className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shadow-lg shadow-blue-600/30 cursor-pointer"
          >
            Keep Vault Unlocked
          </button>
        </div>
      </div>
    </div>
  );
}
