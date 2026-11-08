import React, { useState, useEffect } from 'react';
import { Play, Plus, Check, Star, Calendar, Tv, ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HeroBanner: React.FC = () => {
  const { animeList, navigate, toggleMyList, isInMyList } = useApp();
  
  // Featured hero items: Naruto, Demon Slayer, Jujutsu Kaisen, Solo Leveling
  const heroAnimeList = animeList.filter(a => a.featured || (a.trendingRank && a.trendingRank <= 5));
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate banner every 7 seconds
  useEffect(() => {
    if (heroAnimeList.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % heroAnimeList.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroAnimeList.length]);

  if (heroAnimeList.length === 0) return null;

  const current = heroAnimeList[currentIndex];
  const isFav = isInMyList(current.id);

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + heroAnimeList.length) % heroAnimeList.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % heroAnimeList.length);
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-xl border border-slate-200/80 min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] flex items-center">
        
        {/* Colorful Anime Banner Image */}
        <div className="absolute inset-0">
          <img
            src={current.banner || current.poster}
            alt={current.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center lg:object-right transition-all duration-700 ease-out"
          />
          {/* Measured soft gradient overlay for text readability without darkening the whole visual */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent w-full md:w-3/4 lg:w-3/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent md:hidden" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-2xl">
          
          {/* Trending Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/90 border border-purple-200 text-purple-700 text-xs font-bold mb-4 shadow-xs">
            <Flame className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            <span>#{current.trendingRank || 1} Trending Worldwide</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight font-display">
            {current.title}
          </h1>
          <p className="text-sm font-semibold text-purple-600 mt-1">
            {current.japaneseTitle}
          </p>

          {/* Metadata badges / tags */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-xs sm:text-sm font-semibold text-slate-600">
            <span className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200/60">
              <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
              {current.rating} Rating
            </span>
            <span className="flex items-center gap-1 bg-slate-100/90 px-2.5 py-0.5 rounded-lg border border-slate-200/60">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {current.year}
            </span>
            <span className="flex items-center gap-1 bg-slate-100/90 px-2.5 py-0.5 rounded-lg border border-slate-200/60">
              <Tv className="w-3.5 h-3.5 text-slate-500" />
              {current.episodesCount} Episodes
            </span>
            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-lg border border-emerald-200/60">
              {current.status}
            </span>
          </div>

          {/* Synopsis */}
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-4 line-clamp-3 max-w-xl">
            {current.synopsis}
          </p>

          {/* Genre chips */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {current.genres.map(genre => (
              <span
                key={genre}
                className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 mt-6 sm:mt-8">
            <button
              onClick={() => navigate('watch', current.id, current.episodes[0]?.number || 1)}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/35 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Watch Now</span>
            </button>

            <button
              onClick={() => toggleMyList(current.id)}
              className={`px-5 py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 border transition-all cursor-pointer ${
                isFav
                  ? 'bg-pink-50 text-pink-600 border-pink-200'
                  : 'bg-white/90 backdrop-blur-md text-slate-700 border-slate-200/80 hover:bg-white hover:border-purple-200'
              }`}
            >
              {isFav ? (
                <>
                  <Check className="w-5 h-5 text-pink-600" />
                  <span>In My List</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 text-slate-600" />
                  <span>Add to My List</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Carousel Arrow Controls */}
        <div className="absolute bottom-6 right-6 hidden sm:flex items-center gap-2 z-20">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/80 text-slate-700 hover:bg-white hover:text-purple-600 shadow-sm flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Previous Anime"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/80 text-slate-700 hover:bg-white hover:text-purple-600 shadow-sm flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Next Anime"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Pagination Indicator Dots */}
        <div className="absolute bottom-4 left-6 sm:left-14 flex items-center gap-1.5 z-20">
          {heroAnimeList.map((anime, idx) => (
            <button
              key={anime.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'w-7 bg-purple-600'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};
