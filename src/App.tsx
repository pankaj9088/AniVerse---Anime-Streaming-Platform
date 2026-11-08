/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/views/HomeView';
import { AnimeListingView } from './components/views/AnimeListingView';
import { AnimeDetailsView } from './components/views/AnimeDetailsView';
import { WatchView } from './components/views/WatchView';
import { ProfileView } from './components/views/ProfileView';
import { AdminDashboardView } from './components/views/AdminDashboardView';
import { GenresView } from './components/views/GenresView';
import { UserLoginView } from './components/views/UserLoginView';
import { AdminLoginView } from './components/views/AdminLoginView';
import { CheckCircle, Info, AlertTriangle, ShieldAlert, ArrowLeft } from 'lucide-react';

const AccessDeniedView: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="min-h-screen bg-[#F7F7FB] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border border-purple-100 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 font-display">Access Denied</h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          You do not have the required administrator privileges to view this portal. Standard users are restricted from administrative controls.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={() => navigate('home')}
            className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate('admin-login')}
            className="flex-1 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { currentView, currentUser, toasts } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7FB] text-slate-800">
      
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 bg-white text-slate-900 border border-purple-200 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-300"
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              toast.type === 'error' ? 'bg-red-100 text-red-600' :
              toast.type === 'info' ? 'bg-blue-100 text-blue-600' :
              'bg-purple-100 text-purple-600'
            }`}>
              {toast.type === 'error' ? (
                <AlertTriangle className="w-3.5 h-3.5" />
              ) : toast.type === 'info' ? (
                <Info className="w-3.5 h-3.5" />
              ) : (
                <CheckCircle className="w-3.5 h-3.5" />
              )}
            </div>
            <span className="text-xs font-bold">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Standalone User Login Page */}
      {currentView === 'login' && <UserLoginView />}

      {/* Standalone Admin Login Page */}
      {currentView === 'admin-login' && <AdminLoginView />}

      {/* Admin Dashboard Protected Route */}
      {currentView === 'admin' && (
        currentUser?.role === 'admin' ? (
          <AdminDashboardView />
        ) : (
          <AccessDeniedView />
        )
      )}

      {/* Normal Client Views */}
      {currentView !== 'login' && currentView !== 'admin-login' && currentView !== 'admin' && (
        <>
          <Navbar />
          <main className="flex-1">
            {currentView === 'home' && <HomeView />}
            {currentView === 'anime' && <AnimeListingView />}
            {currentView === 'genres' && <GenresView />}
            {currentView === 'trending' && <AnimeListingView />}
            {currentView === 'movies' && <AnimeListingView />}
            {currentView === 'details' && <AnimeDetailsView />}
            {currentView === 'watch' && <WatchView />}
            {currentView === 'profile' && <ProfileView />}
          </main>
          <Footer />
        </>
      )}

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
