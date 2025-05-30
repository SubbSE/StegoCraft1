// src/components/sections/Features.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Features = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const featuresRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      id: 1,
      title: "Image Steganography",
      description: "Hide data within digital images using LSB and DCT algorithms without visible quality loss.",
      icon: "🖼️",
      techniques: ["LSB Substitution", "DCT Domain", "Wavelet Transform"],
      color: "from-blue-500 to-cyan-500",
      bgGlow: "from-blue-400/20 to-cyan-400/20",
      stats: "3 Methods",
      demo: true
    },
    {
      id: 2,
      title: "Audio Steganography", 
      description: "Embed secret information in audio files using frequency domain techniques.",
      icon: "🎵",
      techniques: ["LSB Audio", "Echo Hiding", "Phase Coding"],
      color: "from-purple-500 to-pink-500",
      bgGlow: "from-purple-400/20 to-pink-400/20",
      stats: "3 Methods",
      demo: true
    },
    {
      id: 3,
      title: "Text Steganography",
      description: "Conceal messages within text documents using character encoding techniques.", 
      icon: "📝",
      techniques: ["White Space", "Unicode Hiding", "Synonym Substitution"],
      color: "from-green-500 to-teal-500",
      bgGlow: "from-green-400/20 to-teal-400/20",
      stats: "3 Methods",
      demo: true
    },
    {
      id: 4,
      title: "Video Steganography",
      description: "Hide data in video streams using frame-based and motion vector techniques.",
      icon: "🎬",
      techniques: ["Frame-based LSB", "Motion Vectors", "Temporal Hiding"],
      color: "from-orange-500 to-red-500",
      bgGlow: "from-orange-400/20 to-red-400/20",
      stats: "3 Methods",
      demo: false
    },
    {
      id: 5,
      title: "Network Steganography",
      description: "Embed information in network protocols and traffic patterns for covert communication.",
      icon: "🌐",
      techniques: ["TCP Sequence", "Timing Channels", "Packet Ordering"],
      color: "from-indigo-500 to-blue-500",
      bgGlow: "from-indigo-400/20 to-blue-400/20",
      stats: "3 Methods",
      demo: false
    },
    {
      id: 6,
      title: "Cryptographic Integration",
      description: "Combine steganography with encryption for maximum security and undetectability.",
      icon: "🔐",
      techniques: ["Encrypt-then-Hide", "Hash-based", "Digital Signatures"],
      color: "from-gray-600 to-slate-600",
      bgGlow: "from-gray-400/20 to-slate-400/20",
      stats: "3 Methods",
      demo: false
    }
  ];

  return (
    <section 
      ref={featuresRef} 
      id="features"
      className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden w-full"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center px-6 py-3 rounded-full bg-blue-500/20 backdrop-blur-xl border border-blue-400/30 text-blue-300 text-sm font-semibold mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse mr-3"></div>
            <span className="text-white">Advanced Techniques</span>
          </div>
          
          <h2 className={`text-4xl md:text-6xl font-black text-white mb-8 leading-tight transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Master Every <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">Steganography</span> Technique
          </h2>
          
          <p className={`text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            From basic LSB substitution to advanced cryptographic integration, explore comprehensive steganography methods 
            across multiple media types with hands-on interactive demos.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`group relative overflow-hidden rounded-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
              style={{
                transitionDelay: `${400 + index * 100}ms`
              }}
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Card Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-slate-800/90 to-gray-900/90 backdrop-blur-xl"></div>
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGlow} opacity-0 group-hover:opacity-100 transition-all duration-500`}></div>
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900"></div>

              {/* Content */}
              <div className="relative z-10 p-6">
                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-2xl shadow-xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3 border border-white/20`}>
                    <span className="group-hover:scale-110 transition-transform duration-300">{feature.icon}</span>
                  </div>
                  
                  {/* Demo Badge */}
                  {feature.demo && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        <span>LIVE</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Stats Badge */}
                  <div className={`absolute -bottom-2 -right-3 bg-gradient-to-r ${feature.color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                    {feature.stats}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 mb-6 leading-relaxed text-sm group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Techniques List */}
                <div className="space-y-2 mb-6">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Techniques:</h4>
                  {feature.techniques.map((technique, i) => (
                    <div key={i} className="flex items-center space-x-2 group-hover:translate-x-1 transition-transform duration-300" style={{transitionDelay: `${i * 50}ms`}}>
                      <div className={`w-2 h-2 bg-gradient-to-r ${feature.color} rounded-full`}></div>
                      <span className="text-gray-300 font-medium text-xs">{technique}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <Link
                    to="/techniques"
                    className="inline-flex items-center space-x-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-all duration-300 group/link"
                  >
                    <span>Learn More</span>
                    <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                    </svg>
                  </Link>
                  
                  {feature.demo && (
                    <Link
                      to="/demo"
                      className="inline-flex items-center space-x-1 text-xs text-green-400 font-semibold hover:text-green-300 transition-all duration-300 px-2 py-1 rounded-lg hover:bg-green-500/10 group/demo"
                    >
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Demo</span>
                      <svg className="w-3 h-3 group-hover/demo:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
