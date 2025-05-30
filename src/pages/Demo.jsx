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
      bgColor: 'bg-blue-50',
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 text-blue-800 text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            Live Interactive Demos
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Try 
            <span className="gradient-text"> Steganography </span>
            Live
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the power of steganography with our interactive demos. Hide and reveal secret messages 
            using real algorithms - all running in your browser with complete privacy.
          </p>
        </div>

        {/* Demo Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {demos.map((demo) => (
            <button
              key={demo.id}
              onClick={() => setActiveDemo(demo.id)}
              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                activeDemo === demo.id
                  ? `border-transparent bg-gradient-to-br ${demo.color}/10 shadow-2xl`
                  : 'border-gray-200 bg-white/70 hover:border-gray-300 shadow-lg hover:shadow-xl'
              }`}
            >
              {/* Active Indicator */}
              {activeDemo === demo.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              )}

              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${demo.color} flex items-center justify-center text-2xl shadow-lg transform transition-all duration-300 ${
                  activeDemo === demo.id ? 'scale-110 rotate-3' : 'group-hover:scale-105'
                }`}>
                  {demo.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{demo.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{demo.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Active Demo Component */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          {ActiveComponent && <ActiveComponent />}
        </div>

        {/* Security Notice */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-green-100 border border-green-200 rounded-full text-green-800 text-sm font-medium">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            🔒 All processing happens in your browser - your data never leaves your device
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
