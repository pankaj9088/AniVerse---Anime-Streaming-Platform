import React from 'react';
import { 
  Flame, 
  Tv, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  Play, 
  Heart,
  Star,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HeroBanner } from '../HeroBanner';
import { AnimeCard } from '../AnimeCard';
import { ALL_GENRES } from '../../data/animeData';

export const HomeView: React.FC = () => {
  const { 
    animeList, 
    navigate, 
    setSelectedGenre, 
    toggleMyList, 
    isInMyList 
  } = useApp();

  // Trending section (top 6 anime)
  const trendingAnime = [...animeList]
    .sort((a, b) => (a.trendingRank || 99) - (b.trendingRank || 99))
    .slice(0, 6);

  // Latest episodes items: simulated fresh drops
  const latestEpisodes = [
    {
      animeId: 'one-piece',
      title: 'One Piece',
      episodeNumber: 1123,
      episodeTitle: 'The Drums of Liberation: Clash in Egghead',
      timeAgo: '2 hours ago',
      thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
      duration: '23:45'
    },
    {
      animeId: 'demon-slayer',
      title: 'Demon Slayer',
      episodeNumber: 5,
      episodeTitle: 'My Own Steel',
      timeAgo: '1 day ago',
      thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
      duration: '24:15'
    },
    {
      animeId: 'jujutsu-kaisen',
      title: 'Jujutsu Kaisen',
      episodeNumber: 21,
      episodeTitle: 'Jujutsu Koshien',
      timeAgo: '2 days ago',
      thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
      duration: '23:55'
    },
    {
      animeId: 'solo-leveling',
      title: 'Solo Leveling',
      episodeNumber: 2,
      episodeTitle: 'If I Had One More Chance',
      timeAgo: '3 days ago',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      duration: '23:40'
    }
  ];

  // Popular Anime
  const popularAnime = [...animeList]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  // Recommended Anime
  const recommendedAnime = [...animeList]
    .filter(a => a.rating >= 8.5)
    .slice(3, 9);

  return (
    <div className="min-h-screen">
      
      {/* 1. Hero Carousel */}
      <HeroBanner />

      {/* 2. Trending Anime (White Background) */}
      <section className="bg-white py-12 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Flame className="w-4 h-4 fill-orange-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                Trending Anime
              </h2>
            </div>
            <button
              onClick={() => navigate('trending')}
              className="text-sm font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 group cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {trendingAnime.map(anime => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Latest Episodes (Very Light Lavender Background) */}
      <section className="bg-[#FAF5FF] py-12 border-b border-purple-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-200/70 text-purple-700 flex items-center justify-center">
                <Tv className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                Latest Episodes
              </h2>
            </div>
            <button
              onClick={() => navigate('anime')}
              className="text-sm font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 group cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {latestEpisodes.map(ep => {
              const isFav = isInMyList(ep.animeId);
              return (
                <div
                  key={`${ep.animeId}-${ep.episodeNumber}`}
                  onClick={() => navigate('watch', ep.animeId, ep.episodeNumber)}
                  className="group bg-white rounded-2xl p-3 border border-purple-100/90 shadow-xs hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col cursor-pointer"
                >
                  <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={ep.thumbnail}
                      alt={ep.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                    
                    <span className="absolute bottom-2 left-2 text-[11px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ep.duration}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMyList(ep.animeId);
                      }}
                      className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-xs transition-colors cursor-pointer ${
                        isFav ? 'bg-white text-pink-500' : 'bg-white/80 text-slate-600 hover:text-pink-500 hover:bg-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-pink-500' : ''}`} />
                    </button>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/50">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-purple-600 transition-colors truncate">
                        {ep.title}
                      </h4>
                      <p className="text-xs text-purple-700 font-semibold mt-0.5">
                        Episode {ep.episodeNumber}
                      </p>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 shrink-0 mt-0.5">
                      {ep.timeAgo}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Popular Anime (White Background) */}
      <section className="bg-white py-12 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                  Popular Anime
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Critically acclaimed and fan favorites</p>
              </div>
            </div>
            <button
              onClick={() => navigate('anime')}
              className="text-sm font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 group cursor-pointer"
            >
              <span>Explore All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {popularAnime.map((anime, index) => (
              <AnimeCard key={anime.id} anime={anime} rank={index + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Recommended For You (Very Light Blue Background) */}
      <section className="bg-[#F0F7FF] py-12 border-b border-blue-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                  Recommended For You
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Curated based on your streaming activity</p>
              </div>
            </div>
            <button
              onClick={() => navigate('anime')}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group cursor-pointer"
            >
              <span>More Recommendations</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {recommendedAnime.map(anime => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Explore Genres (Soft Pastel Background) */}
      <section className="bg-[#F8F7FF] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                  Explore Genres
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Find titles tailored to your exact taste</p>
              </div>
            </div>
            <button
              onClick={() => navigate('genres')}
              className="text-sm font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 group cursor-pointer"
            >
              <span>All Genres</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {ALL_GENRES.slice(0, 10).map((genre, idx) => {
              const count = animeList.filter(a => a.genres.includes(genre)).length;
              const pastelColors = [
                'bg-purple-50 hover:bg-purple-100/80 border-purple-200/80 text-purple-800',
                'bg-blue-50 hover:bg-blue-100/80 border-blue-200/80 text-blue-800',
                'bg-pink-50 hover:bg-pink-100/80 border-pink-200/80 text-pink-800',
                'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200/80 text-emerald-800',
                'bg-amber-50 hover:bg-amber-100/80 border-amber-200/80 text-amber-800',
              ];
              const color = pastelColors[idx % pastelColors.length];

              return (
                <button
                  key={genre}
                  onClick={() => {
                    setSelectedGenre(genre);
                    navigate('anime');
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${color}`}
                >
                  <div className="font-extrabold text-base">{genre}</div>
                  <div className="text-xs opacity-75 mt-1 font-medium">{count || 12} Series Available</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};
