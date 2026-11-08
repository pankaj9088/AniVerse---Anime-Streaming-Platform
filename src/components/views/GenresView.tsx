import React, { useState } from 'react';
import { Compass, Sparkles, Film, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ALL_GENRES } from '../../data/animeData';
import { AnimeCard } from '../AnimeCard';

export const GenresView: React.FC = () => {
  const { animeList, navigate, setSelectedGenre } = useApp();
  const [activeGenre, setActiveGenre] = useState<string>('Action');

  const genreDescriptions: Record<string, string> = {
    Action: 'High-octane battles, martial arts duels, and pulse-pounding heroism.',
    Adventure: 'Expeditions to uncharted continents, perilous quests, and grand journeys.',
    Comedy: 'Laugh-out-loud antics, witty parodies, and lighthearted humor.',
    Drama: 'Emotionally poignant character journeys, dilemmas, and profound conflicts.',
    Fantasy: 'Spells, mythological beasts, ancient empires, and arcane arts.',
    Romance: 'Heartwarming sparks, heartfelt bonds, and unforgettable romance.',
    'Sci-Fi': 'Futuristic technologies, cyberpunk cities, mecha, and space exploration.',
    Horror: 'Chilling supernatural encounters, macabre perils, and eerie suspense.',
    Mystery: 'Mind-bending whodunits, detective deductions, and cryptic secrets.',
    'Slice of Life': 'Soothing everyday moments, cherished friendships, and cozy tales.',
    Sports: 'Athletic dedication, teamwork, tournaments, and triumphant victories.',
    Supernatural: 'Sorcerers, curses, phantoms, and paranormal powers beyond comprehension.',
    Isekai: 'Reincarnation or summoning into miraculous alternate realms and fantasy worlds.',
    Shounen: 'Dynamic growth, perseverance, friendship, and reaching the pinnacle.',
    School: 'Youthful academy life, student council rivalries, and after-school clubs.'
  };

  const matchingAnime = animeList.filter(a => a.genres.includes(activeGenre));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-3 border border-purple-200">
          <Compass className="w-3.5 h-3.5" />
          <span>Genre Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
          Explore Anime by Genre
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Dive deep into curated worlds, from legendary action sagas to heartwarming slice-of-life tales.
        </p>
      </div>

      {/* Genre Pills Carousel / Grid */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {ALL_GENRES.map(genre => {
          const count = animeList.filter(a => a.genres.includes(genre)).length;
          const isActive = activeGenre === genre;
          return (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25 scale-105'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-purple-50 hover:border-purple-200'
              }`}
            >
              <span>{genre}</span>
              <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Current Genre Spotlight Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900 font-display">
              {activeGenre} Anime
            </h2>
            <span className="text-xs bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-md border border-purple-200">
              {matchingAnime.length} Titles
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            {genreDescriptions[activeGenre] || 'Exciting anime titles featuring compelling stories and unforgettable characters.'}
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedGenre(activeGenre);
            navigate('anime');
          }}
          className="px-4 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <span>Open in Full Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Anime Grid for this genre */}
      {matchingAnime.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {matchingAnime.map(anime => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
          <Film className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No titles in {activeGenre} yet</h3>
          <p className="text-xs text-slate-500 mt-1">Check back soon as new seasonal simulcasts release!</p>
        </div>
      )}

    </div>
  );
};
