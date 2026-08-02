import React from 'react';
import { FilterState } from '../types';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  availableGenres: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  availableGenres
}) => {
  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 mb-8 backdrop-blur-md shadow-xl">
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search game title, C# features, or render pipeline..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-[#020204]/80 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/80 transition-all font-mono"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase font-mono tracking-wider text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Genre Filter */}
          <select
            value={filters.selectedGenre}
            onChange={(e) => onFilterChange({ selectedGenre: e.target.value })}
            className="px-3.5 py-2.5 bg-[#020204] border border-white/10 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/80 cursor-pointer"
          >
            <option value="ALL">All Genres</option>
            {availableGenres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          {/* Platform Filter */}
          <select
            value={filters.selectedPlatform}
            onChange={(e) => onFilterChange({ selectedPlatform: e.target.value })}
            className="px-3.5 py-2.5 bg-[#020204] border border-white/10 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/80 cursor-pointer"
          >
            <option value="ALL">All Platforms</option>
            <option value="windows">Windows (.exe)</option>
            <option value="mac">macOS (.app)</option>
            <option value="linux">Linux (.AppImage)</option>
            <option value="webgl">WebGL Browser</option>
            <option value="android">Android (.apk)</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.selectedStatus}
            onChange={(e) => onFilterChange({ selectedStatus: e.target.value })}
            className="px-3.5 py-2.5 bg-[#020204] border border-white/10 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/80 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="Released">Released</option>
            <option value="Playable Demo">Playable Demo</option>
            <option value="Early Access">Early Access</option>
            <option value="In Development">In Development</option>
          </select>

          {/* Sort By */}
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
            className="px-3.5 py-2.5 bg-[#020204] border border-white/10 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500/80 cursor-pointer"
          >
            <option value="featured">Featured First</option>
            <option value="newest">Newest Releases</option>
            <option value="downloads">Most Downloaded</option>
            <option value="rating">Highest Rated</option>
          </select>

          {/* Reset Filters */}
          {(filters.searchQuery || filters.selectedGenre !== 'ALL' || filters.selectedPlatform !== 'ALL' || filters.selectedStatus !== 'ALL') && (
            <button
              onClick={onReset}
              className="p-2.5 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border border-white/10 rounded-xl text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Reset</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
