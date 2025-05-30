// src/components/sections/HowItWorks.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [progressWidth, setProgressWidth] = useState(25);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('how-it-works');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveStep((prev) => {
          const nextStep = (prev + 1) % 4;
          setProgressWidth(((nextStep + 1) / 4) * 100);
          return nextStep;
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const handleMouseMove = (e) => {
    const rect = document.getElementById('how-it-works')?.getBoundingClientRect();
    if (rect) {
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const steps = [
    {
      id: 1,
      title: "Choose Your Media",
      description: "Select the cover file that will hide your secret data - images, audio, video, or text documents.",
      icon: "📁",
      gradient: "from-blue-600 via-blue-500 to-cyan-400",
      bgGlow: "from-blue-500/20 to-cyan-500/20"
    },
    {
      id: 2,
      title: "Select Technique",
      description: "Pick from our comprehensive library of steganographic algorithms optimized for your media type.",
      icon: "🔧",
      gradient: "from-purple-600 via-purple-500 to-pink-400",
      bgGlow: "from-purple-500/20 to-pink-500/20"
    },
    {
      id: 3,
      title: "Embed Secret Data",
      description: "Our algorithms seamlessly integrate your hidden message into the cover media without detectable changes.",
      icon: "🔐",
      gradient: "from-green-600 via-emerald-500 to-teal-400",
      bgGlow: "from-green-500/20 to-teal-500/20"
    },
    {
      id: 4,
      title: "Download & Share",
      description: "Get your stego-object that appears normal but contains your hidden information, ready for secure transmission.",
      icon: "💾",
      gradient: "from-orange-600 via-red-500 to-pink-400",
      bgGlow: "from-orange-500/20 to-red-500/20"
    }
  ];

  const techniques = [
    {
      name: "LSB Steganography",
      description: "Least Significant Bit replacement in image pixels",
      visual: "🎨",
      complexity: "Beginner",
      gradient: "from-blue-500 to-cyan-400"
    },
    {
      name: "DCT Domain",
      description: "Frequency domain embedding using Discrete Cosine Transform",
      visual: "📊",
      complexity: "Intermediate",
      gradient: "from-purple-500 to-pink-400"
    },
    {
      name: "Spread Spectrum",
      description: "Advanced technique spreading data across frequency spectrum",
      visual: "📡",
      complexity: "Advanced",
      gradient: "from-indigo-500 to-purple-400"
    }
  ];

  return (
    <section 
      id="how-it-works" 
      className="py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Interactive mouse follower */}
      <div 
        className="absolute w-80 h-80 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mousePosition.x - 160}px, ${mousePosition.y - 160}px)`,
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className={`inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-blue-400/30 text-blue-300 text-sm font-bold mb-12 shadow-2xl transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse mr-3"></div>
            <span className="text-white font-semibold">Simple Process</span>
            <svg className="w-5 h-5 ml-3 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
          </div>
          
          <h2 className={`text-5xl md:text-7xl font-black text-white mb-8 leading-tight transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            How <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">Steganography</span> Works
          </h2>
          
          <p className={`text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Transform any digital media into a secret communication channel with our intuitive 4-step process. 
            Hide information where <span className="text-cyan-400 font-semibold">no one expects to find it</span>.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`relative transition-all duration-500 ease-in-out transform ${
                  activeStep === index ? 'scale-110' : 'scale-100'
                } ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                style={{ transitionDelay: `${600 + index * 150}ms` }}
              >
                <div className="relative h-full">
                  {/* Step Number */}
                  <div className={`absolute -top-3 left-6 w-10 h-10 rounded-full bg-gradient-to-r ${step.gradient} text-white font-black text-lg flex items-center justify-center shadow-2xl border-2 border-white z-20`}>
                    {index + 1}
                  </div>

                  {/* Card Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-slate-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl"></div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.bgGlow} opacity-0 transition-all duration-500 ease-in-out rounded-2xl ${activeStep === index ? 'opacity-100' : ''}`}></div>
                  
                  {/* Animated border */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${step.gradient} opacity-0 transition-all duration-500 ease-in-out ${activeStep === index ? 'opacity-100' : ''} blur-sm`}></div>
                  <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900"></div>

                  <div className="relative z-10 p-8 pt-12">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-3xl mb-6 mx-auto shadow-2xl transition-all duration-500 ease-in-out transform border border-white/20 ${
                      activeStep === index ? 'scale-110 rotate-3' : 'scale-100'
                    }`}>
                      <span className="relative z-10">{step.icon}</span>
                    </div>

                    {/* Content */}
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm font-bold text-white">{Math.round(progressWidth)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full"></div>
              <div 
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-in-out relative z-10 shadow-lg"
                style={{ width: `${progressWidth}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Before/After Comparison */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                <span className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center text-white text-lg font-bold mr-4 shadow-xl border border-white/20">
                  ✓
                </span>
                Visual Proof
              </h3>
            </div>

            {/* Before */}
            <div className="relative p-8 bg-gradient-to-br from-gray-800/90 via-slate-700/90 to-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-600/50">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-white text-lg">Original Image</h4>
                <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-2 rounded-full border border-blue-400/30 font-semibold">Clean</span>
              </div>
              <div className="w-full h-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="text-white font-bold text-xl relative z-10">🖼️ Original Media</div>
              </div>
              <div className="mt-6 text-sm text-gray-300 bg-gray-800/50 p-3 rounded-lg">
                File size: <span className="text-cyan-400 font-semibold">2.4 MB</span> • No hidden data
              </div>
            </div>

            {/* After */}
            <div className="relative p-8 bg-gradient-to-br from-green-900/30 via-emerald-800/30 to-green-900/30 backdrop-blur-xl rounded-2xl border border-green-500/30">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-white text-lg">After Steganography</h4>
                <span className="text-xs bg-green-500/20 text-green-300 px-3 py-2 rounded-full border border-green-400/30 font-semibold">Hidden Data</span>
              </div>
              <div className="w-full h-40 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="text-white font-bold text-xl relative z-10">🖼️ Identical Appearance</div>
                <div className="absolute top-3 right-3 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
              </div>
              <div className="mt-6 text-sm text-gray-300 bg-gray-800/50 p-3 rounded-lg">
                File size: <span className="text-cyan-400 font-semibold">2.4 MB</span> • Contains <span className="text-green-400 font-semibold">secret message</span>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 text-green-300 rounded-full text-sm font-bold shadow-xl">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Visually Identical - Completely Undetectable
              </div>
            </div>
          </div>

          {/* Technique Showcase */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6 flex items-center">
                <span className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-lg font-bold mr-4 shadow-xl border border-white/20">
                  🎯
                </span>
                Popular Techniques
              </h3>
            </div>

            {techniques.map((technique, index) => (
              <div
                key={index}
                className="group p-6 bg-gradient-to-br from-gray-800/90 via-slate-700/90 to-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-600/50 hover:border-purple-400/50 hover:bg-purple-900/20 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start space-x-6">
                  <div className={`w-14 h-14 bg-gradient-to-r ${technique.gradient} rounded-xl flex items-center justify-center text-2xl shadow-xl border border-white/20 group-hover:scale-110 transition-transform duration-300`}>
                    {technique.visual}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-white text-lg group-hover:text-purple-300 transition-colors">
                        {technique.name}
                      </h4>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                        technique.complexity === 'Beginner' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
                        technique.complexity === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' :
                        'bg-red-500/20 text-red-300 border border-red-400/30'
                      }`}>
                        {technique.complexity}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{technique.description}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="text-center pt-6">
              <Link
                to="/techniques"
                className="inline-flex items-center space-x-3 text-purple-400 font-bold hover:text-purple-300 transition-colors text-lg border border-purple-400/30 px-6 py-3 rounded-full hover:bg-purple-500/10 hover:border-purple-300/50"
              >
                <span>Explore All Techniques</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Interactive CTA */}
        <div className="text-center bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 rounded-3xl p-16 text-white relative overflow-hidden border border-purple-500/30">
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.05)_75%)] bg-[size:60px_60px] animate-pulse"></div>
            <div className="absolute top-10 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-float"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
          </div>

          <div className="relative z-10">
            <div className="text-7xl mb-8">🚀</div>
            <h3 className="text-4xl md:text-5xl font-black mb-6">
              Ready to Hide Your First Secret?
            </h3>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands learning the art of digital steganography. Start with our interactive tutorials and master the techniques used by <span className="text-cyan-400 font-semibold">security professionals worldwide</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/demo"
                className="group bg-white text-gray-900 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center space-x-4"
              >
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span>Start Interactive Demo</span>
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </Link>
              
              <Link
                to="/techniques"
                className="group bg-transparent border-2 border-white text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-white hover:text-gray-900 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center space-x-4"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>Browse Techniques</span>
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
