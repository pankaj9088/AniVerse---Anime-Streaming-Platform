import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Crown, 
  Shield, 
  Film, 
  Tv, 
  Users, 
  BarChart3, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import gojoAdminImg from '../../assets/images/auth_gojo_admin_1790495239235.jpg';

export const AdminLoginView: React.FC = () => {
  const { loginAdmin, navigate } = useApp();

  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin@1234');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await loginAdmin(email, password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3FF] via-[#EDE9FE] to-[#F1F5F9] flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Top Header Bar */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('home')}
            className="flex items-center gap-2 group cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-900 flex items-center justify-center text-white shadow-md shadow-purple-300 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-purple-600 transition-colors font-display block leading-none">
                AniVerse
              </span>
              <span className="text-[11px] font-bold text-purple-700 tracking-wide">
                Admin Portal
              </span>
            </div>
          </button>
        </div>

        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-1.5 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl border border-purple-200 text-xs font-bold text-slate-700 hover:text-purple-600 hover:bg-white shadow-2xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </header>

      {/* Main Content Layout (Floating White Card + High-Tech Gojo Admin Art) */}
      <div className="max-w-6xl w-full mx-auto my-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left Side: Floating Admin Login Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-9 shadow-2xl border border-purple-200/90 relative">
            
            {/* Crown Icon Header Badge */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-13 h-13 rounded-2xl bg-purple-100/80 text-purple-700 flex items-center justify-center mb-3 shadow-inner">
                <Crown className="w-7 h-7 stroke-[2.2]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
                Admin <span className="text-purple-600">Login</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Sign in to manage your anime platform.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Admin Email */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Admin Email</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-purple-600 focus:bg-white transition-all font-medium"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Admin Password */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Admin Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-purple-600 focus:bg-white transition-all font-medium"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-70 mt-2"
              >
                <Shield className="w-4 h-4" />
                <span>{loading ? 'Verifying Authorization...' : 'Login to Dashboard'}</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

            </form>

            {/* Quick Demo Credentials Autofill badge */}
            <div className="mt-4 p-2.5 bg-purple-50/70 border border-purple-100 rounded-xl text-center">
              <span className="text-[11px] text-purple-900 font-semibold">
                Admin Demo: <code className="font-bold bg-white px-1.5 py-0.5 rounded-md border border-purple-200">admin@example.com</code> / <code className="font-bold bg-white px-1.5 py-0.5 rounded-md border border-purple-200">Admin@1234</code>
              </span>
            </div>

            {/* Strict Security Restricted Area Warning Banner */}
            <div className="mt-5 p-3.5 bg-purple-50/50 rounded-2xl border border-purple-100 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-purple-200/80 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                This area is restricted to authorized administrators only. All activities are monitored and logged.
              </p>
            </div>

          </div>
        </div>

        {/* Right Side: High-Tech Anime Admin Art (Gojo with monitors) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col items-center justify-center relative">
          <div className="relative w-full max-w-md aspect-3/4 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 group">
            <img
              src={gojoAdminImg}
              alt="Administrator Workstation Visual"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-md text-slate-900 font-extrabold text-sm shadow-xl border border-purple-100 font-display">
                <Shield className="w-4 h-4 text-purple-600" />
                <span>AniVerse Core Control Systems</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bar: 4 Admin Capability Cards (Matching mockup) */}
      <footer className="max-w-5xl w-full mx-auto bg-white/90 backdrop-blur-md rounded-2xl border border-purple-200/80 p-4 shadow-sm z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          
          <div className="pt-2 md:pt-0">
            <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <Film className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-xs text-slate-900 block font-display">Manage Anime</span>
            <span className="text-[11px] text-slate-500 font-medium">Add & Edit</span>
          </div>

          <div className="pt-2 md:pt-0">
            <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Tv className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-xs text-slate-900 block font-display">Manage Episodes</span>
            <span className="text-[11px] text-slate-500 font-medium">Upload & Organize</span>
          </div>

          <div className="pt-2 md:pt-0">
            <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-xs text-slate-900 block font-display">User Management</span>
            <span className="text-[11px] text-slate-500 font-medium">View & Control</span>
          </div>

          <div className="pt-2 md:pt-0">
            <div className="w-7 h-7 mx-auto mb-1.5 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-xs text-slate-900 block font-display">Analytics</span>
            <span className="text-[11px] text-slate-500 font-medium">Track Growth</span>
          </div>

        </div>
      </footer>

    </div>
  );
};
