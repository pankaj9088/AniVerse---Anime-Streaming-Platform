import React, { useState, useMemo } from 'react';
import { 
  LayoutGrid, 
  List, 
  Search, 
  Filter, 
  RotateCcw, 
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AnimeCard } from '../AnimeCard';
import { ALL_GENRES } from '../../data/animeData';

export const AnimeListingView: React.FC = () => {
  const { 
    animeList, 
    searchQuery, 
    setSearchQuery, 
    selectedGenre, 
    setSelectedGenre 
  } = useApp();

  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    selectedGenre ? [selectedGenre] : []
  );
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [yearFrom, setYearFrom] = useState<string>('From');
  const [yearTo, setYearTo] = useState<string>('To');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'latest' | 'title'>('popularity');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync if external selectedGenre changes
  React.useEffect(() => {
    if (selectedGenre && !selectedGenres.includes(selectedGenre)) {
      setSelectedGenres([selectedGenre]);
    }
  }, [selectedGenre]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const toggleStatus = (status: string) => {
    setSelectedStatus(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const handleResetFilters = () => {
    setLocalSearch('');
    setSearchQuery('');
    setSelectedGenres([]);
    setSelectedGenre(null);
    setSelectedStatus([]);
    setYearFrom('From');
    setYearTo('To');
    setSortBy('popularity');
  };

  const filteredAnime = useMemo(() => {
    return animeList.filter(anime => {
      // Search term
      const query = (localSearch || searchQuery).trim().toLowerCase();
      if (query) {
        const matchesTitle = anime.title.toLowerCase().includes(query);
        const matchesJp = anime.japaneseTitle.toLowerCase().includes(query);
        const matchesGenre = anime.genres.some(g => g.toLowerCase().includes(query));
        if (!matchesTitle && !matchesJp && !matchesGenre) return false;
      }

      // Genres filter
      if (selectedGenres.length > 0) {
        const hasAnyGenre = selectedGenres.some(g => anime.genres.includes(g));
        if (!hasAnyGenre) return false;
      }

      // Status filter
      if (selectedStatus.length > 0) {
        if (!selectedStatus.includes(anime.status)) return false;
      }

      // Year range filter
      if (yearFrom !== 'From' && anime.year < parseInt(yearFrom, 10)) {
        return false;
      }
      if (yearTo !== 'To' && anime.year > parseInt(yearTo, 10)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popularity') {
        return (a.popularityRank || 99) - (b.popularityRank || 99);
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'latest') {
        return b.year - a.year;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [animeList, localSearch, searchQuery, selectedGenres, selectedStatus, yearFrom, yearTo, sortBy]);

  const yearOptions = ['From', '1995', '2000', '2010', '2015', '2020', '2022', '2024', '2026'];
  const yearToOptions = ['To', '2005', '2015', '2020', '2022', '2024', '2026'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Mobile filter toggle bar */}
      <div className="lg:hidden mb-4 flex items-center justify-between">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-700 shadow-xs cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-purple-600" />
          <span>Filters {selectedGenres.length > 0 && `(${selectedGenres.length})`}</span>
        </button>

        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setLayout('grid')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              layout === 'grid' ? 'bg-purple-50 text-purple-600' : 'text-slate-400'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLayout('list')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              layout === 'list' ? 'bg-purple-50 text-purple-600' : 'text-slate-400'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar (Desktop) */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs sticky top-22">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-purple-600" />
                <h3 className="font-extrabold text-slate-900 text-base font-display">Filters</h3>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Keyword Search */}
            <div className="mt-4">
              <label className="text-xs font-bold text-slate-600 block mb-1.5">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Title or keywords..."
                  value={localSearch}
                  onChange={e => {
                    setLocalSearch(e.target.value);
                    setSearchQuery(e.target.value);
                  }}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-purple-500 focus:bg-white transition-colors"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Genres Checklist */}
            <div className="mt-5">
              <label className="text-xs font-bold text-slate-600 block mb-2">Genres</label>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 text-xs">
                {ALL_GENRES.map(genre => {
                  const checked = selectedGenres.includes(genre);
                  return (
                    <label
                      key={genre}
                      className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-50 cursor-pointer text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleGenre(genre)}
                        className="rounded-sm border-slate-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
                      />
                      <span className={checked ? 'font-bold text-purple-700' : ''}>{genre}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Year Range */}
            <div className="mt-5">
              <label className="text-xs font-bold text-slate-600 block mb-1.5">Release Year</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={yearFrom}
                  onChange={e => setYearFrom(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-hidden focus:border-purple-500"
                >
                  {yearOptions.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <select
                  value={yearTo}
                  onChange={e => setYearTo(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-hidden focus:border-purple-500"
                >
                  {yearToOptions.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status */}
            <div className="mt-5">
              <label className="text-xs font-bold text-slate-600 block mb-2">Status</label>
              <div className="space-y-1.5 text-xs text-slate-700">
                {['Ongoing', 'Completed', 'Upcoming'].map(status => (
                  <label
                    key={status}
                    className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStatus.includes(status)}
                      onChange={() => toggleStatus(status)}
                      className="rounded-sm border-slate-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
                    />
                    <span>{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div className="mt-5">
              <label className="text-xs font-bold text-slate-600 block mb-1.5">Sort By</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="w-full px-2 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-hidden focus:border-purple-500"
              >
                <option value="popularity">Popularity</option>
                <option value="rating">Highest Rating</option>
                <option value="latest">Latest Released</option>
                <option value="title">Alphabetical (A-Z)</option>
              </select>
            </div>

            {/* Apply Button */}
            <button
              onClick={() => {}}
              className="mt-6 w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-purple-200 transition-all cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Anime Grid Content Area */}
        <div className="lg:col-span-3">
          
          {/* Top Bar for Results & Layout */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                All Anime
              </h1>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Showing {filteredAnime.length} of {animeList.length} anime series
                {(localSearch || selectedGenres.length > 0) && ' (filtered)'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Active genre chips summary */}
              {selectedGenres.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  {selectedGenres.map(g => (
                    <span 
                      key={g} 
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md text-[11px] font-bold border border-purple-200"
                    >
                      {g}
                      <button onClick={() => toggleGenre(g)} className="hover:text-purple-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Grid / List switchers */}
              <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setLayout('grid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    layout === 'grid'
                      ? 'bg-white text-purple-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Grid</span>
                </button>
                <button
                  onClick={() => setLayout('list')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    layout === 'list'
                      ? 'bg-white text-purple-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>List</span>
                </button>
              </div>
            </div>
          </div>

          {/* Anime Items Display */}
          {filteredAnime.length > 0 ? (
            layout === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredAnime.map(anime => (
                  <AnimeCard key={anime.id} anime={anime} layout="grid" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAnime.map(anime => (
                  <AnimeCard key={anime.id} anime={anime} layout="list" />
                ))}
              </div>
            )
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Anime Found</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
                We couldn't find any anime matching your current filter criteria. Try adjusting your search query or reset the filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-5 px-5 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-colors shadow-xs cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/40 backdrop-blur-xs lg:hidden">
          <div className="w-4/5 max-w-sm bg-white h-full p-5 overflow-y-auto ml-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base">Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Genres */}
              <div className="mt-4">
                <label className="text-xs font-bold text-slate-600 block mb-2">Genres</label>
                <div className="space-y-1 text-xs">
                  {ALL_GENRES.map(g => (
                    <label key={g} className="flex items-center gap-2 py-1">
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(g)}
                        onChange={() => toggleGenre(g)}
                        className="rounded-sm border-slate-300 text-purple-600"
                      />
                      <span>{g}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Show {filteredAnime.length} Results
              </button>
              <button
                onClick={handleResetFilters}
                className="w-full py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
