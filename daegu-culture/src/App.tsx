import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LoginModal } from './components/auth/LoginModal';
import { Home } from './pages/Home';
import { EventDetail } from './pages/EventDetail';
import { MyPage } from './pages/MyPage';
import './i18n';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const handleAuthAction = async () => {
    if (user) {
      await logout();
      navigate('/'); // 홈으로 이동
      window.location.reload(); // 새로고침 추가
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors">
              DaeguCulture
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {t('nav.home')}
              </Link>
              {user && (
                <Link
                  to="/my-page"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/my-page') 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {t('nav.reviews')}
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              {i18n.language === 'ko' ? '🇺🇸 EN' : '🇰🇷 KO'}
            </button>
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || ''}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-700 hidden md:block">
                    {user.displayName}
                  </span>
                </div>
                <button
                  onClick={handleAuthAction}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors text-sm"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <button
                onClick={handleAuthAction}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors text-sm"
              >
                {t('nav.login')}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* 로그인 모달 */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => {
          // 로그인 성공 후 필요한 추가 작업
        }}
      />
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/my-page" element={<MyPage />} />
            </Routes>
          </main>
        </div>
        
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;