import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  RotateCw, 
  Settings, 
  Heart, 
  ThumbsUp, 
  Share2, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Clock, 
  Sparkles,
  MessageSquare,
  Send,
  Tv
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AnimeCard } from '../AnimeCard';

export const WatchView: React.FC = () => {
  const { 
    animeList, 
    selectedAnimeId, 
    selectedEpisodeNumber, 
    currentUser,
    navigate, 
    toggleMyList, 
    isInMyList, 
    showToast,
    toggleLike,
    hasLiked,
    recordWatch
  } = useApp();

  const isAdmin = currentUser?.role === 'admin';
  const anime = animeList.find(a => a.id === selectedAnimeId) || animeList[0];
  const episodes = anime.episodes || [];
  const playableEpisodes = episodes.filter(e => isAdmin || e.status !== 'Draft');
  const currentEpisode = playableEpisodes.find(e => e.number === selectedEpisodeNumber) || playableEpisodes[0] || episodes[0] || {
    id: 'default',
    number: selectedEpisodeNumber || 1,
    title: `Episode ${selectedEpisodeNumber || 1}`,
    duration: '24:10',
    airDate: 'Recently',
    thumbnail: anime.poster,
    synopsis: anime.synopsis,
    views: '1.2M',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Video player interactive state
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1450);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [quality, setQuality] = useState('1080p');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [audioTrack, setAudioTrack] = useState<'sub' | 'dub'>('sub');
  const [autoNext, setAutoNext] = useState(true);
  const [comments, setComments] = useState<{ id: string; user: string; text: string; time: string }[]>([
    {
      id: 'c1',
      user: 'Ren Amamiya',
      text: 'The animation in this episode is peak! The breathing technique visualization is flawless.',
      time: '15m ago'
    },
    {
      id: 'c2',
      user: 'Sakura Haruno',
      text: 'Every rewatch gives me chills. The music score just fits so perfectly.',
      time: '1h ago'
    }
  ]);
  const [newComment, setNewComment] = useState('');

  const isFav = isInMyList(anime.id);
  const liked = hasLiked(`${anime.id}-${currentEpisode.number}`);
  const [likeCount, setLikeCount] = useState(1420);

  // Record watch history
  useEffect(() => {
    recordWatch(anime.id, currentEpisode.number);
  }, [anime.id, currentEpisode.number]);

  // Video load & autoplay on episode change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.playbackRate = playbackSpeed;
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  }, [currentEpisode.id, currentEpisode.videoUrl]);

  // Sync volume and speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (autoNext) {
      handleNextEpisode();
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handlePrevEpisode = () => {
    const currentIdx = playableEpisodes.findIndex(e => e.number === currentEpisode.number);
    if (currentIdx > 0) {
      navigate('watch', anime.id, playableEpisodes[currentIdx - 1].number);
    } else {
      showToast('This is the first episode');
    }
  };

  const handleNextEpisode = () => {
    const currentIdx = playableEpisodes.findIndex(e => e.number === currentEpisode.number);
    if (currentIdx < playableEpisodes.length - 1) {
      navigate('watch', anime.id, playableEpisodes[currentIdx + 1].number);
    } else {
      showToast('You have reached the latest episode');
    }
  };

  const handleLikeClick = () => {
    toggleLike(`${anime.id}-${currentEpisode.number}`);
    setLikeCount(prev => (liked ? prev - 1 : prev + 1));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Episode link copied to clipboard!');
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments(prev => [
      {
        id: Math.random().toString(),
        user: 'Pankaj Kumar Sah',
        text: newComment.trim(),
        time: 'Just now'
      },
      ...prev
    ]);
    setNewComment('');
    showToast('Comment posted!');
  };

  const relatedAnime = animeList.filter(a => a.id !== anime.id).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F7F7FB] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-4">
          <button onClick={() => navigate('home')} className="hover:text-purple-600 transition-colors">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigate('details', anime.id)} className="hover:text-purple-600 transition-colors">
            {anime.title}
          </button>
          <span>/</span>
          <span className="text-purple-700 font-bold">Episode {currentEpisode.number}</span>
        </div>

        {/* Video Player + Episodes Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Video Stream Container (2 cols on large screen) */}
          <div className="lg:col-span-2">
            
            {/* The Video Player Canvas with Real HTML5 Video */}
            <div 
              ref={playerContainerRef}
              className="relative aspect-16/9 bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-900 group select-none flex items-center justify-center"
            >
              
              {/* Actual HTML5 Video Element */}
              <video
                ref={videoRef}
                src={currentEpisode.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                poster={currentEpisode.thumbnail || anime.banner || anime.poster}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleVideoEnded}
                onClick={togglePlayPause}
                playsInline
                className="w-full h-full object-contain cursor-pointer"
              />

              {/* Dynamic Anime Watermark */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
                <span className="text-xs font-bold text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 shadow-sm">
                  AniVerse HD · {quality}
                </span>
                <span className="text-xs font-bold text-purple-200 bg-purple-900/80 backdrop-blur-md px-2 py-1 rounded-md border border-purple-500/30">
                  {audioTrack === 'sub' ? 'SUB' : 'DUB'}
                </span>
                {currentEpisode.videoStorageType && (
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 backdrop-blur-md px-2 py-1 rounded-md border border-emerald-500/30 hidden sm:inline-block">
                    Storage: Authorized CDN
                  </span>
                )}
              </div>

              {/* Center Play Indicator on pause */}
              {!isPlaying && (
                <div 
                  onClick={togglePlayPause}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30 backdrop-blur-[1px] transition-all"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-600/95 text-white flex items-center justify-center shadow-xl shadow-purple-600/50 transform scale-100 hover:scale-105 transition-all">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white ml-1" />
                  </div>
                </div>
              )}

              {/* Video Player Bottom Controls Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-4 sm:p-5 flex flex-col gap-2 transition-opacity duration-300 opacity-95 group-hover:opacity-100 z-30">
                
                {/* Timeline Scrubber */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono font-bold text-slate-300 tabular-nums">
                    {formatTime(currentTime)}
                  </span>
                  
                  <div className="relative flex-1 flex items-center">
                    <input
                      type="range"
                      min={0}
                      max={duration || 100}
                      step={0.5}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:h-2 transition-all"
                    />
                  </div>

                  <span className="text-[11px] font-mono font-bold text-slate-400 tabular-nums">
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Control Actions Bar */}
                <div className="flex items-center justify-between mt-1 text-white">
                  
                  {/* Left Controls: Play, Skip, Volume */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <button
                      onClick={togglePlayPause}
                      className="text-white hover:text-purple-400 transition-colors p-1 cursor-pointer"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>

                    <button
                      onClick={() => {
                        const newTime = Math.max(0, currentTime - 10);
                        setCurrentTime(newTime);
                        if (videoRef.current) videoRef.current.currentTime = newTime;
                      }}
                      className="text-slate-300 hover:text-white transition-colors p-1 cursor-pointer"
                      title="Rewind 10 seconds"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        const newTime = Math.min(duration, currentTime + 10);
                        setCurrentTime(newTime);
                        if (videoRef.current) videoRef.current.currentTime = newTime;
                      }}
                      className="text-slate-300 hover:text-white transition-colors p-1 cursor-pointer"
                      title="Forward 10 seconds"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>

                    {/* Volume */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="text-slate-300 hover:text-white transition-colors p-1 cursor-pointer"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-4 h-4 text-pink-400" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={isMuted ? 0 : volume}
                        onChange={e => {
                          setVolume(parseFloat(e.target.value));
                          setIsMuted(false);
                        }}
                        className="w-14 sm:w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                    </div>
                  </div>

                  {/* Right Controls: Audio track, Quality, Speed, Fullscreen */}
                  <div className="flex items-center gap-3 text-xs">
                    
                    {/* Sub / Dub toggle */}
                    <button
                      onClick={() => setAudioTrack(prev => (prev === 'sub' ? 'dub' : 'sub'))}
                      className="hidden sm:inline-block px-2 py-0.5 rounded-md font-bold text-[11px] bg-slate-800 text-purple-300 border border-slate-700 hover:bg-slate-700 cursor-pointer"
                    >
                      {audioTrack === 'sub' ? 'Audio: JP (Sub)' : 'Audio: EN (Dub)'}
                    </button>

                    {/* Quality Selector */}
                    <select
                      value={quality}
                      onChange={e => setQuality(e.target.value)}
                      className="bg-slate-800 text-white border border-slate-700 text-xs rounded-md px-1.5 py-0.5 cursor-pointer focus:outline-hidden"
                    >
                      <option value="1080p">1080p</option>
                      <option value="720p">720p</option>
                      <option value="480p">480p</option>
                      <option value="Auto">Auto</option>
                    </select>

                    {/* Speed Selector */}
                    <select
                      value={playbackSpeed}
                      onChange={e => setPlaybackSpeed(parseFloat(e.target.value))}
                      className="hidden sm:inline-block bg-slate-800 text-white border border-slate-700 text-xs rounded-md px-1.5 py-0.5 cursor-pointer focus:outline-hidden"
                    >
                      <option value={0.5}>0.5x</option>
                      <option value={1}>1.0x</option>
                      <option value={1.25}>1.25x</option>
                      <option value={1.5}>1.5x</option>
                      <option value={2}>2.0x</option>
                    </select>

                    <button
                      onClick={() => {
                        const target = playerContainerRef.current || document.documentElement;
                        if (!document.fullscreenElement) {
                          target.requestFullscreen?.().catch(() => {});
                        } else {
                          document.exitFullscreen?.().catch(() => {});
                        }
                      }}
                      className="text-slate-300 hover:text-white p-1 cursor-pointer"
                      title="Toggle Fullscreen"
                    >
                      <Maximize className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>

            </div>

            {/* Previous / Next Episode Navigation Row */}
            <div className="flex items-center justify-between mt-4 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
              <button
                onClick={handlePrevEpisode}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Episode</span>
              </button>

              <label className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoNext}
                  onChange={e => setAutoNext(e.target.checked)}
                  className="rounded-sm text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
                />
                <span>Auto-play Next</span>
              </label>

              <button
                onClick={handleNextEpisode}
                className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
              >
                <span>Next Episode</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Video Metadata / Information Card */}
            <div className="mt-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
              
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                    {anime.title} - Episode {currentEpisode.number}
                  </h1>
                  <h2 className="text-sm sm:text-base font-semibold text-purple-700 mt-0.5">
                    {currentEpisode.title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 font-medium">
                    <span>{currentEpisode.airDate}</span>
                    <span>·</span>
                    <span>{currentEpisode.views || '1.2M'} views</span>
                    <span>·</span>
                    <span className="text-emerald-600 font-bold">1080p Full HD</span>
                  </div>
                </div>

                {/* Interactive Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLikeClick}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      liked
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${liked ? 'fill-purple-600' : ''}`} />
                    <span>{likeCount}</span>
                  </button>

                  <button
                    onClick={() => toggleMyList(anime.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      isFav
                        ? 'bg-pink-50 text-pink-600 border-pink-200'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-pink-600' : ''}`} />
                    <span>{isFav ? 'In List' : 'Add to List'}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-2 rounded-xl text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Share Episode"
                  >
                    <Share2 className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Episode Synopsis */}
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Episode Synopsis
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {currentEpisode.synopsis}
                </p>
              </div>

            </div>

            {/* Comments Thread Section */}
            <div className="mt-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <h3 className="font-extrabold text-slate-900 text-base font-display">
                  Discussion & Comments ({comments.length})
                </h3>
              </div>

              {/* Post comment box */}
              <form onSubmit={handleAddComment} className="flex gap-2 mb-6">
                <input
                  type="text"
                  placeholder="Share your thoughts about this episode..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-hidden focus:border-purple-500 focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Post</span>
                </button>
              </form>

              {/* Comments list */}
              <div className="space-y-3">
                {comments.map(c => (
                  <div key={c.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {c.user[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{c.user}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{c.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: "All Episodes" Selector List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs sticky top-22">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <Tv className="w-4 h-4 text-purple-600" />
                  <h3 className="font-extrabold text-slate-900 text-base font-display">
                    All Episodes
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                  {playableEpisodes.length} Episodes
                </span>
              </div>

              {/* Numbered Quick Button Pills (from user mockup: [01] [02] [03]...) */}
              <div className="flex flex-wrap gap-1.5 mb-4 pb-3 border-b border-slate-100">
                {playableEpisodes.map(ep => {
                  const isActive = ep.number === currentEpisode.number;
                  return (
                    <button
                      key={ep.id}
                      onClick={() => navigate('watch', anime.id, ep.number)}
                      className={`w-9 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-600'
                      }`}
                    >
                      {ep.number < 10 ? `0${ep.number}` : ep.number}
                    </button>
                  );
                })}
              </div>

              {/* Detailed Episode Rows List */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {playableEpisodes.map(ep => {
                  const isCurrent = ep.number === currentEpisode.number;
                  return (
                    <div
                      key={ep.id}
                      onClick={() => navigate('watch', anime.id, ep.number)}
                      className={`group p-2.5 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                        isCurrent
                          ? 'bg-purple-50/90 border-purple-300 text-purple-900 shadow-2xs'
                          : 'bg-white border-slate-100 hover:border-purple-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="relative w-16 aspect-16/9 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={ep.thumbnail || anime.poster}
                          alt={ep.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        {isCurrent && (
                          <div className="absolute inset-0 bg-purple-600/40 flex items-center justify-center">
                            <Play className="w-3.5 h-3.5 fill-white text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[11px] font-bold ${isCurrent ? 'text-purple-700' : 'text-slate-500'}`}>
                            EP {ep.number}
                          </span>
                          <span className="text-[10px] text-slate-400">· {ep.duration}</span>
                          {ep.status === 'Draft' && (
                            <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1 rounded-sm">
                              Draft
                            </span>
                          )}
                        </div>
                        <h4 className={`text-xs font-bold truncate mt-0.5 ${
                          isCurrent ? 'text-purple-900' : 'text-slate-800 group-hover:text-purple-600'
                        }`}>
                          {ep.title}
                        </h4>
                      </div>

                      {isCurrent && (
                        <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Related Anime Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h2 className="text-xl font-extrabold text-slate-900 font-display">
                Related Anime
              </h2>
            </div>
            <button
              onClick={() => navigate('anime')}
              className="text-xs font-bold text-purple-600 hover:text-purple-700"
            >
              View All →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {relatedAnime.map(rel => (
              <AnimeCard key={rel.id} anime={rel} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
