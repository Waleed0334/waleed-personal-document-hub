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
    <div className="bg-navy-900/80 border border-slate-800 rounded-2xl p-3.5 space-y-3">
      {/* Top Row: Categories Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
              : 'bg-navy-800 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
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
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                : 'bg-navy-800 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Bottom Row: Type Filter, Favorites, Sort, View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* File Type Filter */}
          <div className="flex items-center gap-1 bg-navy-800 p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setSelectedType('all')}
              className={`px-2.5 py-1 rounded-lg transition ${
                selectedType === 'all'
                  ? 'bg-navy-950 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Types
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('pdf')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                selectedType === 'pdf'
                  ? 'bg-navy-950 text-rose-300 font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3 h-3 text-rose-400" /> PDFs
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('image')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                selectedType === 'image'
                  ? 'bg-navy-950 text-emerald-300 font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-3 h-3 text-emerald-400" /> Images
            </button>
          </div>

          {/* Favorites Filter */}
          <button
            type="button"
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 font-medium cursor-pointer ${
              onlyFavorites
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-navy-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-current text-amber-400' : ''}`} />
            <span>Favorites</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-navy-800 px-2.5 py-1.5 rounded-xl border border-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="date-desc" className="bg-navy-900 text-white">Newest First</option>
              <option value="date-asc" className="bg-navy-900 text-white">Oldest First</option>
              <option value="title-asc" className="bg-navy-900 text-white">Name: A to Z</option>
              <option value="title-desc" className="bg-navy-900 text-white">Name: Z to A</option>
              <option value="size-desc" className="bg-navy-900 text-white">Largest Size</option>
              <option value="views-desc" className="bg-navy-900 text-white">Most Viewed</option>
            </select>
          </div>

          {/* Grid / List Switcher */}
          <div className="flex items-center bg-navy-800 p-0.5 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-navy-950 text-vault-accent shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grid Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-navy-950 text-vault-accent shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Compact List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
