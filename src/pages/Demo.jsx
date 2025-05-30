// src/pages/Demo.jsx
import ImageSteganography from '../components/demo/ImageSteganography.jsx';
import AudioSteganography from '../components/demo/AudioSteganography';
import TextSteganography from '../components/demo/TextSteganography';
import React, { useState } from 'react';

const Demo = () => {
  const [activeDemo, setActiveDemo] = useState('image');

  const demos = [
    {
      id: 'image',
      name: 'Image Steganography',
      description: 'Hide text messages within image pixels using LSB substitution',
      icon: '🖼️',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-slate-800/50',
      component: ImageSteganography
    },
    {
      id: 'audio',
      name: 'Audio Steganography',
      description: 'Embed secret data in audio files using LSB technique',
      icon: '🎵',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      component: AudioSteganography
    },
    {
      id: 'text',
      name: 'Text Steganography',
      description: 'Conceal messages using whitespace and invisible characters',
      icon: '📝',
      color: 'from-green-500 to-teal-500',
      bgColor: 'bg-green-50',
      component: TextSteganography
    }
  ];

  const ActiveComponent = demos.find(demo => demo.id === activeDemo)?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden pt-20">
      
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-[400px] h-[400px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-400/10 via-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-blue-400/30 text-blue-300 text-sm font-semibold mb-6 shadow-xl">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-white">Live Interactive Demos</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Try 
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> Steganography </span>
            Live
          </h1>
          
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
            Experience the power of steganography with our interactive demos. Hide and reveal secret messages 
            using real algorithms - all running in your browser with complete privacy.
          </p>
        </div>

        {/* Demo Navigation */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {demos.map((demo) => (
            <button
              key={demo.id}
              onClick={() => setActiveDemo(demo.id)}
              className={`group relative bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border transition-all duration-300 cursor-pointer transform hover:scale-105 p-6 ${
                activeDemo === demo.id
                  ? `border-cyan-400/50 shadow-2xl scale-105 bg-gradient-to-br ${demo.color}/10`
                  : 'border-slate-600/30 hover:border-cyan-400/50 hover:shadow-2xl'
              }`}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-blue-500/5 to-purple-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              
              {/* Active Indicator */}
              {activeDemo === demo.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              )}

              <div className="text-center relative z-10">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${demo.color} flex items-center justify-center text-2xl shadow-lg transform transition-all duration-300 ${
                  activeDemo === demo.id ? 'scale-110 rotate-3' : 'group-hover:scale-105'
                }`}>
                  {demo.icon}
                </div>
                <h3 className={`text-lg font-bold mb-2 transition-colors ${
                  activeDemo === demo.id ? 'text-cyan-400' : 'text-white group-hover:text-cyan-400'
                }`}>
                  {demo.name}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                  {demo.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Active Demo Component */}
        <div className="bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-600/30 overflow-hidden">
          {ActiveComponent && <ActiveComponent />}
        </div>

        {/* Security Notice */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600/20 to-green-800/20 backdrop-blur-xl border border-green-400/30 rounded-full text-green-300 text-sm font-medium shadow-xl">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            🔒 All processing happens in your browser - your data never leaves your device
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="text-center p-6 bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-600/30">
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">100%</div>
            <div className="text-gray-300 font-medium">Client-Side Processing</div>
            <div className="text-sm text-gray-400 mt-1">Complete privacy guaranteed</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-600/30">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">Real-time</div>
            <div className="text-gray-300 font-medium">Interactive Demos</div>
            <div className="text-sm text-gray-400 mt-1">Instant results & feedback</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-600/30">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent mb-2">3</div>
            <div className="text-gray-300 font-medium">Demo Categories</div>
            <div className="text-sm text-gray-400 mt-1">Image, Audio & Text</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative text-center bg-gradient-to-br from-blue-600/80 to-purple-600/80 backdrop-blur-xl rounded-3xl p-12 text-white shadow-2xl border border-blue-400/30 overflow-hidden mt-16">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-3xl"></div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">Ready to Learn More?</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Explore detailed explanations, visual demonstrations, and production-ready code for all steganography techniques.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/techniques"
                className="inline-flex items-center space-x-3 bg-white text-blue-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <span>View All Techniques</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
              </a>
              <a
                href="/about"
                className="inline-flex items-center space-x-3 bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <span>Learn More</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 16h-1v-4h-1v4h-1l2-2 2 2zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
