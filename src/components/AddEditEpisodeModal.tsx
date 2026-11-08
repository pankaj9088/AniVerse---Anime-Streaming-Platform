import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  Tv, 
  Film, 
  Check, 
  Clock, 
  Calendar, 
  FileVideo, 
  Image as ImageIcon, 
  Play, 
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Anime, Episode } from '../types';

interface AddEditEpisodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedAnimeId?: string;
  initialEpisode?: Episode | null;
}

export const AddEditEpisodeModal: React.FC<AddEditEpisodeModalProps> = ({
  isOpen,
  onClose,
  preselectedAnimeId,
  initialEpisode
}) => {
  const { 
    animeList, 
    addEpisode, 
    updateEpisode, 
    uploadVideoFile, 
    uploadThumbnailFile,
    showToast 
  } = useApp();

  const [animeId, setAnimeId] = useState<string>(preselectedAnimeId || animeList[0]?.id || '');
  const [episodeNumber, setEpisodeNumber] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [duration, setDuration] = useState('24:10');
  const [airDate, setAirDate] = useState('');
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published');
  
  // Video and thumbnail upload states
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [storageType, setStorageType] = useState('Authorized Cloud CDN Storage');
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [videoFileName, setVideoFileName] = useState('');
  const [thumbFileName, setThumbFileName] = useState('');

  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const thumbFileInputRef = useRef<HTMLInputElement>(null);

  // Selected anime helper
  const selectedAnime = animeList.find(a => a.id === animeId);

  // When anime or initialEpisode changes, calculate default values
  useEffect(() => {
    if (initialEpisode) {
      setAnimeId(initialEpisode.animeId || preselectedAnimeId || animeList[0]?.id || '');
      setEpisodeNumber(initialEpisode.number);
      setTitle(initialEpisode.title);
      setSynopsis(initialEpisode.synopsis);
      setDuration(initialEpisode.duration);
      setAirDate(initialEpisode.airDate);
      setStatus(initialEpisode.status || 'Published');
      setVideoUrl(initialEpisode.videoUrl || '');
      setThumbnailUrl(initialEpisode.thumbnail || '');
      setFileSize(initialEpisode.fileSize || '42.5 MB');
      setStorageType(initialEpisode.videoStorageType || 'Authorized Cloud CDN Storage');
      setVideoFileName('');
      setThumbFileName('');
    } else {
      const targetAnime = animeList.find(a => a.id === (preselectedAnimeId || animeId)) || animeList[0];
      const existingEps = targetAnime?.episodes || [];
      const nextNum = existingEps.length > 0 ? Math.max(...existingEps.map(e => e.number)) + 1 : 1;
      
      setAnimeId(targetAnime?.id || '');
      setEpisodeNumber(nextNum);
      setTitle(`Episode ${nextNum}`);
      setSynopsis(`Exciting developments unfold as ${targetAnime?.title || 'the heroes'} confront new challenges.`);
      setDuration('24:10');
      setAirDate(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
      setStatus('Published');
      setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
      setThumbnailUrl(targetAnime?.poster || '');
      setFileSize('48.2 MB');
      setStorageType('Authorized Cloud CDN Storage');
      setVideoFileName('');
      setThumbFileName('');
    }
  }, [initialEpisode, preselectedAnimeId, isOpen, animeList]);

  // When user switches anime from dropdown in Add mode, auto-calculate the next episode number
  const handleAnimeChange = (newAnimeId: string) => {
    setAnimeId(newAnimeId);
    if (!initialEpisode) {
      const target = animeList.find(a => a.id === newAnimeId);
      const eps = target?.episodes || [];
      const nextNum = eps.length > 0 ? Math.max(...eps.map(e => e.number)) + 1 : 1;
      setEpisodeNumber(nextNum);
      setTitle(`Episode ${nextNum}`);
      if (target?.poster && !thumbnailUrl) {
        setThumbnailUrl(target.poster);
      }
    }
  };

  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    setVideoFileName(file.name);
    try {
      const result = await uploadVideoFile(file);
      if (result) {
        setVideoUrl(result.videoUrl);
        setFileSize(result.fileSize);
        setStorageType(result.storageType);
      }
    } catch {
      showToast('Video upload error', 'error');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleThumbFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumb(true);
    setThumbFileName(file.name);
    try {
      const uploadedUrl = await uploadThumbnailFile(file);
      if (uploadedUrl) {
        setThumbnailUrl(uploadedUrl);
      }
    } catch {
      showToast('Thumbnail upload error', 'error');
    } finally {
      setUploadingThumb(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!animeId) {
      showToast('Please select an anime for this episode.', 'error');
      return;
    }
    if (!title.trim()) {
      showToast('Please enter an episode title.', 'error');
      return;
    }

    const payload = {
      animeId,
      number: Number(episodeNumber) || 1,
      title: title.trim(),
      synopsis: synopsis.trim() || 'Episode synopsis...',
      duration: duration.trim() || '24:00',
      airDate: airDate.trim() || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status,
      videoUrl: videoUrl.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: thumbnailUrl.trim() || selectedAnime?.poster || '',
      fileSize: fileSize || '35.0 MB',
      videoStorageType: storageType
    };

    if (initialEpisode) {
      await updateEpisode(animeId, initialEpisode.id, payload);
    } else {
      await addEpisode(animeId, payload);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 font-display">
                {initialEpisode ? 'Edit Episode' : '+ Add New Episode'}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Upload authorized video to storage & publish to public catalog
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Episode Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* 1. Target Anime Selection & Episode Number */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Select Anime Series <span className="text-pink-500">*</span>
              </label>
              <select
                value={animeId}
                onChange={e => handleAnimeChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white transition-colors"
                required
              >
                {animeList.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.title} ({a.episodesCount} published eps)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Episode Number <span className="text-pink-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                value={episodeNumber}
                onChange={e => setEpisodeNumber(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white transition-colors"
                required
              />
            </div>
          </div>

          {/* 2. Episode Title & Air Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Episode Title <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. The Drums of Liberation"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Air Date</label>
              <input
                type="text"
                placeholder="e.g. Sep 27, 2026"
                value={airDate}
                onChange={e => setAirDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* 3. Duration & Publish Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Duration</label>
              <input
                type="text"
                placeholder="24:10"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-purple-600 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Publish Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('Published')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    status === 'Published'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs font-extrabold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Published (Live)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('Draft')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    status === 'Draft'
                      ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-2xs font-extrabold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Draft (Hidden)</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4. Episode Synopsis */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Episode Synopsis</label>
            <textarea
              rows={2}
              placeholder="Brief summary of events in this episode..."
              value={synopsis}
              onChange={e => setSynopsis(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden focus:border-purple-600 focus:bg-white transition-colors"
            />
          </div>

          {/* 5. Authorized Video File Upload & Storage */}
          <div className="bg-purple-50/50 p-4 sm:p-5 rounded-2xl border border-purple-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileVideo className="w-4 h-4 text-purple-700" />
                <span className="text-xs font-bold text-purple-950">
                  Authorized Video Storage Upload <span className="text-pink-500">*</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Encrypted Storage Active</span>
              </div>
            </div>

            {/* Video File Picker Input */}
            <input
              type="file"
              ref={videoFileInputRef}
              onChange={handleVideoFileChange}
              accept="video/*,.mp4,.webm,.mkv,.mov"
              className="hidden"
            />

            <div 
              onClick={() => videoFileInputRef.current?.click()}
              className="border-2 border-dashed border-purple-200 hover:border-purple-400 bg-white rounded-2xl p-4 text-center cursor-pointer transition-colors group"
            >
              <Upload className="w-6 h-6 text-purple-600 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-slate-800">
                {uploadingVideo
                  ? 'Uploading video file to authorized storage...'
                  : videoFileName
                  ? `Selected: ${videoFileName}`
                  : 'Click to select or drop video file (MP4, WebM, MKV)'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Up to 500MB supported · Automatically stored in high-performance video storage
              </p>
            </div>

            {/* Video URL & Storage Info */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-bold text-slate-600 block">
                Saved Video Storage URL (MongoDB / Cloud Storage)
              </label>
              <input
                type="text"
                placeholder="https://storage.googleapis.com/... or /uploads/videos/..."
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-purple-900 focus:outline-hidden focus:border-purple-600"
                required
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
                <span>Storage Type: <strong className="text-purple-700">{storageType}</strong></span>
                <span>Size: <strong className="text-slate-800">{fileSize || '42.5 MB'}</strong></span>
              </div>
            </div>

            {/* Video Preview Player */}
            {videoUrl && (
              <div className="mt-3 pt-3 border-t border-purple-100">
                <span className="text-[11px] font-bold text-slate-700 block mb-2">
                  Player Preview Test:
                </span>
                <div className="relative aspect-16/9 bg-black rounded-xl overflow-hidden shadow-sm max-w-sm mx-auto">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  >
                    Your browser does not support HTML5 video preview.
                  </video>
                </div>
              </div>
            )}
          </div>

          {/* 6. Thumbnail Upload */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-slate-700" />
                <span className="text-xs font-bold text-slate-800">
                  Episode Thumbnail Image
                </span>
              </div>
            </div>

            <input
              type="file"
              ref={thumbFileInputRef}
              onChange={handleThumbFileChange}
              accept="image/*"
              className="hidden"
            />

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div 
                onClick={() => thumbFileInputRef.current?.click()}
                className="w-full sm:w-1/2 border border-slate-200 hover:border-purple-400 bg-white rounded-xl p-3 text-center cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                <span className="text-xs font-bold text-slate-700 block truncate">
                  {uploadingThumb ? 'Uploading...' : thumbFileName || 'Upload Thumbnail Image'}
                </span>
              </div>

              <div className="w-full sm:w-1/2">
                <input
                  type="text"
                  placeholder="Or paste thumbnail image URL..."
                  value={thumbnailUrl}
                  onChange={e => setThumbnailUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-purple-600"
                />
              </div>
            </div>

            {thumbnailUrl && (
              <div className="w-28 aspect-16/9 rounded-lg overflow-hidden border border-slate-200 mt-2 bg-slate-100">
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail Preview"
                  className="w-full h-full object-cover"
                  onError={() => {}}
                />
              </div>
            )}
          </div>

          {/* Notice about auto-calculation */}
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 flex items-start gap-2.5 text-xs text-purple-900">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Automatic Calculation:</strong> When set to <strong>Published</strong>, this episode will automatically update <em>{selectedAnime?.title || 'the selected anime'}</em>'s total episode count and appear with a direct <strong>Watch</strong> button on the public page.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={uploadingVideo || uploadingThumb}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {initialEpisode ? 'Save Episode Changes' : 'Publish Episode'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
