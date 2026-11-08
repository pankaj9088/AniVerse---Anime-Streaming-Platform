import React, { useState, useEffect } from 'react';
import { X, Sparkles, Plus, Image } from 'lucide-react';
import { Anime } from '../types';
import { ALL_GENRES } from '../data/animeData';

interface AddEditAnimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (animeData: any) => void;
  initialAnime?: Anime | null;
}

export const AddEditAnimeModal: React.FC<AddEditAnimeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialAnime
}) => {
  const [title, setTitle] = useState('');
  const [japaneseTitle, setJapaneseTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [poster, setPoster] = useState('');
  const [banner, setBanner] = useState('');
  const [rating, setRating] = useState('8.5');
  const [year, setYear] = useState('2026');
  const [episodesCount, setEpisodesCount] = useState('12');
  const [status, setStatus] = useState<'Ongoing' | 'Completed' | 'Upcoming'>('Ongoing');
  const [studio, setStudio] = useState('MAPPA');
  const [type, setType] = useState<'TV' | 'Movie' | 'OVA'>('TV');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Action', 'Fantasy']);

  useEffect(() => {
    if (initialAnime) {
      setTitle(initialAnime.title);
      setJapaneseTitle(initialAnime.japaneseTitle);
      setSynopsis(initialAnime.synopsis);
      setPoster(initialAnime.poster);
      setBanner(initialAnime.banner || initialAnime.poster);
      setRating(initialAnime.rating.toString());
      setYear(initialAnime.year.toString());
      setEpisodesCount(initialAnime.episodesCount.toString());
      setStatus(initialAnime.status);
      setStudio(initialAnime.studio);
      setType(initialAnime.type);
      setSelectedGenres(initialAnime.genres);
    } else {
      setTitle('');
      setJapaneseTitle('');
      setSynopsis('');
      setPoster('https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80');
      setBanner('https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80');
      setRating('8.5');
      setYear('2026');
      setEpisodesCount('12');
      setStatus('Ongoing');
      setStudio('MAPPA');
      setType('TV');
      setSelectedGenres(['Action', 'Fantasy']);
    }
  }, [initialAnime, isOpen]);

  if (!isOpen) return null;

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const data = {
      title: title.trim(),
      japaneseTitle: japaneseTitle.trim() || title.trim(),
      synopsis: synopsis.trim() || 'A thrilling new anime adventure streaming on AniVerse.',
      poster: poster.trim() || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
      banner: banner.trim() || poster.trim(),
      rating: parseFloat(rating) || 8.5,
      year: parseInt(year, 10) || 2026,
      episodesCount: parseInt(episodesCount, 10) || 12,
      status,
      studio: studio.trim() || 'ufotable',
      type,
      genres: selectedGenres.length > 0 ? selectedGenres : ['Action', 'Adventure'],
      episodes: initialAnime?.episodes || [
        {
          id: `ep-1-${Date.now()}`,
          number: 1,
          title: 'Pilot: The Journey Begins',
          duration: '24:00',
          airDate: 'Today',
          thumbnail: poster.trim(),
          synopsis: 'The beginning of an extraordinary journey.',
          views: '120K'
        }
      ]
    };

    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 font-display">
              {initialAnime ? 'Edit Anime' : 'Add New Anime'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Anime Title (English)</label>
              <input
                type="text"
                placeholder="e.g. Solo Leveling"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Japanese Title</label>
              <input
                type="text"
                placeholder="e.g. 俺だけレベルアップな件"
                value={japaneseTitle}
                onChange={e => setJapaneseTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Synopsis</label>
            <textarea
              rows={3}
              placeholder="Plot overview..."
              value={synopsis}
              onChange={e => setSynopsis(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Poster Image URL</label>
              <input
                type="text"
                placeholder="https://..."
                value={poster}
                onChange={e => setPoster(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Banner Image URL</label>
              <input
                type="text"
                placeholder="https://..."
                value={banner}
                onChange={e => setBanner(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Rating</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="10"
                value={rating}
                onChange={e => setRating(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Year</label>
              <input
                type="number"
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Total Episodes</label>
              <input
                type="number"
                value={episodesCount}
                onChange={e => setEpisodesCount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-purple-500"
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Studio</label>
              <input
                type="text"
                placeholder="e.g. ufotable, MAPPA"
                value={studio}
                onChange={e => setStudio(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Format Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-purple-500"
              >
                <option value="TV">TV Series</option>
                <option value="Movie">Movie</option>
                <option value="OVA">OVA / Special</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Select Genres</label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 border border-slate-100 rounded-xl bg-slate-50">
              {ALL_GENRES.map(g => {
                const isSelected = selectedGenres.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGenre(g)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-2xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 cursor-pointer transition-colors"
            >
              {initialAnime ? 'Save Changes' : 'Create Anime'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
