// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
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
          <div className={`md:hidden absolute top-full left-0 right-0 transition-all duration-300 ${
            isScrolled 
              ? 'bg-gradient-to-r from-pink-100/90 via-purple-100/90 to-indigo-100/90 backdrop-blur-xl shadow-xl border-b border-pink-200/50' 
              : 'bg-gray-900/90 backdrop-blur-xl border-b border-white/10'
          }`}>
            <div className="px-4 py-6 space-y-4">
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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
