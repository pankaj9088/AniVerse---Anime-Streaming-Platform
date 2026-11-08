import React, { useState } from 'react';
import { 
  Play, 
  Heart, 
  Share2, 
  Star, 
  Calendar, 
  Tv, 
  Clock, 
  Check, 
  Search,
  MessageSquare,
  Sparkles,
  Info,
  ChevronRight,
  Plus,
  Shield,
  Edit3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AnimeCard } from '../AnimeCard';
import { AddEditEpisodeModal } from '../AddEditEpisodeModal';
import { Episode } from '../../types';

export const AnimeDetailsView: React.FC = () => {
  const { 
    animeList, 
    selectedAnimeId, 
    currentUser,
    setAdminTab,
    setAdminSelectedAnimeId,
    navigate, 
    toggleMyList, 
    isInMyList, 
    showToast 
  } = useApp();

  const isAdmin = currentUser?.role === 'admin';
  const [activeTab, setActiveTab] = useState<'episodes' | 'about' | 'reviews' | 'related'>('episodes');
  const [episodeSearch, setEpisodeSearch] = useState('');
  const [episodeModalOpen, setEpisodeModalOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);

  const anime = animeList.find(a => a.id === selectedAnimeId) || animeList[0];
  const isFav = isInMyList(anime.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Anime share link copied to clipboard!');
    } else {
      showToast('Sharing link copied!');
    }
  };

  const rawEpisodes = (anime.episodes || []).filter(ep => {
    // Normal users ONLY see published episodes
    if (!isAdmin && ep.status === 'Draft') return false;
    return true;
  });

  const filteredEpisodes = rawEpisodes.filter(ep => 
    ep.title.toLowerCase().includes(episodeSearch.toLowerCase()) ||
    ep.number.toString().includes(episodeSearch)
  );

  const relatedAnime = animeList
    .filter(a => a.id !== anime.id && a.genres.some(g => anime.genres.includes(g)))
    .slice(0, 5);

  return (
    <div className="min-h-screen pb-16 bg-[#F7F7FB]">
      
      {/* 1. Backdrop Banner Header */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-slate-900">
        <img
          src={anime.banner || anime.poster}
          alt={anime.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter blur-xs scale-105 opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F7F7FB] via-[#F7F7FB]/40 to-transparent" />
      </div>

      {/* 2. Main Details Floating Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-36 sm:-mt-48 relative z-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl flex flex-col md:flex-row gap-8 items-start">
          
          {/* Cover Poster with favorite button */}
          <div className="w-48 sm:w-56 md:w-64 shrink-0 mx-auto md:mx-0 -mt-16 sm:-mt-24 shadow-2xl rounded-2xl overflow-hidden border-4 border-white bg-slate-100 group relative">
            <img
              src={anime.poster}
              alt={anime.title}
              referrerPolicy="no-referrer"
              className="w-full aspect-3/4 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <button
              onClick={() => toggleMyList(anime.id)}
              className={`absolute top-3 right-3 p-2.5 rounded-full shadow-md transition-all cursor-pointer ${
                isFav
                  ? 'bg-white text-pink-500 scale-105'
                  : 'bg-white/80 backdrop-blur-xs text-slate-600 hover:text-pink-500 hover:bg-white'
              }`}
              title={isFav ? 'Remove from My List' : 'Add to My List'}
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-pink-500' : ''}`} />
            </button>
          </div>

          {/* Info Details Section */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                {anime.type} Series
              </span>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                anime.status === 'Ongoing'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                ● {anime.status}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Studio: {anime.studio}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              {anime.title}
            </h1>
            <p className="text-sm font-semibold text-purple-600 mt-0.5">
              {anime.japaneseTitle}
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-5 my-4 text-xs sm:text-sm font-semibold text-slate-600">
              <span className="flex items-center gap-1.5 text-amber-500 font-bold bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/60">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                {anime.rating} Rating
              </span>
              <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-xl">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {anime.year}
              </span>
              <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-xl">
                <Tv className="w-3.5 h-3.5 text-slate-500" />
                {anime.episodesCount} Episodes
              </span>
              <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-xl">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                24m / ep
              </span>
            </div>

            {/* Pastel Genre Tags */}
            <div className="flex flex-wrap gap-2 my-4">
              {anime.genres.map(genre => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-purple-50 text-purple-700 rounded-xl text-xs font-bold border border-purple-100/90"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
              {anime.synopsis}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                onClick={() => navigate('watch', anime.id, anime.episodes[0]?.number || 1)}
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Watch Now</span>
              </button>

              <button
                onClick={() => toggleMyList(anime.id)}
                className={`px-5 py-3 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 border transition-all cursor-pointer ${
                  isFav
                    ? 'bg-pink-50 text-pink-600 border-pink-200'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-purple-200'
                }`}
              >
                {isFav ? (
                  <>
                    <Check className="w-4 h-4 text-pink-600" />
                    <span>In My List</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 text-slate-600" />
                    <span>Add to My List</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShare}
                className="px-4 py-3 rounded-2xl font-bold text-sm text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
                title="Share this Anime"
              >
                <Share2 className="w-4 h-4 text-slate-600" />
                <span>Share</span>
              </button>
            </div>

          </div>

        </div>

        {/* 3. Navigation Tabs */}
        <div className="mt-8 bg-white rounded-2xl border border-slate-200/80 p-2 shadow-xs flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'episodes', label: `Episodes (${anime.episodesCount})`, icon: Tv },
            { id: 'about', label: 'About & Details', icon: Info },
            { id: 'reviews', label: `Reviews (${anime.reviews?.length || 2})`, icon: MessageSquare },
            { id: 'related', label: 'Related Anime', icon: Sparkles }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 4. Tab Content: Episodes */}
        {activeTab === 'episodes' && (
          <div className="mt-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            
            {/* 🛡️ ADMIN-ONLY EPISODE MANAGEMENT CONTROLS */}
            {isAdmin && (
              <div className="mb-6 p-4 rounded-2xl bg-purple-50 border border-purple-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-purple-950 block">
                      Admin Episode Controls Active
                    </span>
                    <span className="text-[11px] text-purple-700">
                      You have administrator rights for {anime.title}. Upload authorized videos, manage draft states, and edit air dates.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingEpisode(null);
                      setEpisodeModalOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Episode</span>
                  </button>

                  <button
                    onClick={() => {
                      setAdminSelectedAnimeId(anime.id);
                      setAdminTab('episodes');
                      navigate('admin');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Tv className="w-3.5 h-3.5 text-purple-600" />
                    <span>Manage Episodes</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 font-display">
                  Available Episodes
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Stream in 1080p Full HD with Sub & Dub</p>
              </div>

              {/* Search Episodes Bar */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search episodes..."
                  value={episodeSearch}
                  onChange={e => setEpisodeSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl text-xs text-slate-800 border border-slate-200 focus:outline-hidden focus:border-purple-500 focus:bg-white transition-colors"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Episode List */}
            <div className="space-y-3">
              {filteredEpisodes.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <Tv className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-bold text-slate-600">No episodes available matching your query.</p>
                </div>
              ) : (
                filteredEpisodes.map(ep => (
                  <div
                    key={ep.id}
                    onClick={() => navigate('watch', anime.id, ep.number)}
                    className="group p-3.5 rounded-2xl border border-slate-200/80 hover:border-purple-300 hover:bg-purple-50/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-6 text-sm font-extrabold text-slate-400 group-hover:text-purple-600 text-center shrink-0">
                        {ep.number}
                      </span>

                      <div className="relative w-28 sm:w-36 aspect-16/9 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={ep.thumbnail || anime.poster}
                          alt={ep.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                          {ep.duration}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-purple-700">
                            Episode {ep.number}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {ep.airDate}
                          </span>
                          {ep.status === 'Draft' && (
                            <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
                              DRAFT (HIDDEN FROM USERS)
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-purple-600 transition-colors mt-0.5">
                          {ep.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-1 max-w-xl">
                          {ep.synopsis}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Watch button: always plays this episode */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('watch', anime.id, ep.number);
                        }}
                        className="px-4 py-2 rounded-xl bg-purple-600 group-hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Watch</span>
                      </button>

                      {/* Admin-only quick edit */}
                      {isAdmin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingEpisode(ep);
                            setEpisodeModalOpen(true);
                          }}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 transition-colors cursor-pointer"
                          title="Edit Episode (Admin)"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* Tab Content: About */}
        {activeTab === 'about' && (
          <div className="mt-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h3 className="text-xl font-extrabold text-slate-900 font-display mb-4">
              Detailed Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-400 font-bold block mb-1">Original Title</span>
                <span className="font-semibold text-slate-800">{anime.japaneseTitle}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-400 font-bold block mb-1">Animation Studio</span>
                <span className="font-semibold text-slate-800">{anime.studio}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-400 font-bold block mb-1">Premiered Year</span>
                <span className="font-semibold text-slate-800">{anime.year}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-400 font-bold block mb-1">Audio & Subtitles</span>
                <span className="font-semibold text-slate-800">Japanese, English (Sub & Dub)</span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-bold text-slate-900 mb-2">Synopsis & Themes</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {anime.synopsis}
              </p>
            </div>
          </div>
        )}

        {/* Tab Content: Reviews */}
        {activeTab === 'reviews' && (
          <div className="mt-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 font-display">
                  Community Reviews
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Average Community Rating: {anime.rating}/10</p>
              </div>
            </div>

            <div className="space-y-4">
              {(anime.reviews || [
                {
                  id: 'rv-1',
                  author: 'Arjun Verma',
                  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
                  rating: 5,
                  date: 'Yesterday',
                  comment: 'An absolute masterpiece of modern anime. The emotional pacing and sound design elevate the story to new heights.',
                  likes: 74
                }
              ]).map(rv => (
                <div key={rv.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={rv.avatar} alt={rv.author} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <span className="font-bold text-sm text-slate-900">{rv.author}</span>
                        <span className="text-xs text-slate-400 ml-2">{rv.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-amber-500 text-xs font-bold gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{rv.rating}.0 / 5</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5">
                    {rv.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Related */}
        {activeTab === 'related' && (
          <div className="mt-6">
            <h3 className="text-xl font-extrabold text-slate-900 font-display mb-4">
              Anime Similar to {anime.title}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {relatedAnime.map(rel => (
                <AnimeCard key={rel.id} anime={rel} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Admin Episode Modal for this anime */}
      {isAdmin && (
        <AddEditEpisodeModal
          isOpen={episodeModalOpen}
          onClose={() => setEpisodeModalOpen(false)}
          preselectedAnimeId={anime.id}
          initialEpisode={editingEpisode}
        />
      )}

    </div>
  );
};
