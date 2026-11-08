import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Bell, 
  ChevronDown, 
  Shield, 
  Heart, 
  Clock, 
  Settings, 
  LogOut, 
  User, 
  LogIn,
  X,
  Play
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ViewType } from '../types';

export const Navbar: React.FC = () => {
  const { 
    currentView, 
    navigate, 
    user, 
    currentUser, 
    logout,
    searchQuery, 
    setSearchQuery, 
    animeList 
  } = useApp();
  
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks: { label: string; view: ViewType }[] = [
    { label: 'Home', view: 'home' },
    { label: 'Anime', view: 'anime' },
    { label: 'Genres', view: 'genres' },
    { label: 'Trending', view: 'trending' },
    { label: 'Movies', view: 'movies' },
  ];

  const searchResults = searchQuery.trim()
    ? animeList.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('anime');
      setSearchFocused(false);
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Left: Brand & Nav Links */}
        <div className="flex items-center gap-8">
          <button 
            onClick={() => navigate('home')} 
            className="flex items-center gap-2 group cursor-pointer text-left focus:outline-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-sm shadow-purple-200 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-purple-600 transition-colors font-display">
              AniVerse
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.label}
                  onClick={() => navigate(link.view)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'text-purple-600 bg-purple-50/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Search, Notifications & User Authentication */}
        <div className="flex items-center gap-3">
          
          {/* Search bar */}
          <div className="relative">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-40 sm:w-56 md:w-64 pl-9 pr-8 py-2 text-xs md:text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 border border-slate-200/60 rounded-xl focus:outline-hidden focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Live Search Quick Results */}
            {searchFocused && searchResults.length > 0 && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                onMouseDown={e => e.preventDefault()}
              >
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Quick Matches
                </div>
                <div className="divide-y divide-slate-100">
                  {searchResults.map(anime => (
                    <button
                      key={anime.id}
                      onClick={() => {
                        navigate('details', anime.id);
                        setSearchFocused(false);
                      }}
                      className="w-full px-3 py-2 flex items-center gap-3 hover:bg-purple-50/60 text-left transition-colors cursor-pointer"
                    >
                      <img
                        src={anime.poster}
                        alt={anime.title}
                        referrerPolicy="no-referrer"
                        className="w-9 h-12 object-cover rounded-md bg-slate-100 shrink-0"
                      />
                      <div className="overflow-hidden">
                        <div className="text-sm font-semibold text-slate-900 truncate">
                          {anime.title}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5">
                          <span className="text-amber-500 font-bold">★ {anime.rating}</span>
                          <span>·</span>
                          <span>{anime.episodesCount} EP</span>
                          <span>·</span>
                          <span className="truncate">{anime.genres[0]}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl relative transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="w-2.5 h-2.5 bg-pink-500 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white animate-pulse" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-900">Notifications</span>
                  <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full">
                    2 New
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  <div 
                    onClick={() => {
                      navigate('watch', 'demon-slayer', 5);
                      setNotifOpen(false);
                    }}
                    className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex gap-3 items-start transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Play className="w-4 h-4 fill-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">Demon Slayer Episode 5 is now out!</p>
                      <p className="text-xs text-slate-500 mt-0.5">Tanjiro continues his perilous trial on Mt. Sagiri.</p>
                      <span className="text-[11px] text-purple-600 font-medium mt-1 inline-block">10m ago</span>
                    </div>
                  </div>
                  <div 
                    onClick={() => {
                      navigate('watch', 'one-piece', 1123);
                      setNotifOpen(false);
                    }}
                    className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex gap-3 items-start transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">New One Piece Episode 1123 added</p>
                      <p className="text-xs text-slate-500 mt-0.5">Clash in Egghead reaches peak intensity.</p>
                      <span className="text-[11px] text-slate-400 font-medium mt-1 inline-block">2h ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Auth Section */}
          {currentUser ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full hover:bg-slate-100/80 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
              >
                <img
                  src={user.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500/20"
                />
                <span className="hidden sm:inline text-sm font-semibold text-slate-800">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                      <span className={`inline-block mt-1 text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                        isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {isAdmin ? 'Administrator' : 'Standard User'}
                      </span>
                    </div>
                  </div>

                  <div className="p-1.5 space-y-0.5">
                    <button
                      onClick={() => {
                        navigate('profile');
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-purple-500" />
                      <span>User Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('profile');
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors cursor-pointer"
                    >
                      <Heart className="w-4 h-4 text-pink-500" />
                      <span>My List ({user.myList.length})</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('profile');
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-colors cursor-pointer"
                    >
                      <Clock className="w-4 h-4 text-indigo-500" />
                      <span>Watch History</span>
                    </button>

                    {/* ONLY expose Admin Dashboard if role === 'admin' */}
                    {isAdmin && (
                      <>
                        <div className="my-1 border-t border-slate-100" />
                        <button
                          onClick={() => {
                            navigate('admin');
                            setProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
                        >
                          <Shield className="w-4 h-4 text-purple-600" />
                          <span>Admin Dashboard</span>
                        </button>
                      </>
                    )}

                    <div className="my-1 border-t border-slate-100" />
                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('login')}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-purple-600 bg-slate-100 hover:bg-purple-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 px-3 py-2 bg-white text-xs font-semibold text-slate-600">
        {navLinks.map(link => (
          <button
            key={link.label}
            onClick={() => navigate(link.view)}
            className={`px-2 py-1 rounded-md ${
              currentView === link.view ? 'text-purple-600 font-bold bg-purple-50' : 'hover:text-slate-900'
            }`}
          >
            {link.label}
          </button>
        ))}
        {currentUser ? (
          <button
            onClick={() => navigate('profile')}
            className={`px-2 py-1 rounded-md ${
              currentView === 'profile' ? 'text-purple-600 font-bold bg-purple-50' : 'hover:text-slate-900'
            }`}
          >
            Profile
          </button>
        ) : (
          <button
            onClick={() => navigate('login')}
            className="px-2 py-1 rounded-md text-purple-600 font-bold"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};
