import React, { useState } from 'react';
import { 
  Heart, 
  Clock, 
  Settings, 
  LogOut, 
  User, 
  Play, 
  Trash2, 
  Edit3, 
  Check, 
  Tv, 
  Sparkles,
  Sliders,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AnimeCard } from '../AnimeCard';

export const ProfileView: React.FC = () => {
  const { 
    user, 
    currentUser,
    updateUser, 
    animeList, 
    navigate, 
    toggleMyList, 
    showToast,
    logout
  } = useApp();

  const [activeTab, setActiveTab] = useState<'my-list' | 'history' | 'settings'>('my-list');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);

  // Settings states
  const [streamQuality, setStreamQuality] = useState('1080p');
  const [audioPref, setAudioPref] = useState('sub');
  const [autoPlayNext, setAutoPlayNext] = useState(true);

  const myListAnime = animeList.filter(a => user.myList.includes(a.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    updateUser({ name: editName.trim(), email: editEmail.trim() });
    setEditModalOpen(false);
    showToast('Profile information saved!');
  };

  const handleSaveSettings = () => {
    showToast('Streaming preferences updated!');
  };

  return (
    <div className="min-h-screen bg-[#F7F7FB] py-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative group">
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-purple-100 shadow-md"
              />
              <button
                onClick={() => setEditModalOpen(true)}
                className="absolute -bottom-2 -right-2 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
                title="Edit avatar"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                  {user.name}
                </h1>
                <span className="text-[11px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md border border-purple-200">
                  Premium
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{user.email}</p>

              <button
                onClick={() => setEditModalOpen(true)}
                className="mt-3 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3 h-3 text-purple-600" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* User Stat Badges (from mockup: 12 My List, 48 Episodes Watched, 320 Hours Watched) */}
          <div className="flex items-center gap-3 sm:gap-6 bg-slate-50/80 p-4 rounded-2xl border border-slate-100 w-full md:w-auto justify-around">
            <div className="text-center px-2">
              <span className="text-xl sm:text-2xl font-black text-purple-600 block tabular-nums">
                {user.myList.length}
              </span>
              <span className="text-xs font-semibold text-slate-500">My List</span>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center px-2">
              <span className="text-xl sm:text-2xl font-black text-indigo-600 block tabular-nums">
                {user.stats.episodesWatched}
              </span>
              <span className="text-xs font-semibold text-slate-500">Episodes Watched</span>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center px-2">
              <span className="text-xl sm:text-2xl font-black text-pink-600 block tabular-nums">
                {user.stats.hoursWatched}
              </span>
              <span className="text-xs font-semibold text-slate-500">Hours Watched</span>
            </div>
          </div>

        </div>

        {/* Content Tabs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-3 border border-slate-200/80 shadow-xs space-y-1">
              <button
                onClick={() => setActiveTab('my-list')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'my-list'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Heart className={`w-4 h-4 ${activeTab === 'my-list' ? 'fill-white' : 'text-pink-500'}`} />
                  <span>My List</span>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'my-list' ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {user.myList.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  <span>Watch History</span>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'history' ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {user.watchHistory.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Account Settings</span>
              </button>

              {currentUser?.role === 'admin' && (
                <>
                  <div className="my-2 border-t border-slate-100" />
                  <button
                    onClick={() => navigate('admin')}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
                  >
                    <Tv className="w-4 h-4 text-purple-600" />
                    <span>Admin Dashboard</span>
                  </button>
                </>
              )}

              <div className="my-2 border-t border-slate-100" />

              <button
                onClick={() => logout()}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Main Tab Area */}
          <div className="lg:col-span-3">
            
            {/* Tab 1: My List */}
            {activeTab === 'my-list' && (
              <div>
                <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 font-display">
                      My Anime List ({myListAnime.length})
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Your saved series for streaming anytime
                    </p>
                  </div>
                </div>

                {myListAnime.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
                    {myListAnime.map(anime => (
                      <AnimeCard key={anime.id} anime={anime} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
                    <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-900">Your List is Empty</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      Explore trending series and click the heart icon on any anime to save it here!
                    </p>
                    <button
                      onClick={() => navigate('anime')}
                      className="mt-4 px-5 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-colors cursor-pointer"
                    >
                      Browse Anime
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Watch History */}
            {activeTab === 'history' && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 font-display">
                      Watch History
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pick up right where you left off
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {user.watchHistory.map((item, idx) => {
                    const anime = animeList.find(a => a.id === item.animeId);
                    if (!anime) return null;
                    return (
                      <div
                        key={`${item.animeId}-${idx}`}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={anime.poster}
                            alt={anime.title}
                            referrerPolicy="no-referrer"
                            className="w-16 h-20 rounded-xl object-cover shrink-0 shadow-xs"
                          />
                          <div>
                            <span className="text-xs font-bold text-purple-600">
                              Episode {item.episodeNumber}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                              {anime.title}
                            </h4>
                            <p className="text-xs text-slate-500">{item.episodeTitle}</p>
                            
                            {/* Progress bar */}
                            <div className="w-40 sm:w-56 bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                              <div
                                className="bg-purple-600 h-full rounded-full"
                                style={{ width: `${item.progressPercent}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              Watched {item.watchedAt} ({item.progressPercent}%)
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate('watch', anime.id, item.episodeNumber)}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer shrink-0"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Resume</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 3: Account Settings */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
                <h2 className="text-xl font-extrabold text-slate-900 font-display mb-1">
                  Streaming & Account Settings
                </h2>
                <p className="text-xs text-slate-500 mb-6">Customize playback quality and subtitle languages</p>

                <div className="space-y-6 max-w-xl">
                  {/* Quality preference */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Default Video Playback Quality
                    </label>
                    <select
                      value={streamQuality}
                      onChange={e => setStreamQuality(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    >
                      <option value="1080p">1080p Full HD (Recommended)</option>
                      <option value="720p">720p HD (Data Saver)</option>
                      <option value="480p">480p Standard</option>
                      <option value="Auto">Auto Adjust</option>
                    </select>
                  </div>

                  {/* Audio preference */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Default Audio & Subtitle Language
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setAudioPref('sub')}
                        className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                          audioPref === 'sub'
                            ? 'bg-purple-50 border-purple-300 text-purple-700'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        Japanese Audio (English Sub)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAudioPref('dub')}
                        className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                          audioPref === 'dub'
                            ? 'bg-purple-50 border-purple-300 text-purple-700'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        English Dubbed
                      </button>
                    </div>
                  </div>

                  {/* Auto Next Toggle */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Auto-Play Next Episode
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Automatically advance to the subsequent episode when current finishes
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoPlayNext}
                      onChange={e => setAutoPlayNext(e.target.checked)}
                      className="rounded-sm text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  {/* Save button */}
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-extrabold text-slate-900 font-display mb-4">
              Edit User Profile
            </h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-purple-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
