import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';

export const Header = () => {
  const { t, i18n } = useTranslation();
  const { user, login, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      alert('로그아웃되었습니다.');
      window.location.reload(); // 새로고침 추가
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };
  
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-blue-600">
              DaeguCulture
            </div>
          </Link>
          
          <div className="items-center hidden space-x-6 md:flex">
            <Link to="/" className="font-medium text-gray-700 transition-colors hover:text-blue-600">
              {t('nav.home', '홈')}
            </Link>
            
            {user && (
              <Link to="/my-page" className="font-medium text-gray-700 transition-colors hover:text-blue-600">
                {t('nav.reviews', '내 후기')}
              </Link>
            )}
            
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              {i18n.language === 'ko' ? '🇺🇸 EN' : '🇰🇷 KO'}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt="프로필"
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-700">{user.displayName}</span>
                </div>
                <Button size="sm" variant="secondary" onClick={handleLogout}>
                  {t('nav.logout', '로그아웃')}
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={handleLogin}>
                {t('nav.login', '로그인')}
              </Button>
            )}
          </div>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 md:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
        
        {isMobileMenuOpen && (
          <div className="py-4 space-y-2 border-t border-gray-200 md:hidden">
            <Link 
              to="/" 
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('nav.home', '홈')}
            </Link>
            
            {user && (
              <Link 
                to="/my-page" 
                className="block py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.reviews', '내 후기')}
              </Link>
            )}

            <button
              onClick={() => {
                toggleLanguage();
                setIsMobileMenuOpen(false);
              }}
              className="block w-full py-2 text-left text-gray-700 hover:text-blue-600"
            >
              {i18n.language === 'ko' ? '🇺🇸 English' : '🇰🇷 한국어'}
            </button>

            <div className="pt-2 border-t border-gray-100">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center py-2 space-x-2">
                    {user.photoURL && (
                      <img
                        src={user.photoURL}
                        alt="프로필"
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span className="text-sm text-gray-700">{user.displayName}</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="block w-full py-2 text-left text-gray-700 hover:text-blue-600"
                  >
                    {t('nav.logout', '로그아웃')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    handleLogin();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full py-2 font-medium text-left text-blue-600"
                >
                  {t('nav.login', '로그인')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};