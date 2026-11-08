export interface Episode {
  id: string;
  number: number;
  title: string;
  duration: string;
  airDate: string;
  thumbnail: string;
  synopsis: string;
  videoUrl?: string;
  views?: string;
  status?: 'Published' | 'Draft';
  animeId?: string;
  fileSize?: string;
  videoStorageType?: string;
}

export interface AnimeReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  likes: number;
}

export interface Anime {
  id: string;
  title: string;
  japaneseTitle: string;
  synopsis: string;
  poster: string;
  banner: string;
  rating: number;
  year: number;
  episodesCount: number;
  status: 'Ongoing' | 'Completed' | 'Upcoming';
  genres: string[];
  studio: string;
  type: 'TV' | 'Movie' | 'OVA';
  trendingRank?: number;
  popularityRank?: number;
  featured?: boolean;
  episodes: Episode[];
  reviews?: AnimeReview[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  token?: string;
}

export type ViewType = 
  | 'home'
  | 'login'
  | 'admin-login'
  | 'anime'
  | 'genres'
  | 'trending'
  | 'movies'
  | 'details'
  | 'watch'
  | 'profile'
  | 'admin';

export type AdminTab = 
  | 'dashboard'
  | 'anime'
  | 'add-anime'
  | 'episodes'
  | 'users'
  | 'analytics'
  | 'settings';

export interface WatchHistoryItem {
  animeId: string;
  episodeNumber: number;
  episodeTitle: string;
  progressPercent: number;
  watchedAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  myList: string[]; // anime IDs
  watchHistory: WatchHistoryItem[];
  stats: {
    myListCount: number;
    episodesWatched: number;
    hoursWatched: number;
  };
}

export interface FilterState {
  searchQuery: string;
  genres: string[];
  yearFrom: string;
  yearTo: string;
  status: string;
  sortBy: 'popularity' | 'rating' | 'latest' | 'title';
  type: string;
}
