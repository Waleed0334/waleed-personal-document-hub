import React from 'react';
import {
  Shield,
  Upload,
  Files,
  Folder,
  Star,
  Clock,
  Flame,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDocuments } from '../context/DocumentContext';
import { SearchBar } from '../components/vault/SearchBar';
import { StorageUsageBar } from '../components/vault/StorageUsageBar';
import { QuickAccessShortcuts } from '../components/vault/QuickAccessShortcuts';
import { DocumentCard } from '../components/vault/DocumentCard';

export function DashboardView({ onOpenUpload, onPreviewDoc, onEditDoc, onDeleteDoc, onNavigateToCategory }) {
  const { user, isDemoMode } = useAuth();
  const { stats, setSearchQuery } = useDocuments();

  const handleShortcutSearch = (keyword) => {
    setSearchQuery(keyword);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src="/assets/portfolio/waleed.png"
              alt="Waleed Ahmed Siddiqui"
              onError={(e) => {
                e.target.src = 'https://ui-avatars.com/api/?name=Waleed+Ahmed&background=2563eb&color=fff';
              }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-vault-accent/40 shadow-lg shadow-blue-500/20"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-vault-accent text-[11px] font-semibold flex items-center gap-1 border border-blue-500/30">
                  <Shield className="w-3 h-3" /> FAST BS Data Science
                </span>
                {isDemoMode && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-medium border border-amber-500/30">
                    Synthetic Demo
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, Waleed!
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Your private document vault is secure and actively monitored.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenUpload}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-vault-blue hover:from-blue-500 hover:to-blue-600 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Documents</span>
            </button>
          </div>
        </div>

        {/* Search Bar prominently placed */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex justify-center">
          <SearchBar onSelectDocument={onPreviewDoc} />
        </div>
      </div>

      {/* Metrics & Storage Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Documents */}
        <div className="bg-navy-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-600/20 text-vault-accent flex items-center justify-center border border-blue-500/30 shrink-0">
            <Files className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Total Documents</span>
            <span className="text-xl font-bold text-white font-mono">{stats.totalDocs}</span>
          </div>
        </div>

        {/* Total Categories */}
        <div className="bg-navy-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shrink-0">
            <Folder className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Categories</span>
            <span className="text-xl font-bold text-white font-mono">{stats.totalCategoriesCount}</span>
          </div>
        </div>

        {/* Favorite Documents */}
        <div className="bg-navy-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
            <Star className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Starred Favorites</span>
            <span className="text-xl font-bold text-white font-mono">{stats.favoriteDocs.length}</span>
          </div>
        </div>

        {/* Storage Bar widget */}
        <StorageUsageBar />
      </div>

      {/* Quick Access Shortcuts */}
      <QuickAccessShortcuts
        onOpenCategory={onNavigateToCategory}
        onSearchKey={handleShortcutSearch}
      />

      {/* Recently Uploaded Documents */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-vault-accent" />
            <h3 className="text-sm font-bold text-white">Recently Uploaded</h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToCategory('all')}
            className="text-xs text-vault-accent hover:underline flex items-center gap-1 font-medium"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {stats.recentUploads.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {stats.recentUploads.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onPreview={onPreviewDoc}
                onEdit={onEditDoc}
                onDelete={onDeleteDoc}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-navy-900/60 rounded-2xl border border-slate-800 text-xs text-slate-400">
            No documents uploaded yet. Upload your first document to get started.
          </div>
        )}
      </div>

      {/* Frequently Accessed Documents */}
      {stats.frequentDocs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Frequently Accessed</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {stats.frequentDocs.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onPreview={onPreviewDoc}
                onEdit={onEditDoc}
                onDelete={onDeleteDoc}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
