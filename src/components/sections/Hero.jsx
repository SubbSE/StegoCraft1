// src/components/sections/Hero.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);
  const heroRef = useRef(null);
  const rafRef = useRef(null);

  const dynamicWords = [
    { text: "Plain Sight", color: "from-cyan-400 to-blue-500" },
    { text: "Digital Media", color: "from-purple-500 to-pink-500" },
    { text: "Secure Channels", color: "from-green-400 to-teal-500" },
    { text: "Hidden Messages", color: "from-orange-400 to-red-500" }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Animate the dynamic words
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % dynamicWords.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (rafRef.current) return;
    
    rafRef.current = requestAnimationFrame(() => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full relative">
      <div 
        ref={heroRef}
        className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 overflow-hidden w-full"
        onMouseMove={handleMouseMove}
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          {/* Simplified background effects */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-[400px] h-[400px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-400/10 via-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
          
          {/* Mouse followers */}
          <div 
            className="absolute w-64 h-64 bg-gradient-to-r from-cyan-400/15 to-blue-400/15 rounded-full blur-3xl pointer-events-none transition-transform duration-300 ease-out"
            style={{
              transform: `translate(${mousePosition.x - 128}px, ${mousePosition.y - 128}px)`,
            }}
          ></div>
          
          {/* Floating elements */}
          <div className="absolute top-32 right-32 w-24 h-24 border-2 border-cyan-400/30 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
          <div className="absolute bottom-40 left-40 w-20 h-20 border-2 border-purple-400/30 rounded-full animate-bounce" style={{animationDuration: '4s'}}></div>
        </div>

        {/* Content - Centered with proper padding */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-6xl mx-auto text-center w-full">
            {/* Status Badge - smaller */}
            <div className={`inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-blue-400/30 text-blue-300 text-sm font-semibold mb-8 shadow-xl transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-3"></div>
              <span className="text-white">Live Interactive Platform • No Installation Required</span>
            </div>

            {/* PROPER SIZED Main Heading */}
            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              Conceal Information in
              <span className={`block bg-gradient-to-r ${dynamicWords[currentWord].color} bg-clip-text text-transparent transition-all duration-1000 transform`}>
                {dynamicWords[currentWord].text}
              </span>
            </h1>

            {/* Proper sized subtitle */}
            <p className={`text-lg md:text-xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              StegoCraft is a comprehensive platform for exploring <span className="font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">steganography</span> - the art 
              and science of hiding information within digital media. Master the techniques 
              used by <span className="text-purple-400 font-semibold">cybersecurity professionals</span>.
            </p>

            {/* Properly sized stats grid */}
            <div className={`grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-16 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                <div className="relative text-center p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 via-slate-800/90 to-gray-900/90 backdrop-blur-xl border border-blue-400/30 hover:border-blue-300/50 transition-all duration-500 transform hover:scale-105 cursor-pointer group">
                  <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">16</div>
                  <div className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">Techniques</div>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                <div className="relative text-center p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 via-slate-800/90 to-gray-900/90 backdrop-blur-xl border border-purple-400/30 hover:border-purple-300/50 transition-all duration-500 transform hover:scale-105 cursor-pointer group">
                  <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">3</div>
                  <div className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">Live Demos</div>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                <div className="relative text-center p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 via-slate-800/90 to-gray-900/90 backdrop-blur-xl border border-green-400/30 hover:border-green-300/50 transition-all duration-500 transform hover:scale-105 cursor-pointer group">
                  <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">100%</div>
                  <div className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">Browser-Based</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons - Rounded Like Feature Boxes */}
            <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <Link
                to="/demo"
                className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-lg shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 active:scale-[0.98] rounded-xl border border-blue-400/30 hover:border-blue-300/50 focus:outline-none focus:ring-0"
              >
                {/* Diagonal stripe pattern background */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(255,255,255,0.1)_40%,rgba(255,255,255,0.1)_60%,transparent_60%)] bg-[size:20px_20px]"></div>
                
                {/* Button Content */}
                <div className="flex items-center space-x-3 relative z-10">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                  <span className="font-black">Try Live Demo</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </Link>

              <Link
                to="/techniques"
                className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-bold text-lg shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 active:scale-[0.98] rounded-xl border border-gray-600/50 hover:border-gray-500/70 focus:outline-none focus:ring-0"
              >
                {/* Diagonal stripe pattern background */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(255,255,255,0.05)_40%,rgba(255,255,255,0.05)_60%,transparent_60%)] bg-[size:20px_20px]"></div>
                
                {/* Button Content */}
                <div className="flex items-center space-x-3 relative z-10">
                  <div className="w-4 h-4 bg-cyan-400 rounded-sm"></div>
                  <span className="font-black">Explore Techniques</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                  </svg>
                </div>
                
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </Link>
            </div>

            {/* PROPERLY SIZED Feature Highlights */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-16 transform transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="group flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-br from-gray-900/50 via-slate-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-600/30 hover:border-cyan-400/50 transition-all duration-300 hover:bg-cyan-900/20">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold">High Accuracy</div>
                  <div className="text-gray-400 text-sm">Precise Outputs Every Time</div>
                </div>
              </div>

              <div className="group flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-br from-gray-900/50 via-slate-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-600/30 hover:border-purple-400/50 transition-all duration-300 hover:bg-purple-900/20">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold">Secure & Private</div>
                  <div className="text-gray-400 text-sm">Local processing only</div>
                </div>
              </div>

              <div className="group flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-br from-gray-900/50 via-slate-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-600/30 hover:border-green-400/50 transition-all duration-300 hover:bg-green-900/20">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold">Lightning Fast</div>
                  <div className="text-gray-400 text-sm">Instant results</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
