import React, { useState } from 'react';
import { Star, Heart, Play, Film } from 'lucide-react';
import { Anime } from '../types';
import { useApp } from '../context/AppContext';

interface AnimeCardProps {
  anime: Anime;
  rank?: number;
  layout?: 'grid' | 'list';
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, rank, layout = 'grid' }) => {
  const { navigate, toggleMyList, isInMyList } = useApp();
  const [imgError, setImgError] = useState(false);
  const isFav = isInMyList(anime.id);

  if (layout === 'list') {
    return (
      <div 
        onClick={() => navigate('details', anime.id)}
        className="group bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-purple-200 transition-all duration-300 flex items-center gap-4 cursor-pointer"
      >
        <div className="relative w-20 h-28 rounded-xl overflow-hidden shrink-0 bg-slate-100">
          {!imgError ? (
            <img
              src={anime.poster}
              alt={anime.title}
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600">
              <Film className="w-6 h-6" />
              <span className="text-[10px] font-bold mt-1 text-center px-1 truncate w-full">{anime.title}</span>
            </div>
          )}
          {rank && (
            <span className="absolute top-1.5 left-1.5 bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
              #{rank}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="flex items-center gap-1 font-bold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              {anime.rating}
            </span>
            <span>·</span>
            <span className="font-semibold text-slate-600">{anime.episodesCount} EP</span>
            <span>·</span>
            <span>{anime.year}</span>
            <span>·</span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
              anime.status === 'Ongoing' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
            }`}>
              {anime.status}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors truncate">
            {anime.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1">
            {anime.synopsis}
          </p>

          <div className="flex items-center gap-2 mt-2 text-xs text-purple-700 font-medium">
            {anime.genres.slice(0, 3).join(' • ')}
          </div>
        </div>

        <div className="flex items-center gap-2 pr-2 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMyList(anime.id);
            }}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              isFav 
                ? 'bg-pink-50 text-pink-500' 
                : 'bg-slate-100 text-slate-400 hover:text-pink-500 hover:bg-pink-50'
            }`}
            title={isFav ? 'Remove from My List' : 'Add to My List'}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-pink-500' : ''}`} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate('watch', anime.id, anime.episodes[0]?.number || 1);
            }}
            className="p-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-xs cursor-pointer"
            title="Watch now"
          >
            <Play className="w-4 h-4 fill-white" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate('details', anime.id)}
      className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-slate-100">
        {!imgError ? (
          <img
            src={anime.poster}
            alt={anime.title}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 text-purple-700 p-4 text-center">
            <Film className="w-10 h-10 mb-2 opacity-80" />
            <span className="font-bold text-sm">{anime.title}</span>
            <span className="text-xs text-purple-500 mt-1">{anime.studio}</span>
          </div>
        )}

        {/* Soft gradient bottom scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rank indicator if provided */}
        {rank && (
          <div className="absolute top-2.5 left-2.5 bg-purple-600 text-white text-xs font-extrabold px-2 py-0.5 rounded-lg shadow-md">
            #{rank}
          </div>
        )}

        {/* Status indicator */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMyList(anime.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer ${
              isFav 
                ? 'bg-white text-pink-500 scale-105' 
                : 'bg-white/80 backdrop-blur-xs text-slate-600 hover:text-pink-500 hover:bg-white'
            }`}
            title={isFav ? 'Remove from My List' : 'Add to My List'}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-pink-500' : ''}`} />
          </button>
        </div>

        {/* Play Overlay Button that appears on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 pointer-events-none">
          <div className="w-13 h-13 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/40">
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Card Info Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <h3 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors text-sm sm:text-base leading-tight truncate">
            {anime.title}
          </h3>

          <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
            <span className="flex items-center gap-1 font-bold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              {anime.rating}
            </span>
            <span className="font-semibold text-slate-600">
              {anime.episodesCount} EP
            </span>
          </div>
        </div>

        <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="truncate text-slate-600 font-medium">
            {anime.genres.slice(0, 2).join(' • ')}
          </span>
          <span className="shrink-0 text-slate-400 font-medium">
            {anime.year}
          </span>
        </div>
      </div>
    </div>
  );
};
