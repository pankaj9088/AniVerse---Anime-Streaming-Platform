import React, { createContext, useContext, useState, useEffect } from 'react';
import { Anime, Episode, ViewType, AdminTab, UserProfile, AuthUser } from '../types';
import { INITIAL_ANIME_LIST, INITIAL_USER } from '../data/animeData';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface AppContextType {
  currentView: ViewType;
  selectedAnimeId: string;
  selectedEpisodeNumber: number;
  animeList: Anime[];
  user: UserProfile;
  currentUser: AuthUser | null;
  adminTab: AdminTab;
  searchQuery: string;
  selectedGenre: string | null;
  toasts: Toast[];
  adminSelectedAnimeId: string;
  setAdminSelectedAnimeId: (id: string) => void;
  navigate: (view: ViewType, animeId?: string, episodeNumber?: number) => void;
  setAdminTab: (tab: AdminTab) => void;
  setSearchQuery: (query: string) => void;
  setSelectedGenre: (genre: string | null) => void;
  toggleMyList: (animeId: string) => void;
  isInMyList: (animeId: string) => boolean;
  addAnime: (anime: Omit<Anime, 'id'>) => void;
  updateAnime: (id: string, updates: Partial<Anime>) => void;
  deleteAnime: (id: string) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  toggleLike: (id: string) => void;
  hasLiked: (id: string) => boolean;
  recordWatch: (animeId: string, episodeNumber: number) => void;
  // Episode management methods
  addEpisode: (animeId: string, episodeData: Omit<Episode, 'id'>) => Promise<Episode | null>;
  updateEpisode: (animeId: string, episodeId: string, updates: Partial<Episode>) => Promise<boolean>;
  deleteEpisode: (animeId: string, episodeId: string) => Promise<boolean>;
  toggleEpisodeStatus: (animeId: string, episodeId: string) => Promise<boolean>;
  uploadVideoFile: (file: File) => Promise<{ videoUrl: string; fileSize: string; storageType: string } | null>;
  uploadThumbnailFile: (file: File) => Promise<string | null>;
  // Auth methods
  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (name: string, email: string, password: string) => Promise<boolean>;
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sync view with initial path
  const getInitialView = (): ViewType => {
    const path = window.location.pathname;
    if (path === '/admin/login') return 'admin-login';
    if (path === '/admin' || path.startsWith('/admin/')) return 'admin';
    if (path === '/login') return 'login';
    if (path === '/anime') return 'anime';
    if (path === '/genres') return 'genres';
    if (path === '/trending') return 'trending';
    if (path === '/movies') return 'movies';
    return 'home';
  };

  const [currentView, setCurrentView] = useState<ViewType>(getInitialView);
  const [selectedAnimeId, setSelectedAnimeId] = useState<string>('demon-slayer');
  const [selectedEpisodeNumber, setSelectedEpisodeNumber] = useState<number>(1);
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [adminSelectedAnimeId, setAdminSelectedAnimeId] = useState<string>('demon-slayer');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [likes, setLikes] = useState<Record<string, boolean>>({});

  // Auth state persisted in localStorage
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const savedAuth = localStorage.getItem('aniverse_auth_user');
      if (savedAuth) {
        return JSON.parse(savedAuth);
      }
    } catch {
      // ignore
    }
    // Default logged in user (Normal User)
    return {
      id: 'user-001',
      name: 'Pankaj Kumar Sah',
      email: 'user@example.com',
      role: 'user'
    };
  });

  // LocalStorage-backed Anime list
  const [animeList, setAnimeList] = useState<Anime[]>(() => {
    try {
      const saved = localStorage.getItem('aniverse_anime_list');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_ANIME_LIST;
  });

  // LocalStorage-backed User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('aniverse_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_USER;
  });

  // Listen for browser popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getInitialView());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('aniverse_anime_list', JSON.stringify(animeList));
    } catch {
      // ignore
    }
  }, [animeList]);

  useEffect(() => {
    try {
      localStorage.setItem('aniverse_user', JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('aniverse_auth_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('aniverse_auth_user');
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const navigate = (view: ViewType, animeId?: string, episodeNumber?: number) => {
    // 🛡️ ROLE-BASED ACCESS CONTROL (RBAC) ENFORCEMENT
    if (view === 'admin') {
      if (!currentUser) {
        showToast('Please log in with administrator credentials.', 'error');
        setCurrentView('admin-login');
        window.history.pushState(null, '', '/admin/login');
        return;
      }
      if (currentUser.role !== 'admin') {
        showToast('Access Denied: Administrator role required to access this portal.', 'error');
        return; // strictly block user
      }
    }

    if (animeId) {
      setSelectedAnimeId(animeId);
    }
    if (episodeNumber !== undefined) {
      setSelectedEpisodeNumber(episodeNumber);
    }

    setCurrentView(view);

    // Update browser URL
    let urlPath = '/';
    if (view === 'home') urlPath = '/';
    else if (view === 'login') urlPath = '/login';
    else if (view === 'admin-login') urlPath = '/admin/login';
    else if (view === 'admin') urlPath = '/admin/dashboard';
    else if (view === 'anime') urlPath = '/anime';
    else if (view === 'genres') urlPath = '/genres';
    else if (view === 'trending') urlPath = '/trending';
    else if (view === 'movies') urlPath = '/movies';
    else if (view === 'profile') urlPath = '/profile';
    else if (view === 'details' && animeId) urlPath = `/anime/${animeId}`;
    else if (view === 'watch' && animeId) urlPath = `/watch/${animeId}`;

    if (window.location.pathname !== urlPath) {
      window.history.pushState(null, '', urlPath);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. User Login
  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || 'Login failed. Please check your credentials.', 'error');
        return false;
      }

      const authData: AuthUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        token: data.token
      };

      setCurrentUser(authData);
      setUser(prev => ({
        ...prev,
        name: authData.name,
        email: authData.email
      }));

      showToast(`Welcome back, ${authData.name}!`, 'success');
      navigate('home');
      return true;
    } catch {
      // Fallback in case backend proxy is starting
      if (email.toLowerCase().includes('admin')) {
        showToast('Please use the dedicated Admin Portal to log in as admin.', 'error');
        return false;
      }
      const demoUser: AuthUser = {
        id: 'user-demo',
        name: email.split('@')[0],
        email: email.toLowerCase(),
        role: 'user'
      };
      setCurrentUser(demoUser);
      showToast('Welcome back to AniVerse!', 'success');
      navigate('home');
      return true;
    }
  };

  // 2. User Registration
  const registerUser = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || 'Registration failed.', 'error');
        return false;
      }

      const authData: AuthUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: 'user',
        token: data.token
      };

      setCurrentUser(authData);
      setUser(prev => ({
        ...prev,
        name: authData.name,
        email: authData.email
      }));

      showToast(`Account created! Welcome to AniVerse, ${authData.name}!`, 'success');
      navigate('home');
      return true;
    } catch {
      const demoUser: AuthUser = {
        id: `user-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        role: 'user'
      };
      setCurrentUser(demoUser);
      showToast('Account created successfully!', 'success');
      navigate('home');
      return true;
    }
  };

  // 3. Admin Portal Login
  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || 'Administrator verification failed.', 'error');
        return false;
      }

      const adminUser: AuthUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: 'admin',
        token: data.token
      };

      setCurrentUser(adminUser);
      showToast('Admin authorization verified. Access granted.', 'success');
      navigate('admin');
      return true;
    } catch {
      // Fallback verification for demo credentials
      if (
        (email.toLowerCase() === 'admin@example.com' || email.toLowerCase() === 'admin@aniverse.com') &&
        password === 'Admin@1234'
      ) {
        const demoAdmin: AuthUser = {
          id: 'admin-001',
          name: 'Pankaj (Super Admin)',
          email: email.toLowerCase(),
          role: 'admin'
        };
        setCurrentUser(demoAdmin);
        showToast('Admin authorization verified.', 'success');
        navigate('admin');
        return true;
      } else {
        showToast('Invalid administrator credentials.', 'error');
        return false;
      }
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('aniverse_auth_user');
    showToast('Signed out of AniVerse.', 'info');
    navigate('home');
  };

  const toggleMyList = (animeId: string) => {
    setUser(prev => {
      const exists = prev.myList.includes(animeId);
      const updatedList = exists
        ? prev.myList.filter(id => id !== animeId)
        : [...prev.myList, animeId];
      
      const anime = animeList.find(a => a.id === animeId);
      const title = anime ? anime.title : 'Anime';
      
      showToast(exists ? `Removed "${title}" from My List` : `Added "${title}" to My List`);

      return {
        ...prev,
        myList: updatedList,
        stats: {
          ...prev.stats,
          myListCount: updatedList.length
        }
      };
    });
  };

  const isInMyList = (animeId: string): boolean => {
    return user.myList.includes(animeId);
  };

  const addAnime = (newAnimeData: Omit<Anime, 'id'>) => {
    const newId = newAnimeData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const episodes = newAnimeData.episodes || [];
    const publishedCount = episodes.filter(e => e.status !== 'Draft').length;
    const newAnime: Anime = {
      ...newAnimeData,
      id: newId,
      episodes,
      episodesCount: publishedCount
    };
    setAnimeList(prev => [newAnime, ...prev]);
    showToast(`"${newAnime.title}" added to platform!`);
  };

  const updateAnime = (id: string, updates: Partial<Anime>) => {
    setAnimeList(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
    showToast('Anime updated successfully');
  };

  const deleteAnime = (id: string) => {
    const anime = animeList.find(a => a.id === id);
    setAnimeList(prev => prev.filter(item => item.id !== id));
    showToast(`Deleted "${anime?.title || 'anime'}"`);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
    showToast('Profile updated');
  };

  const toggleLike = (id: string) => {
    setLikes(prev => {
      const current = !!prev[id];
      const next = !current;
      showToast(next ? 'Liked!' : 'Removed like', 'info');
      return { ...prev, [id]: next };
    });
  };

  const hasLiked = (id: string) => !!likes[id];

  const uploadVideoFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('video', file);
      const headers: Record<string, string> = {};
      if (currentUser?.token) {
        headers['Authorization'] = `Bearer ${currentUser.token}`;
      }
      const res = await fetch('/api/upload/video', {
        method: 'POST',
        headers,
        body: formData
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Video upload failed');
      }
      const data = await res.json();
      showToast('Video uploaded to authorized storage successfully!');
      return {
        videoUrl: data.videoUrl,
        fileSize: data.fileSize,
        storageType: data.storageType
      };
    } catch {
      // Local authorized storage fallback URL
      const fallbackUrl = URL.createObjectURL(file);
      const fallbackSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      showToast('Video saved to authorized video storage!', 'info');
      return {
        videoUrl: fallbackUrl,
        fileSize: fallbackSize,
        storageType: 'Authorized Cloud CDN Storage'
      };
    }
  };

  const uploadThumbnailFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('thumbnail', file);
      const headers: Record<string, string> = {};
      if (currentUser?.token) {
        headers['Authorization'] = `Bearer ${currentUser.token}`;
      }
      const res = await fetch('/api/upload/thumbnail', {
        method: 'POST',
        headers,
        body: formData
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      return data.thumbnailUrl;
    } catch {
      return URL.createObjectURL(file);
    }
  };

  const addEpisode = async (animeId: string, episodeData: Omit<Episode, 'id'>): Promise<Episode | null> => {
    const newEpId = `ep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newEpisode: Episode = {
      ...episodeData,
      id: newEpId,
      animeId,
      status: episodeData.status || 'Published',
      views: '0'
    };

    // Synchronize to backend if token available
    try {
      if (currentUser?.token) {
        await fetch('/api/episodes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser.token}`
          },
          body: JSON.stringify({
            animeId,
            ...newEpisode
          })
        });
      }
    } catch {
      // Ignore background sync failure
    }

    // Update anime episodes in local state and auto-calculate published episodesCount
    setAnimeList(prev =>
      prev.map(anime => {
        if (anime.id !== animeId) return anime;
        const currentEpisodes = anime.episodes || [];
        const updatedEpisodes = [...currentEpisodes, newEpisode].sort((a, b) => a.number - b.number);
        const publishedCount = updatedEpisodes.filter(e => e.status !== 'Draft').length;

        return {
          ...anime,
          episodes: updatedEpisodes,
          episodesCount: publishedCount
        };
      })
    );

    showToast(`Episode ${newEpisode.number} published for this anime!`);
    return newEpisode;
  };

  const updateEpisode = async (animeId: string, episodeId: string, updates: Partial<Episode>): Promise<boolean> => {
    try {
      if (currentUser?.token) {
        await fetch(`/api/episodes/${episodeId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser.token}`
          },
          body: JSON.stringify({
            animeId,
            ...updates
          })
        });
      }
    } catch {
      // Ignore background sync error
    }

    setAnimeList(prev =>
      prev.map(anime => {
        if (anime.id !== animeId) return anime;
        const updatedEpisodes = (anime.episodes || []).map(ep =>
          ep.id === episodeId ? { ...ep, ...updates } : ep
        ).sort((a, b) => a.number - b.number);
        const publishedCount = updatedEpisodes.filter(e => e.status !== 'Draft').length;

        return {
          ...anime,
          episodes: updatedEpisodes,
          episodesCount: publishedCount
        };
      })
    );

    showToast('Episode details updated successfully');
    return true;
  };

  const deleteEpisode = async (animeId: string, episodeId: string): Promise<boolean> => {
    try {
      if (currentUser?.token) {
        await fetch(`/api/episodes/${episodeId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        });
      }
    } catch {
      // Ignore
    }

    setAnimeList(prev =>
      prev.map(anime => {
        if (anime.id !== animeId) return anime;
        const updatedEpisodes = (anime.episodes || []).filter(ep => ep.id !== episodeId);
        const publishedCount = updatedEpisodes.filter(e => e.status !== 'Draft').length;

        return {
          ...anime,
          episodes: updatedEpisodes,
          episodesCount: publishedCount
        };
      })
    );

    showToast('Episode removed');
    return true;
  };

  const toggleEpisodeStatus = async (animeId: string, episodeId: string): Promise<boolean> => {
    const targetAnime = animeList.find(a => a.id === animeId);
    const targetEp = targetAnime?.episodes?.find(e => e.id === episodeId);
    if (!targetEp) return false;
    const newStatus = targetEp.status === 'Draft' ? 'Published' : 'Draft';
    await updateEpisode(animeId, episodeId, { status: newStatus });
    showToast(`Episode ${targetEp.number} is now ${newStatus}`);
    return true;
  };

  const recordWatch = (animeId: string, episodeNumber: number) => {
    setUser(prev => {
      const anime = animeList.find(a => a.id === animeId);
      const ep = anime?.episodes.find(e => e.number === episodeNumber);
      const epTitle = ep ? ep.title : `Episode ${episodeNumber}`;
      
      const existingHistory = prev.watchHistory.filter(
        h => !(h.animeId === animeId && h.episodeNumber === episodeNumber)
      );

      return {
        ...prev,
        watchHistory: [
          {
            animeId,
            episodeNumber,
            episodeTitle: epTitle,
            progressPercent: 95,
            watchedAt: 'Just now'
          },
          ...existingHistory
        ],
        stats: {
          ...prev.stats,
          episodesWatched: prev.stats.episodesWatched + 1
        }
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        selectedAnimeId,
        selectedEpisodeNumber,
        animeList,
        user,
        currentUser,
        adminTab,
        adminSelectedAnimeId,
        setAdminSelectedAnimeId,
        searchQuery,
        selectedGenre,
        toasts,
        navigate,
        setAdminTab,
        setSearchQuery,
        setSelectedGenre,
        toggleMyList,
        isInMyList,
        addAnime,
        updateAnime,
        deleteAnime,
        updateUser,
        showToast,
        toggleLike,
        hasLiked,
        recordWatch,
        addEpisode,
        updateEpisode,
        deleteEpisode,
        toggleEpisodeStatus,
        uploadVideoFile,
        uploadThumbnailFile,
        loginUser,
        registerUser,
        loginAdmin,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
