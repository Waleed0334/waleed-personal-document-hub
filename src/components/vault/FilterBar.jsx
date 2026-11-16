import React from 'react';
import {
  Filter,
  ArrowUpDown,
  Star,
  LayoutGrid,
  List,
  FileText,
  Image as ImageIcon,
  Layers,
} from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';

export function FilterBar({ viewMode, setViewMode }) {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    selectedSort,
    setSelectedSort,
    onlyFavorites,
    setOnlyFavorites,
  } = useDocuments();

  return (
    <div className="bg-white dark:bg-navy-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-3.5 space-y-3 shadow-sm transition-colors duration-200">
      {/* Top Row: Categories Tabs with smooth horizontal scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
              : 'bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Documents</span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                : 'bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Bottom Row: Type Filter, Favorites, Sort, View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* File Type Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-navy-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setSelectedType('all')}
              className={`px-2.5 py-1 rounded-lg transition text-[11px] sm:text-xs ${
                selectedType === 'all'
                  ? 'bg-white dark:bg-navy-950 text-slate-900 dark:text-white font-medium shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              All Types
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('pdf')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition text-[11px] sm:text-xs ${
                selectedType === 'pdf'
                  ? 'bg-white dark:bg-navy-950 text-rose-600 dark:text-rose-300 font-medium shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-3 h-3 text-rose-500 dark:text-rose-400" /> PDFs
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('image')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition text-[11px] sm:text-xs ${
                selectedType === 'image'
                  ? 'bg-white dark:bg-navy-950 text-emerald-600 dark:text-emerald-300 font-medium shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-3 h-3 text-emerald-500 dark:text-emerald-400" /> Images
            </button>
          </div>

          {/* Favorites Filter */}
          <button
            type="button"
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 font-medium cursor-pointer text-[11px] sm:text-xs ${
              onlyFavorites
                ? 'bg-amber-500/15 dark:bg-amber-500/20 border-amber-500/40 text-amber-700 dark:text-amber-300'
                : 'bg-slate-100 dark:bg-navy-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-current text-amber-500 dark:text-amber-400' : ''}`} />
            <span>Favorites</span>
          </button>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          {/* Sort Dropdown */}
          <div className="flex-1 sm:flex-initial flex items-center gap-1.5 bg-slate-100 dark:bg-navy-800 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer w-full text-[11px] sm:text-xs"
            >
              <option value="date-desc" className="bg-white dark:bg-navy-900 text-slate-900 dark:text-white">Newest First</option>
              <option value="date-asc" className="bg-white dark:bg-navy-900 text-slate-900 dark:text-white">Oldest First</option>
              <option value="title-asc" className="bg-white dark:bg-navy-900 text-slate-900 dark:text-white">Name: A to Z</option>
              <option value="title-desc" className="bg-white dark:bg-navy-900 text-slate-900 dark:text-white">Name: Z to A</option>
              <option value="size-desc" className="bg-white dark:bg-navy-900 text-slate-900 dark:text-white">Largest Size</option>
              <option value="views-desc" className="bg-white dark:bg-navy-900 text-slate-900 dark:text-white">Most Viewed</option>
            </select>
          </div>

          {/* Grid / List Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-navy-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-navy-950 text-blue-600 dark:text-vault-accent shadow'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Grid Cards View"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-navy-950 text-blue-600 dark:text-vault-accent shadow'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Compact List View"
              aria-label="List view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
