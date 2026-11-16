import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, FileText, Folder, Sparkles } from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';

export function SearchBar({ onSelectDocument }) {
  const { searchQuery, setSearchQuery, recentSearches, allDocuments } = useDocuments();
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  // Suggestions based on active input
  const suggestions = searchQuery.trim()
    ? allDocuments
        .filter((d) => {
          const q = searchQuery.toLowerCase();
          return (
            d.title.toLowerCase().includes(q) ||
            d.category_name.toLowerCase().includes(q) ||
            d.subcategory?.toLowerCase().includes(q) ||
            d.tags?.some((t) => t.toLowerCase().includes(q))
          );
        })
        .slice(0, 5)
    : [];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search documents, category, CNIC, FAST, tag..."
          className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-vault-accent focus:border-transparent transition shadow-sm"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown Suggestions & Recent Searches */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-700/90 rounded-xl shadow-2xl overflow-hidden z-30 p-2 space-y-2 max-h-80 overflow-y-auto">
          {/* Recent Searches */}
          {recentSearches.length > 0 && !searchQuery && (
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 py-1 block flex items-center gap-1">
                <Clock className="w-3 h-3" /> Recent Searches
              </span>
              <div className="flex flex-wrap gap-1 px-1 mt-1">
                {recentSearches.map((term, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSearchQuery(term);
                      setIsFocused(false);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-vault-accent rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 transition"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Instant Document Matches */}
          {searchQuery && suggestions.length > 0 && (
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 py-1 block flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-600 dark:text-vault-accent" /> Matching Documents ({suggestions.length})
              </span>
              <div className="space-y-1 mt-1">
                {suggestions.map((doc) => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => {
                      if (onSelectDocument) onSelectDocument(doc);
                      setIsFocused(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 text-left transition group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-vault-accent shrink-0" />
                      <span className="text-xs text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-vault-accent truncate font-medium">
                        {doc.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-navy-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 shrink-0 ml-2">
                      {doc.category_name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchQuery && suggestions.length === 0 && (
            <div className="p-3 text-center text-xs text-slate-500 dark:text-slate-400">
              No direct document match for "{searchQuery}". Press Enter to view filtered results.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
