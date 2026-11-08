import React, { useState } from 'react';
import { 
  Sparkles, 
  LayoutDashboard, 
  Film, 
  Tv, 
  Users, 
  BarChart3, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Search, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  ArrowLeft,
  ChevronDown,
  Play,
  FileVideo,
  ShieldCheck,
  Check,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Anime, AdminTab, Episode } from '../../types';
import { ADMIN_STATS } from '../../data/animeData';
import { AddEditAnimeModal } from '../AddEditAnimeModal';
import { AddEditEpisodeModal } from '../AddEditEpisodeModal';

export const AdminDashboardView: React.FC = () => {
  const { 
    animeList, 
    addAnime, 
    updateAnime, 
    deleteAnime, 
    deleteEpisode,
    toggleEpisodeStatus,
    adminSelectedAnimeId,
    setAdminSelectedAnimeId,
    navigate, 
    user 
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  
  // Anime Modal State
  const [animeModalOpen, setAnimeModalOpen] = useState(false);
  const [editingAnime, setEditingAnime] = useState<Anime | null>(null);
  
  // Episode Modal State
  const [episodeModalOpen, setEpisodeModalOpen] = useState(false);
  const [targetAnimeIdForEp, setTargetAnimeIdForEp] = useState<string>(adminSelectedAnimeId || animeList[0]?.id || 'demon-slayer');
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);

  // Filters & Search
  const [searchTable, setSearchTable] = useState('');
  const [episodeSearch, setEpisodeSearch] = useState('');
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; val: string; date: string } | null>(null);

  // Selected anime for Episode Management tab
  const currentEpAnime = animeList.find(a => a.id === targetAnimeIdForEp) || animeList[0];

  // SVG Chart data for "Views (Last 30 Days)"
  const chartPoints = [
    { date: 'Aug 18', views: '48.2K', y: 140 },
    { date: 'Aug 22', views: '54.5K', y: 110 },
    { date: 'Aug 26', views: '51.0K', y: 130 },
    { date: 'Aug 30', views: '63.2K', y: 85 },
    { date: 'Sep 3',  views: '58.0K', y: 105 },
    { date: 'Sep 7',  views: '71.5K', y: 65 },
    { date: 'Sep 11', views: '68.0K', y: 75 },
    { date: 'Sep 15', views: '85.2K', y: 35 },
  ];

  // Total published episodes across catalog
  const totalPublishedEpisodes = animeList.reduce((acc, curr) => {
    return acc + (curr.episodes || []).filter(e => e.status !== 'Draft').length;
  }, 0);

  // Actions for Anime
  const handleEditAnimeClick = (anime: Anime) => {
    setEditingAnime(anime);
    setAnimeModalOpen(true);
  };

  const handleAddAnimeClick = () => {
    setEditingAnime(null);
    setAnimeModalOpen(true);
  };

  const handleSaveAnimeModal = (data: any) => {
    if (editingAnime) {
      updateAnime(editingAnime.id, data);
    } else {
      addAnime(data);
    }
  };

  // Actions for Episodes
  const handleAddEpisodeForAnime = (animeId: string) => {
    setTargetAnimeIdForEp(animeId);
    setEditingEpisode(null);
    setEpisodeModalOpen(true);
  };

  const handleManageEpisodesForAnime = (animeId: string) => {
    setTargetAnimeIdForEp(animeId);
    setAdminSelectedAnimeId(animeId);
    setActiveTab('episodes');
  };

  const handleEditEpisodeClick = (ep: Episode, animeId: string) => {
    setTargetAnimeIdForEp(animeId);
    setEditingEpisode(ep);
    setEpisodeModalOpen(true);
  };

  const handleDeleteEpisodeClick = async (animeId: string, ep: Episode) => {
    if (window.confirm(`Are you sure you want to delete Episode ${ep.number} ("${ep.title}")?`)) {
      await deleteEpisode(animeId, ep.id);
    }
  };

  const filteredAnimeList = animeList.filter(a =>
    a.title.toLowerCase().includes(searchTable.toLowerCase()) ||
    a.status.toLowerCase().includes(searchTable.toLowerCase()) ||
    a.genres.some(g => g.toLowerCase().includes(searchTable.toLowerCase()))
  );

  const episodesForCurrentAnime = (currentEpAnime?.episodes || []).filter(ep =>
    ep.title.toLowerCase().includes(episodeSearch.toLowerCase()) ||
    ep.number.toString().includes(episodeSearch) ||
    (ep.status || 'Published').toLowerCase().includes(episodeSearch.toLowerCase())
  );

  const publishedCount = (currentEpAnime?.episodes || []).filter(e => e.status !== 'Draft').length;
  const draftCount = (currentEpAnime?.episodes || []).filter(e => e.status === 'Draft').length;

  return (
    <div className="min-h-screen bg-[#F7F7FB] flex flex-col md:flex-row">
      
      {/* 1. Admin White Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="flex items-center justify-between pb-6 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-base text-slate-900 font-display block leading-none">
                  AniVerse
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                  Admin Panel
                </span>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'anime', label: 'Anime Catalog', icon: Film },
              { id: 'episodes', label: 'Episode Management', icon: Tv },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-purple-50 text-purple-700 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.id === 'episodes' && (
                    <span className="ml-auto text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded-md">
                      {totalPublishedEpisodes}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Back to Client Site button */}
        <div className="pt-6 border-t border-slate-100 space-y-2">
          <button
            onClick={() => navigate('home')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to AniVerse</span>
          </button>
          
          <div className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-slate-900 block truncate">{user.name}</span>
              <span className="text-[10px] text-purple-600 font-semibold">Super Admin</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Admin Dashboard Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'anime' && 'Anime Catalog Management'}
              {activeTab === 'episodes' && 'Episode Management System'}
              {activeTab === 'users' && 'User Accounts & Roles'}
              {activeTab === 'analytics' && 'Streaming Engagement Analytics'}
              {activeTab === 'settings' && 'Platform & Storage Settings'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Authorized anime streaming administration · Cloud video storage & real-time episode publishing
            </p>
          </div>

          {/* Header Action Buttons: Add Anime & Add Episode */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleAddEpisodeForAnime(targetAnimeIdForEp)}
              className="px-3.5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold flex items-center gap-2 border border-purple-200 shadow-2xs transition-all cursor-pointer"
              title="Add a new episode to any anime series"
            >
              <Plus className="w-4 h-4 text-purple-600" />
              <span>+ Add Episode</span>
            </button>

            <button
              onClick={handleAddAnimeClick}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm shadow-purple-500/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Anime</span>
            </button>
          </div>
        </div>

        {/* 3. Metric Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Total Anime */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Total Anime</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Film className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-display tabular-nums">
                {animeList.length}
              </span>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                +4 this wk
              </span>
            </div>
          </div>

          {/* Total Published Episodes (Auto Calculated) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Published Episodes</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Tv className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-display tabular-nums">
                {totalPublishedEpisodes.toLocaleString()}
              </span>
              <span className="text-[11px] font-bold text-emerald-600">
                Auto-calculated
              </span>
            </div>
          </div>

          {/* Total Users */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Total Users</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-display tabular-nums">
                {ADMIN_STATS.totalUsers.toLocaleString()}
              </span>
              <span className="text-[11px] font-bold text-emerald-600">
                Active RBAC
              </span>
            </div>
          </div>

          {/* Total Views */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Total Video Streams</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-display tabular-nums">
                {ADMIN_STATS.totalViews.toLocaleString()}
              </span>
              <span className="text-[11px] font-bold text-emerald-600">
                {ADMIN_STATS.viewsGrowth}
              </span>
            </div>
          </div>

        </div>

        {/* ---------------- ACTIVE TAB: EPISODES MANAGEMENT ---------------- */}
        {activeTab === 'episodes' && (
          <div className="space-y-6">
            
            {/* Episode Management Control Header Bar */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-slate-100">
                
                {/* Anime Series Selector */}
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Select Anime Series To Manage
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <select
                      value={targetAnimeIdForEp}
                      onChange={e => {
                        setTargetAnimeIdForEp(e.target.value);
                        setAdminSelectedAnimeId(e.target.value);
                      }}
                      className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white w-full sm:w-80 cursor-pointer"
                    >
                      {animeList.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.title} ({a.episodesCount} published eps)
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleAddEpisodeForAnime(targetAnimeIdForEp)}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-purple-500/25 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Episode to {currentEpAnime?.title}</span>
                    </button>
                  </div>
                </div>

                {/* Quick Status Count Pills */}
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl px-4 py-2.5 text-center">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase block">Published (Live)</span>
                    <span className="text-xl font-extrabold text-emerald-700">{publishedCount}</span>
                  </div>
                  <div className="bg-amber-50 border border-amber-200/80 rounded-2xl px-4 py-2.5 text-center">
                    <span className="text-[11px] font-bold text-amber-800 uppercase block">Draft (Hidden)</span>
                    <span className="text-xl font-extrabold text-amber-700">{draftCount}</span>
                  </div>
                  <div className="bg-purple-50 border border-purple-200/80 rounded-2xl px-4 py-2.5 text-center">
                    <span className="text-[11px] font-bold text-purple-800 uppercase block">Total in DB</span>
                    <span className="text-xl font-extrabold text-purple-700">{currentEpAnime?.episodes?.length || 0}</span>
                  </div>
                </div>

              </div>

              {/* Episode Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 font-display">
                    Episodes of {currentEpAnime?.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authorized video URLs, stream durations, and publication states
                  </p>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search episode title or number..."
                    value={episodeSearch}
                    onChange={e => setEpisodeSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-purple-500 w-56 sm:w-64"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* Episodes Table */}
              <div className="overflow-x-auto mt-5">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-3">Ep #</th>
                      <th className="py-3 px-3">Thumbnail</th>
                      <th className="py-3 px-3">Title & Synopsis</th>
                      <th className="py-3 px-3">Duration</th>
                      <th className="py-3 px-3">Air Date</th>
                      <th className="py-3 px-3">Publish Status</th>
                      <th className="py-3 px-3">Video Storage</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {episodesForCurrentAnime.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400">
                          <Tv className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                          <p className="font-bold text-sm text-slate-600">No episodes found for this anime series.</p>
                          <p className="text-xs text-slate-400 mt-1">Click "+ Add Episode to {currentEpAnime?.title}" above to create the first episode.</p>
                        </td>
                      </tr>
                    ) : (
                      episodesForCurrentAnime.map(ep => (
                        <tr key={ep.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-3 font-extrabold text-slate-900 tabular-nums">
                            EP {ep.number}
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="relative w-16 aspect-16/9 rounded-lg overflow-hidden bg-slate-100 shadow-2xs">
                              <img
                                src={ep.thumbnail || currentEpAnime?.poster}
                                alt={ep.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="py-3.5 px-3 max-w-xs">
                            <div className="font-bold text-slate-900 truncate">{ep.title}</div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {ep.synopsis}
                            </div>
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-slate-700 tabular-nums">
                            {ep.duration}
                          </td>
                          <td className="py-3.5 px-3 text-slate-500 font-medium">
                            {ep.airDate}
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-1.5">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                ep.status !== 'Draft'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {ep.status !== 'Draft' ? '● Published' : '○ Draft'}
                              </span>
                              
                              {/* Quick Toggle Status Button */}
                              <button
                                onClick={() => toggleEpisodeStatus(currentEpAnime.id, ep.id)}
                                className="p-1 rounded-md text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                                title={ep.status !== 'Draft' ? 'Click to make Draft' : 'Click to Publish'}
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-1 text-[11px] text-purple-700 font-medium">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate max-w-[120px] font-mono text-[10px]">
                                {ep.videoStorageType || 'Cloud CDN'}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">
                              Size: {ep.fileSize || '38 MB'}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="inline-flex items-center gap-1">
                              {/* Preview / Watch in Player */}
                              <button
                                onClick={() => navigate('watch', currentEpAnime.id, ep.number)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                                title="Watch / Preview Episode in Video Player"
                              >
                                <Play className="w-4 h-4" />
                              </button>

                              {/* Edit Episode */}
                              <button
                                onClick={() => handleEditEpisodeClick(ep, currentEpAnime.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                                title="Edit Episode Details"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {/* Delete Episode */}
                              <button
                                onClick={() => handleDeleteEpisodeClick(currentEpAnime.id, ep)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Delete Episode"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

        {/* ---------------- ACTIVE TAB: DASHBOARD OR ANIME CATALOG ---------------- */}
        {activeTab !== 'episodes' && (
          <>
            {/* 4. Interactive Views Chart (Last 30 Days) - Shown in Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900 font-display">
                      Views ({timeRange})
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Global stream engagement trajectory</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={timeRange}
                      onChange={e => setTimeRange(e.target.value)}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer focus:outline-hidden focus:border-purple-400"
                    >
                      <option value="Last 30 Days">Last 30 Days</option>
                      <option value="Last 7 Days">Last 7 Days</option>
                      <option value="This Year">This Year</option>
                    </select>
                  </div>
                </div>

                {/* Smooth SVG Area Wave Chart */}
                <div className="relative w-full h-56 pt-2">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 700 180" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="viewsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal grid lines */}
                    <line x1="0" y1="40" x2="700" y2="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="0" y1="80" x2="700" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="0" y1="120" x2="700" y2="120" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="0" y1="160" x2="700" y2="160" stroke="#f1f5f9" strokeWidth="1" />

                    {/* Filled area path */}
                    <path
                      d="M 20 140 C 90 120, 140 100, 190 110 C 240 120, 270 90, 310 85 C 360 80, 400 110, 440 105 C 490 95, 520 60, 560 65 C 600 70, 630 50, 680 35 L 680 160 L 20 160 Z"
                      fill="url(#viewsGradient)"
                    />

                    {/* Gradient stroke curve */}
                    <path
                      d="M 20 140 C 90 120, 140 100, 190 110 C 240 120, 270 90, 310 85 C 360 80, 400 110, 440 105 C 490 95, 520 60, 560 65 C 600 70, 630 50, 680 35"
                      fill="none"
                      stroke="#7C3AED"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Data points */}
                    {[
                      { cx: 20, cy: 140, date: 'Aug 18', views: '48.2K' },
                      { cx: 110, cy: 110, date: 'Aug 22', views: '54.5K' },
                      { cx: 200, cy: 112, date: 'Aug 26', views: '51.0K' },
                      { cx: 310, cy: 85,  date: 'Aug 30', views: '63.2K' },
                      { cx: 440, cy: 105, date: 'Sep 3',  views: '58.0K' },
                      { cx: 560, cy: 65,  date: 'Sep 7',  views: '71.5K' },
                      { cx: 620, cy: 55,  date: 'Sep 11', views: '76.8K' },
                      { cx: 680, cy: 35,  date: 'Sep 15', views: '85.2K' },
                    ].map((pt, i) => (
                      <g key={i}>
                        <circle
                          cx={pt.cx}
                          cy={pt.cy}
                          r="5"
                          className="fill-white stroke-purple-600 stroke-[3px] hover:r-7 cursor-pointer transition-all"
                          onMouseEnter={() => setHoveredPoint({ x: pt.cx, y: pt.cy, val: pt.views, date: pt.date })}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      </g>
                    ))}
                  </svg>

                  {/* Hover Tooltip */}
                  {hoveredPoint && (
                    <div 
                      className="absolute bg-slate-900 text-white text-[11px] px-2.5 py-1 rounded-lg pointer-events-none shadow-lg -translate-x-1/2 -translate-y-full mb-2"
                      style={{ left: `${(hoveredPoint.x / 700) * 100}%`, top: `${hoveredPoint.y}px` }}
                    >
                      <div className="font-bold">{hoveredPoint.val} views</div>
                      <div className="text-[9px] text-slate-300">{hoveredPoint.date}</div>
                    </div>
                  )}
                </div>

                {/* Dates X-Axis */}
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mt-3 pt-2 border-t border-slate-100">
                  {chartPoints.map(p => (
                    <span key={p.date}>{p.date}</span>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Anime Management Table with "+ Add Episode" and "Manage Episodes" actions */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 font-display">
                    {activeTab === 'anime' ? 'All Anime Titles & Episode Controls' : 'Recently Added Anime'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click <strong>+ Add Episode</strong> or <strong>Manage Episodes</strong> on any anime row
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Filter anime..."
                      value={searchTable}
                      onChange={e => setSearchTable(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-purple-500 w-44 sm:w-56"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>

                  <button
                    onClick={handleAddAnimeClick}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Anime</span>
                  </button>
                </div>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-3">#</th>
                      <th className="py-3 px-3">Poster</th>
                      <th className="py-3 px-3">Anime Title</th>
                      <th className="py-3 px-3">Total Published Episodes</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Episode & Catalog Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredAnimeList.slice(0, activeTab === 'anime' ? 50 : 10).map((anime, index) => {
                      const publishedEps = (anime.episodes || []).filter(e => e.status !== 'Draft').length;
                      return (
                        <tr key={anime.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3 font-semibold text-slate-400 tabular-nums">
                            {index + 1}
                          </td>
                          <td className="py-3 px-3">
                            <img
                              src={anime.poster}
                              alt={anime.title}
                              referrerPolicy="no-referrer"
                              className="w-10 h-14 object-cover rounded-lg bg-slate-100 shadow-2xs"
                            />
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{anime.title}</div>
                            <div className="text-[11px] text-slate-500 font-medium">
                              {anime.genres.slice(0, 2).join(', ')} · {anime.studio}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900 tabular-nums text-sm">
                                {publishedEps}
                              </span>
                              <span className="text-[10px] text-purple-700 bg-purple-50 font-bold px-1.5 py-0.5 rounded-md border border-purple-100">
                                Live
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              anime.status === 'Ongoing'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : anime.status === 'Completed'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {anime.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              
                              {/* 1. "+ Add Episode" Action Button */}
                              <button
                                onClick={() => handleAddEpisodeForAnime(anime.id)}
                                className="px-2.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                                title={`Add new episode to ${anime.title}`}
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>+ Add Ep</span>
                              </button>

                              {/* 2. "Manage Episodes" Action Button */}
                              <button
                                onClick={() => handleManageEpisodesForAnime(anime.id)}
                                className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-bold flex items-center gap-1 border border-purple-200 transition-colors cursor-pointer"
                                title={`Manage all episodes of ${anime.title}`}
                              >
                                <Tv className="w-3.5 h-3.5 text-purple-600" />
                                <span>Episodes ({publishedEps})</span>
                              </button>

                              {/* View Details */}
                              <button
                                onClick={() => navigate('details', anime.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                                title="View Anime Details Page"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Edit Anime */}
                              <button
                                onClick={() => handleEditAnimeClick(anime)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                                title="Edit Anime Metadata"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {/* Delete Anime */}
                              <button
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to delete "${anime.title}" and all its episodes?`)) {
                                    deleteAnime(anime.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Delete Anime"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          </>
        )}

      </main>

      {/* Add / Edit Anime Modal */}
      <AddEditAnimeModal
        isOpen={animeModalOpen}
        onClose={() => setAnimeModalOpen(false)}
        onSave={handleSaveAnimeModal}
        initialAnime={editingAnime}
      />

      {/* Add / Edit Episode Modal with Authorized Storage & Auto-Calculation */}
      <AddEditEpisodeModal
        isOpen={episodeModalOpen}
        onClose={() => setEpisodeModalOpen(false)}
        preselectedAnimeId={targetAnimeIdForEp}
        initialEpisode={editingEpisode}
      />

    </div>
  );
};
