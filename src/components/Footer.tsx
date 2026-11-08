import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ALL_GENRES } from '../data/animeData';

export const Footer: React.FC = () => {
  const { navigate, setSelectedGenre } = useApp();

  return (
    <footer className="bg-white border-t border-slate-200/80 pt-12 pb-8 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-slate-100">
          
          {/* Brand Info */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 font-display">
                AniVerse
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-4">
              A bright, modern light-theme anime streaming platform. Stream your favorite seasonal simulcasts and classic masterpieces in crystal-clear high definition.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Streaming Servers Operational</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('home')} className="hover:text-purple-600 transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigate('anime')} className="hover:text-purple-600 transition-colors cursor-pointer">
                  All Anime
                </button>
              </li>
              <li>
                <button onClick={() => navigate('trending')} className="hover:text-purple-600 transition-colors cursor-pointer">
                  Trending Top 10
                </button>
              </li>
              <li>
                <button onClick={() => navigate('movies')} className="hover:text-purple-600 transition-colors cursor-pointer">
                  Anime Movies
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Genres */}
          <div>
            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Top Genres
            </h4>
            <ul className="space-y-2">
              {ALL_GENRES.slice(0, 4).map(genre => (
                <li key={genre}>
                  <button
                    onClick={() => {
                      setSelectedGenre(genre);
                      navigate('anime');
                    }}
                    className="hover:text-purple-600 transition-colors cursor-pointer"
                  >
                    {genre}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Account & Support */}
          <div>
            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Account & Support
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('profile')} className="hover:text-purple-600 transition-colors cursor-pointer">
                  My Profile
                </button>
              </li>
              <li>
                <button onClick={() => navigate('profile')} className="hover:text-purple-600 transition-colors cursor-pointer">
                  Saved My List
                </button>
              </li>
              <li>
                <button onClick={() => navigate('login')} className="hover:text-purple-600 transition-colors cursor-pointer">
                  User Login
                </button>
              </li>
              <li>
                <span className="text-slate-400">Terms & Privacy</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
          <p>© {new Date().getFullYear()} AniVerse Streaming Platform. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Crafted for anime fans with a</span>
            <span className="text-purple-600 font-bold">clean light theme</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
