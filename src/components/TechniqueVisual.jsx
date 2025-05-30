// src/components/TechniqueVisual.jsx
import React, { useState, useEffect } from 'react';

const TechniqueVisual = ({ technique, step }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const renderVisual = () => {
    switch (technique.visualDemo.type) {
      case 'image-lsb':
        return <ImageLSBVisual step={step} />;
      case 'audio-lsb':
        return <AudioLSBVisual step={step} />;
      case 'whitespace':
        return <WhitespaceVisual step={step} />;
      default:
        return <DefaultVisual technique={technique} step={step} />;
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
      <div className="text-center mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">
          How {technique.name} Works
        </h4>
        <p className="text-sm text-gray-600">
          {technique.simpleExplanation}
        </p>
      </div>
      
      {renderVisual()}
      
      <div className="mt-6 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          <span className="mr-2">💡</span>
          {technique.realWorldExample}
        </div>
      </div>
    </div>
  );
};

// Image LSB Visual Component
const ImageLSBVisual = ({ step }) => {
  return (
    <div className="space-y-6">
      {/* Before/After Images */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-4 mb-2">
            <div className="w-full h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded flex items-center justify-center text-white font-semibold">
              Original Image
            </div>
          </div>
          <p className="text-xs text-gray-600">Normal image file</p>
        </div>
        <div className="text-center">
          <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-4 mb-2">
            <div className="w-full h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded flex items-center justify-center text-white font-semibold relative">
              Original Image
              <div className="absolute top-2 right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-xs text-gray-600">Same image + hidden data</p>
        </div>
      </div>

      {/* Pixel Demonstration */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h5 className="font-semibold text-gray-800 mb-3">Pixel Value Changes</h5>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="bg-red-100 p-2 rounded">
              <div className="text-red-800 font-mono">Red: 255</div>
            </div>
            <div className="text-xs text-gray-500 mt-1">Original</div>
          </div>
          <div className="flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </div>
          <div className="text-center">
            <div className="bg-red-100 p-2 rounded">
              <div className="text-red-800 font-mono">Red: 254</div>
            </div>
            <div className="text-xs text-gray-500 mt-1">Modified (stores bit 0)</div>
          </div>
        </div>
        <div className="mt-3 text-center">
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            Change of 1 is invisible to human eyes!
          </span>
        </div>
      </div>

      {/* Binary Conversion Example */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h5 className="font-semibold text-gray-800 mb-3">Message → Binary</h5>
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">H</span>
            <span className="text-gray-400">→</span>
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">01001000</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">i</span>
            <span className="text-gray-400">→</span>
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">01101001</span>
          </div>
          <div className="text-center">
            <span className="text-xs text-gray-500">Each letter becomes 8 binary digits</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Audio LSB Visual Component
const AudioLSBVisual = ({ step }) => {
  return (
    <div className="space-y-6">
      {/* Waveform Visualization */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h5 className="font-semibold text-gray-800 mb-3">Audio Waveform</h5>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="bg-purple-50 p-4 rounded">
              <svg className="w-full h-16" viewBox="0 0 200 64">
                <path
                  d="M0,32 Q50,10 100,32 T200,32"
                  stroke="#8B5CF6"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
            <p className="text-xs text-gray-600 mt-2">Original Audio</p>
          </div>
          <div className="text-center">
            <div className="bg-green-50 p-4 rounded">
              <svg className="w-full h-16" viewBox="0 0 200 64">
                <path
                  d="M0,32 Q50,10 100,32 T200,32"
                  stroke="#10B981"
                  strokeWidth="2"
                  fill="none"
                />
                <circle cx="50" cy="22" r="2" fill="#EF4444" className="animate-pulse" />
                <circle cx="100" cy="32" r="2" fill="#EF4444" className="animate-pulse" />
                <circle cx="150" cy="22" r="2" fill="#EF4444" className="animate-pulse" />
              </svg>
            </div>
            <p className="text-xs text-gray-600 mt-2">With Hidden Data</p>
          </div>
        </div>
      </div>

      {/* Sample Value Changes */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h5 className="font-semibold text-gray-800 mb-3">Sample Modifications</h5>
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
            <div className="text-sm">
              <span className="font-mono">Sample 1: 0.847</span>
            </div>
            <div className="text-gray-400">→</div>
            <div className="text-sm">
              <span className="font-mono">Sample 1: 0.846</span>
              <span className="text-xs text-green-600 ml-2">(stores bit 0)</span>
            </div>
          </div>
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
            <div className="text-sm">
              <span className="font-mono">Sample 2: 0.234</span>
            </div>
            <div className="text-gray-400">→</div>
            <div className="text-sm">
              <span className="font-mono">Sample 2: 0.235</span>
              <span className="text-xs text-green-600 ml-2">(stores bit 1)</span>
            </div>
          </div>
        </div>
        <div className="mt-3 text-center">
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            Changes are too small to hear!
          </span>
        </div>
      </div>
    </div>
  );
};

// Whitespace Visual Component
const WhitespaceVisual = ({ step }) => {
  return (
    <div className="space-y-6">
      {/* Text Comparison */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h5 className="font-semibold text-gray-800 mb-3">Text Comparison</h5>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Normal Text:</p>
            <div className="bg-gray-50 p-3 rounded border font-mono text-sm">
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">With Hidden Message:</p>
            <div className="bg-green-50 p-3 rounded border font-mono text-sm">
              The quick&nbsp;&nbsp;brown fox&nbsp;&nbsp;jumps over&nbsp;&nbsp;the lazy&nbsp;&nbsp;dog
            </div>
            <p className="text-xs text-green-600 mt-1">Extra spaces encode binary: 1101</p>
          </div>
        </div>
      </div>

      {/* Encoding Table */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h5 className="font-semibold text-gray-800 mb-3">Encoding Rules</h5>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded">
            <div className="text-2xl mb-2">•</div>
            <div className="text-sm font-medium">Single Space</div>
            <div className="text-xs text-gray-600">= Binary 0</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded">
            <div className="text-2xl mb-2">• •</div>
            <div className="text-sm font-medium">Double Space</div>
            <div className="text-xs text-gray-600">= Binary 1</div>
          </div>
        </div>
      </div>

      {/* Message Decoding */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h5 className="font-semibold text-gray-800 mb-3">Hidden Message Decoding</h5>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <span className="bg-gray-100 px-2 py-1 rounded font-mono">1101</span>
            <span className="text-gray-400">→</span>
            <span className="bg-blue-100 px-2 py-1 rounded">Letter "M"</span>
          </div>
          <div className="text-xs text-gray-500 text-center">
            Spaces between words reveal secret binary message!
          </div>
        </div>
      </div>
    </div>
  );
};

// Default Visual Component for other techniques
const DefaultVisual = ({ technique, step }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6 text-center">
      <div className="text-5xl mb-4">{technique.icon || '🔧'}</div>
      <h4 className="text-lg font-semibold text-gray-800 mb-2">
        {technique.name}
      </h4>
      <p className="text-sm text-gray-600 mb-4">
        {technique.simpleExplanation}
      </p>
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <p className="text-xs text-gray-500 italic">
          {technique.realWorldExample}
        </p>
      </div>
    </div>
  );
};

export default TechniqueVisual;
