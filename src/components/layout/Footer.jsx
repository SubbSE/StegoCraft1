import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Techniques', path: '/techniques' },
    { name: 'Live Demo', path: '/demo' },
    { name: 'About', path: '/about' },
  ];

  const techniques = [
    { name: 'Image Steganography', path: '/techniques#image' },
    { name: 'Audio Steganography', path: '/techniques#audio' },
    { name: 'Text Steganography', path: '/techniques#text' },
    { name: 'Video Steganography', path: '/techniques#video' },
  ];

  const aboutItems = [
    { name: 'Our Mission', path: '/about#mission' },
    { name: 'Research Team', path: '/about#team' },
    { name: 'Publications', path: '/about#publications' },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.02)_75%)] bg-[size:60px_60px]"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center space-x-3 mb-6 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold gradient-text">StegoCraft</div>
                  <div className="text-xs text-gray-400 font-medium">Hide in Plain Sight</div>
                </div>
              </Link>
              
              <p className="text-gray-400 leading-relaxed mb-6">
                A comprehensive platform for learning and practicing steganography techniques. 
                Master the art of hiding information within digital media.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                      </svg>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Techniques */}
            <div>
              <h4 className="text-lg font-semibold mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
                Techniques
              </h4>
              <ul className="space-y-3">
                {techniques.map((technique) => (
                  <li key={technique.name}>
                    <Link
                      to={technique.path}
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                      </svg>
                      {technique.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* About Section */}
            <div>
              <h4 className="text-lg font-semibold mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                About
              </h4>
              <ul className="space-y-3">
                {aboutItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                      </svg>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Contact Info */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h5 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Contact</h5>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    stegocraft@subbse.com
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    Kolkata, India
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Connect With Us */}
          <div className="border-t border-gray-700 pt-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
              {/* LinkedIn Link */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400 font-medium">Connect with us:</span>
                <a
                  href="https://www.linkedin.com/in/subir-ghosh-299348263/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-200 transform hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Copyright */}
              <div className="text-gray-400 text-sm">
                <p>&copy; 2025 StegoCraft. All rights reserved.</p>
                <p className="text-xs mt-1">Educational project for cybersecurity research.</p>
              </div>

              {/* Legal Links */}
              <div className="flex items-center space-x-6 text-sm">
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link to="/license" className="text-gray-400 hover:text-white transition-colors">
                  MIT License
                </Link>
              </div>
            </div>

            {/* Attribution */}
            <div className="mt-6 pt-6 border-t border-gray-700 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-full border border-blue-700/30 text-blue-300 text-xs">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Built with passion for cybersecurity education & research
              </div>
            </div>
          </div>
        </div>

        {/* Bold Cubic Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 shadow-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 active:scale-95 border-2 border-white/20 cursor-pointer group overflow-hidden"
          aria-label="Scroll to top"
        >
          {/* Cubic grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(255,255,255,0.1)_40%,rgba(255,255,255,0.1)_60%,transparent_60%)] bg-[size:6px_6px]"></div>
          
          {/* Bold cubic arrow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 relative transform group-hover:scale-125 transition-transform duration-300">
              {/* Cubic arrow made of squares */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border border-white/50"></div>
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-white border-x border-white/50"></div>
            </div>
          </div>

          {/* Gloss effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
