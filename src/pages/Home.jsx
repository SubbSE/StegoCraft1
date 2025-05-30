// src/pages/HomePage.jsx
import React from 'react';
import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';
import HowItWorks from '../components/sections/HowItWorks';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Single continuous dark section with flowing background */}
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 via-indigo-900 to-slate-900 relative overflow-hidden">
        {/* Shared flowing background elements across both sections */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 right-20 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-indigo-400/15 via-purple-400/15 to-pink-400/15 rounded-full blur-3xl"></div>
          
          {/* Connecting gradient flow */}
          <div className="absolute top-1/2 left-0 right-0 h-96 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent blur-2xl transform -rotate-3"></div>
          
          {/* Floating elements */}
          <div className="absolute top-32 right-32 w-20 h-20 border-2 border-cyan-400/30 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
          <div className="absolute bottom-40 left-40 w-16 h-16 border-2 border-purple-400/30 rounded-full animate-bounce" style={{animationDuration: '4s'}}></div>
        </div>
        
        {/* Content sections with explicit z-index */}
        <div className="relative z-10">
          {/* Features section */}
          <Features />
          
          {/* Seamless connecting element */}
          <div className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
              <div className="mt-8 mb-8">
                <div className="inline-flex items-center space-x-4 text-purple-300">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-purple-500/50"></div>
                  <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                  </svg>
                  <div className="w-12 h-px bg-gradient-to-l from-transparent to-purple-500/50"></div>
                </div>
              </div>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
            </div>
          </div>
          
          {/* HowItWorks section */}
          <HowItWorks />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
