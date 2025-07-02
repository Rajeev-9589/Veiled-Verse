import './App.css'
import { Suspense, lazy, useState, useEffect } from 'react'
import { Routes, Route } from "react-router-dom";
import { Toaster } from 'sonner';
import Navbar from './components/Navbar'
import ErrorBoundary from './components/ErrorBoundary'
import PrivateRoute from './Routes/PrivateRoute';
import LoadingSpinner from './components/LoadingSpinner';
import OfflineIndicator from './components/OfflineIndicator';
import BookExplorer from './components/Canwedo/BookExplorer';

// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home'));
const SignupPage = lazy(() => import('./pages/SignupPage').then(module => ({ default: module.default })));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.default })));
const EnhancedWrite = lazy(() => import('./pages/EnhancedWrite'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const Subscribe = lazy(() => import('./pages/Subscription'));
const StoryPreview = lazy(() => import('./components/Preview'));
const StoryRead = lazy(() => import('./pages/Storyread'));
const EnhancedDashboard = lazy(() => import('./pages/EnhancedDashboard'));
const UpdateRole = lazy(() => import('./pages/UpdateRole'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
    <LoadingSpinner />
  </div>
);

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <ErrorBoundary>
      <OfflineIndicator />
      <div className={isOnline ? 'pt-[64px]' : 'pt-[112px]'}>
        <Navbar />
        
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<Home />} />
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/marketplace' element={<Marketplace />} />
            <Route path='/subscribe' element={<Subscribe />} />
            <Route path='/read/:id' element={<StoryRead />} />
            <Route path='/preview/:id' element={<StoryPreview />} />
    

            <Route path='/explorer/book' element={<BookExplorer />} />



            <Route path='/dashboard' element={
              <PrivateRoute>
                <EnhancedDashboard />
              </PrivateRoute>
            } />
            <Route path='/write/:storyId' element={
  <PrivateRoute>
    <EnhancedWrite />
  </PrivateRoute>
} />
            <Route path='/write' element={
              <PrivateRoute>
                <EnhancedWrite />
              </PrivateRoute>
            } />
            <Route path='/update-role' element={
              <PrivateRoute>
                <UpdateRole />
              </PrivateRoute>
            } />
            <Route path='/admin' element={
              <PrivateRoute>
                <AdminPanel />
              </PrivateRoute>
            } />
            
            {/* 404 Route */}
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Suspense>
        
        <Toaster 
          position="top-center" 
          richColors 
          closeButton
          duration={4000}
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            },
          }}
        />
      </div>
    </ErrorBoundary>
  )
}

// 404 Not Found Component
const NotFound = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <a 
        href="/" 
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
      >
        Go Home
      </a>
    </div>
  </div>
);

export default App
