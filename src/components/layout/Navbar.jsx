// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ onLogout, user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();

  // Get user info from localStorage or props
  const currentUser = React.useMemo(() => {
    const storedUser = localStorage.getItem('stegoCraftCurrentUser');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        return null;
      }
    }
    return user ? {
      username: user.displayName || 'User',
      email: user.email
    } : { username: 'User', email: 'user@example.com' };
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Techniques', path: '/techniques' },
    { name: 'Live Demo', path: '/demo' },
    { name: 'About', path: '/about' }
  ];

  const handleLogout = async () => {
    console.log('🔴 Navbar handleLogout called!');
    
    // Close menus first
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    
    if (onLogout) {
      console.log('🔴 Calling onLogout from App.jsx...');
      try {
        await onLogout();
      } catch (error) {
        console.error('🔴 Error during logout:', error);
      }
    } else {
      console.error('🔴 onLogout prop is missing!');
      // Fallback logout
      localStorage.removeItem('stegoCraftCurrentUser');
      window.location.reload();
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-gradient-to-r from-pink-100/80 via-purple-100/80 to-indigo-100/80 backdrop-blur-xl shadow-xl border-b border-pink-200/50' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 ${
              isScrolled 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 text-white'
            } group-hover:scale-110 group-hover:shadow-2xl`}>
              🔐
            </div>
            <div>
              <div className={`text-xl font-black transition-colors duration-300 ${
                isScrolled ? 'text-gray-800' : 'text-white'
              }`}>
                StegoCraft
              </div>
              <div className={`text-xs font-medium transition-colors duration-300 ${
                isScrolled ? 'text-gray-600' : 'text-gray-300'
              }`}>
                Hide In Plain Sight
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 relative group ${
                  location.pathname === link.path
                    ? isScrolled
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white/20 backdrop-blur-xl text-white border border-white/30'
                    : isScrolled
                      ? 'text-gray-700 hover:text-gray-900 hover:bg-pink-50/70 border border-transparent hover:border-pink-200/50'
                      : 'text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-xl border border-transparent hover:border-white/20'
                } hover:scale-105 transform`}
              >
                <span className="relative z-10">{link.name}</span>
                {location.pathname === link.path && !isScrolled && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-lg"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* CTA Button */}
            <Link
              to="/demo"
              className={`group relative overflow-hidden px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
                isScrolled
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white/20'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Try Now</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </Link>

            {/* User Menu */}
            <div className="relative z-50">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  isScrolled
                    ? 'bg-gray-100/70 text-gray-700 hover:bg-gray-200/70'
                    : 'bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  isScrolled 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                    : 'bg-gradient-to-r from-cyan-500 to-green-500 text-white'
                }`}>
                  {currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : '👤'}
                </div>
                <span className="max-w-24 truncate">{currentUser?.username || 'User'}</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className={`absolute right-0 top-full mt-2 w-64 rounded-xl shadow-2xl border transition-all duration-300 z-[60] ${
                  isScrolled 
                    ? 'bg-white/95 backdrop-blur-xl border-pink-200/50' 
                    : 'bg-gray-900/95 backdrop-blur-xl border-white/20'
                }`}>
                  <div className="p-2">
                    {/* User Info Section */}
                    <div className={`px-4 py-3 text-sm border-b ${
                      isScrolled ? 'text-gray-700 border-gray-200' : 'text-gray-300 border-white/10'
                    }`}>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                          isScrolled 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                            : 'bg-gradient-to-r from-cyan-500 to-green-500 text-white'
                        }`}>
                          {currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : '👤'}
                        </div>
                        <div>
                          <div className="font-semibold text-base">
                            {currentUser?.username || 'User'}
                          </div>
                          <div className={`text-xs ${isScrolled ? 'text-gray-500' : 'text-gray-400'}`}>
                            {currentUser?.email || 'user@stegocraft.com'}
                          </div>
                        </div>
                      </div>
                      <div className={`text-xs flex items-center space-x-1 ${
                        isScrolled ? 'text-green-600' : 'text-green-400'
                      }`}>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Secure Session Active</span>
                      </div>
                    </div>

                    {/* Profile Menu Items */}
                    <div className="py-2 space-y-1">
                      <button
                        className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                          isScrolled 
                            ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' 
                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Profile Settings</span>
                      </button>

                      <button
                        className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                          isScrolled 
                            ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900' 
                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Security</span>
                      </button>
                    </div>

                    {/* Logout Button */}
                    <div className={`border-t pt-2 mt-2 ${isScrolled ? 'border-gray-200' : 'border-white/10'}`}>
                      <button
                        onClick={handleLogout}
                        className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 flex items-center space-x-2 hover:scale-105 transform ${
                          isScrolled 
                            ? 'text-red-600 hover:bg-red-50 hover:text-red-700' 
                            : 'text-red-400 hover:bg-red-500/20 hover:text-red-300'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-3 rounded-lg transition-all duration-300 ${
                isScrolled 
                  ? 'text-gray-700 hover:bg-pink-50/70 border border-pink-200/30' 
                  : 'text-white hover:bg-white/10 backdrop-blur-xl border border-white/20'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden absolute top-full left-0 right-0 transition-all duration-300 z-40 ${
            isScrolled 
              ? 'bg-gradient-to-r from-pink-100/90 via-purple-100/90 to-indigo-100/90 backdrop-blur-xl shadow-xl border-b border-pink-200/50' 
              : 'bg-gray-900/90 backdrop-blur-xl border-b border-white/10'
          }`}>
            <div className="px-4 py-6 space-y-4">
              {/* User Info */}
              <div className={`px-6 py-4 rounded-xl border ${
                isScrolled ? 'bg-gray-100/50 border-gray-200' : 'bg-white/10 border-white/20'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                    isScrolled 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                      : 'bg-gradient-to-r from-cyan-500 to-green-500 text-white'
                  }`}>
                    {currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : '👤'}
                  </div>
                  <div>
                    <div className={`font-semibold ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                      {currentUser?.username || 'User'}
                    </div>
                    <div className={`text-sm ${isScrolled ? 'text-gray-600' : 'text-gray-300'}`}>
                      {currentUser?.email || 'user@stegocraft.com'}
                    </div>
                    <div className={`text-xs flex items-center space-x-1 mt-1 ${
                      isScrolled ? 'text-green-600' : 'text-green-400'
                    }`}>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Secure Session</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-300 ${
                    location.pathname === link.path
                      ? isScrolled
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-white/20 backdrop-blur-xl text-white border border-white/30'
                      : isScrolled
                        ? 'text-gray-700 hover:text-gray-900 hover:bg-pink-50/70'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Try Now Button */}
              <Link
                to="/demo"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-6 py-4 rounded-xl text-lg font-bold text-center transition-all duration-300 ${
                  isScrolled
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/30 text-white'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Try Now</span>
                </div>
              </Link>

              {/* Profile Links */}
              <div className={`space-y-2 px-2 py-4 rounded-xl border ${
                isScrolled ? 'bg-gray-50/50 border-gray-200' : 'bg-white/5 border-white/10'
              }`}>
                <button
                  className={`w-full text-left px-4 py-3 rounded-lg text-base transition-all duration-300 flex items-center space-x-3 ${
                    isScrolled 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile Settings</span>
                </button>

                <button
                  className={`w-full text-left px-4 py-3 rounded-lg text-base transition-all duration-300 flex items-center space-x-3 ${
                    isScrolled 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Security</span>
                </button>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`w-full px-6 py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-3 hover:scale-105 transform ${
                  isScrolled 
                    ? 'text-red-600 hover:bg-red-50 border border-red-200' 
                    : 'text-red-400 hover:bg-red-500/10 border border-red-500/30'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(isUserMenuOpen || isMobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setIsUserMenuOpen(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;
