import React from 'react';
import { HardDrive, ShieldCheck, Database } from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';

export function StorageUsageBar() {
  const { stats } = useDocuments();
  const maxStorageMB = 1000; // 1 GB allocated tier
  const usedMB = parseFloat(stats.storageMB) || 0;
  const percentage = Math.min(100, Math.max(1, (usedMB / maxStorageMB) * 100));

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 shadow-sm transition-colors duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-vault-accent">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Vault Storage</h4>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Private encrypted tier</span>
          </div>
        </div>
        <span className="text-xs font-mono font-medium text-blue-600 dark:text-vault-accent">
          {stats.storageMB} MB / {maxStorageMB} MB ({percentage.toFixed(1)}%)
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-navy-950 rounded-full h-2.5 overflow-hidden border border-slate-200 dark:border-slate-800 p-0.5">
        <div
          className="bg-gradient-to-r from-blue-600 to-vault-accent h-full rounded-full transition-all duration-500 shadow-sm shadow-blue-500/50"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800/80">
        <span>{stats.totalDocs} Encrypted File(s)</span>
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" /> Zero Public Access
        </span>
      </div>
    </div>
  );
}
