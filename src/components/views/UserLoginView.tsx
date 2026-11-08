import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  User, 
  Tv, 
  ShieldCheck, 
  Users, 
  Play
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import luffyImg from '../../assets/images/auth_luffy_cherry_1790495223905.jpg';

export const UserLoginView: React.FC = () => {
  const { loginUser, registerUser, navigate, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('User@1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'login') {
      await loginUser(email, password);
    } else {
      if (!name.trim()) {
        showToast('Please enter your full name.', 'error');
        setLoading(false);
        return;
      }
      await registerUser(name, email, password);
    }
    setLoading(false);
  };

  const handleSocialLogin = (provider: string) => {
    showToast(`Connecting with ${provider}...`, 'info');
    setTimeout(() => {
      loginUser('user@example.com', 'User@1234');
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F8] via-[#FAF5FF] to-[#F0F7FF] flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Top Header Bar */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('home')}
            className="flex items-center gap-2 group cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-300 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-purple-600 transition-colors font-display block leading-none">
                AniVerse
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                Watch · Explore · Enjoy
              </span>
            </div>
          </button>
        </div>

        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-1.5 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:text-purple-600 hover:bg-white shadow-2xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </header>

      {/* Main Content Layout (Anime Key Visual + Floating White Form) */}
      <div className="max-w-6xl w-full mx-auto my-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left Side: Anime Key Art (Luffy with cherry blossoms) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col items-center justify-center relative">
          <div className="relative w-full max-w-md aspect-3/4 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 group">
            <img
              src={luffyImg}
              alt="Joyful Anime Key Visual"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Anime Slogan badge from mockup */}
            <div className="absolute bottom-6 left-6 right-6 text-center">
              <span className="inline-block px-5 py-2.5 rounded-2xl bg-white/90 backdrop-blur-md text-slate-900 font-extrabold text-base shadow-lg border border-pink-100 font-display">
                Anime Makes Life Better 💖
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Floating Login / Sign Up Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-xl border border-purple-100/80 relative">
            
            {/* Form Title & Subtitle */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
                Welcome <span className="text-purple-600">{mode === 'login' ? 'Back!' : 'to AniVerse'}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {mode === 'login'
                  ? 'Login to continue watching your favorite anime.'
                  : 'Create your account to save playlists and track progress.'}
              </p>
            </div>

            {/* Segmented Controls (Login / Sign Up) */}
            <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {mode === 'signup' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Pankaj Kumar"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-purple-500 focus:bg-white transition-all font-medium"
                      required
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email address</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-purple-500 focus:bg-white transition-all font-medium"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-purple-500 focus:bg-white transition-all font-medium"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 font-medium text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded-sm border-slate-300 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => showToast('Password reset link sent to your email address.', 'info')}
                  className="font-bold text-purple-600 hover:text-purple-700 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-70 mt-2"
              >
                <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Login' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>

            {/* Quick Demo Credentials Autofill badge */}
            <div className="mt-4 p-2.5 bg-purple-50/70 border border-purple-100 rounded-xl text-center">
              <span className="text-[11px] text-purple-800 font-semibold">
                Demo User: <code className="font-bold bg-white px-1.5 py-0.5 rounded-md border border-purple-200">user@example.com</code> / <code className="font-bold bg-white px-1.5 py-0.5 rounded-md border border-purple-200">User@1234</code>
              </span>
            </div>

            {/* OR Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
                <span className="bg-white px-2">OR</span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-3 transition-colors shadow-2xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('GitHub')}
                className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl text-xs font-bold flex items-center justify-center gap-3 transition-colors shadow-2xs cursor-pointer"
              >
                <svg className="w-4 h-4 fill-slate-900" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                <span>Continue with GitHub</span>
              </button>
            </div>

            {/* Toggle switch text */}
            <div className="text-center mt-5 text-xs text-slate-500">
              {mode === 'login' ? (
                <>
                  New to AniVerse?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="font-bold text-purple-600 hover:text-purple-700 hover:underline cursor-pointer"
                  >
                    Create your account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="font-bold text-purple-600 hover:text-purple-700 hover:underline cursor-pointer"
                  >
                    Log In
                  </button>
                </>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Bar: 4 Metrics / Features (Matching mockup) */}
      <footer className="max-w-5xl w-full mx-auto bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-4 shadow-sm z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="flex items-center justify-center gap-3 pt-2 md:pt-0">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <Play className="w-4 h-4 fill-purple-600 ml-0.5" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-xs text-slate-900 block font-display">10,000+</span>
              <span className="text-[11px] text-slate-500 font-medium">Anime Titles</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2 md:pt-0">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Tv className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-xs text-slate-900 block font-display">HD</span>
              <span className="text-[11px] text-slate-500 font-medium">Quality Streaming</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2 md:pt-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-xs text-slate-900 block font-display">Free</span>
              <span className="text-[11px] text-slate-500 font-medium">To Watch</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2 md:pt-0">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-xs text-slate-900 block font-display">Active</span>
              <span className="text-[11px] text-slate-500 font-medium">Anime Community</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
