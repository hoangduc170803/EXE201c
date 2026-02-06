import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e7edf3] dark:border-gray-800 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <div className="flex items-center justify-center text-primary">
            <span className="material-symbols-outlined !text-[32px] font-bold">
              travel_explore
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#0d141b] dark:text-white">
            StayEase
          </h2>
        </Link>

        {/* Desktop Search (Collapsed State) */}
        <div className="hidden lg:flex items-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow py-2.5 px-4 gap-4 cursor-pointer">
          <button className="text-sm font-medium pl-2">Anywhere</button>
          <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-600"></div>
          <button className="text-sm font-medium">Any week</button>
          <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-600"></div>
          <button className="text-sm text-gray-500 dark:text-gray-400 font-normal pr-2 flex items-center gap-2">
            Add guests
            <div className="bg-primary text-white p-1.5 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined !text-[14px]">
                search
              </span>
            </div>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link
            to="/host"
            className={`hidden md:block text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2 rounded-full transition-colors ${
              location.pathname === '/host' ? 'text-primary' : ''
            }`}
          >
            Become a Host
          </Link>
          <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="material-symbols-outlined !text-[20px]">
              language
            </span>
          </button>
          <Link 
            to="/messages" 
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
          >
            <span className="material-symbols-outlined !text-[20px]">
              chat_bubble
            </span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Link>
          
          {/* User Menu */}
          <div className="relative group">
            <button className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-full p-1 pl-3 hover:shadow-md transition-all ml-1">
              <span className="material-symbols-outlined !text-[20px]">
                menu
              </span>
              {isAuthenticated && user ? (
                // Show user avatar or initial when logged in
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold overflow-hidden relative">
                  {user.avatarUrl ? (
                    <>
                      <img
                        src={user.avatarUrl}
                        alt={user.fullName || user.firstName || 'User'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Hide image and show initial on error
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <span
                        className="absolute inset-0 flex items-center justify-center w-full h-full bg-primary text-white text-sm font-semibold"
                        style={{ display: 'none' }}
                      >
                        {(user.fullName || user.firstName || user.email || 'U').charAt(0).toUpperCase()}
                      </span>
                    </>
                  ) : (
                    <span className="flex items-center justify-center w-full h-full">
                      {(user.fullName || user.firstName || user.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              ) : (
                // Show default icon when not logged in
                <div className="bg-gray-500 text-white rounded-full p-1">
                  <span className="material-symbols-outlined !text-[24px] filled">
                    account_circle
                  </span>
                </div>
              )}
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                {!isAuthenticated ? (
                  <>
                    <Link to="/auth" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                      Log in
                    </Link>
                    <Link to="/auth" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                      Sign up
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                      <span className="material-symbols-outlined !text-[16px]">person</span>
                      My Profile
                    </Link>
                    <Link to="/profile?tab=bookings" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                      <span className="material-symbols-outlined !text-[16px]">calendar_month</span>
                      Lịch sử đặt phòng
                    </Link>
                    <Link to="/profile?tab=favorites" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                      <span className="material-symbols-outlined !text-[16px]">favorite</span>
                      Yêu thích
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                    <Link to="/messages" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                      <span className="material-symbols-outlined !text-[16px]">chat_bubble</span>
                      Messages
                    </Link>
                    {user?.roles?.includes('ROLE_HOST') && (
                      <Link to="/host" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span className="material-symbols-outlined !text-[16px]">home_work</span>
                        Host Portal
                      </Link>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                    <Link to="/profile?tab=settings" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                      <span className="material-symbols-outlined !text-[16px]">settings</span>
                      Cài đặt
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                    >
                      <span className="material-symbols-outlined !text-[16px]">logout</span>
                      Log out
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

