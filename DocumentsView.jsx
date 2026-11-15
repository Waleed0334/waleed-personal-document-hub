import React, { useState } from 'react';
import {
  Folder,
  Upload,
  Search,
  Filter,
  FileQuestion,
  Layers,
  Plus,
} from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';
import { SearchBar } from '../components/vault/SearchBar';
import { FilterBar } from '../components/vault/FilterBar';
import { DocumentCard } from '../components/vault/DocumentCard';
import { DocumentListRow } from '../components/vault/DocumentListRow';

export function DocumentsView({ onOpenUpload, onPreviewDoc, onEditDoc, onDeleteDoc }) {
  const {
    documents,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    loading,
  } = useDocuments();

  const [viewMode, setViewMode] = useState('grid');

  const currentCategoryObj =
    selectedCategory === 'all'
      ? {
          name: 'All Documents',
          description: 'Comprehensive view of all encrypted records stored across all categories in your private vault',
        }
      : categories.find((c) => c.id === selectedCategory || c.slug === selectedCategory) || {
          name: 'Vault Category',
          description: 'Filtered category documents',
        };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Category Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-900 border border-slate-800 rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-vault-accent uppercase tracking-wider mb-1">
            <Folder className="w-3.5 h-3.5" />
            <span>Vault Explorer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {currentCategoryObj.name}
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {currentCategoryObj.description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenUpload(selectedCategory !== 'all' ? selectedCategory : null)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition cursor-pointer shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload File</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-3">
        <SearchBar onSelectDocument={onPreviewDoc} />
        <FilterBar viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {/* Document Grid / List */}
      {loading ? (
        <div className="p-16 text-center">
          <div className="w-8 h-8 border-2 border-vault-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Loading secure documents...</p>
        </div>
      ) : documents.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {documents.map((doc) => (
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
          <div className="space-y-2">
            {documents.map((doc) => (
              <DocumentListRow
                key={doc.id}
                document={doc}
                onPreview={onPreviewDoc}
                onEdit={onEditDoc}
                onDelete={onDeleteDoc}
              />
            ))}
          </div>
        )
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-navy-900/60 rounded-2xl border border-slate-800/80 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/60 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-700">
            <FileQuestion className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Documents Found</h3>
          <p className="text-xs text-slate-400 mb-6">
            {searchQuery
              ? `No matching records for "${searchQuery}". Try a different keyword or tag.`
              : 'This category does not have any uploaded documents yet.'}
          </p>

          <div className="flex items-center justify-center gap-3">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-medium hover:bg-slate-700 transition"
              >
                Clear Search
              </button>
            )}
            <button
              type="button"
              onClick={() => onOpenUpload(selectedCategory !== 'all' ? selectedCategory : null)}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-medium hover:bg-blue-500 transition shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" /> Upload Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
