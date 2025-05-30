// src/components/demo/TextSteganography.jsx
import React, { useState } from 'react';

const TextSteganography = () => {
  const [mode, setMode] = useState('hide');
  const [coverText, setCoverText] = useState('');
  const [secretMessage, setSecretMessage] = useState('');
  const [resultText, setResultText] = useState('');
  const [revealedMessage, setRevealedMessage] = useState('');
  const [processing, setProcessing] = useState(false);

  const hideMessage = () => {
    if (!coverText || !secretMessage) return;
    
    setProcessing(true);
    
    try {
      // Convert secret message to binary
      const binaryMessage = secretMessage.split('').map(char => 
        char.charCodeAt(0).toString(2).padStart(8, '0')
      ).join('') + '11111111'; // Delimiter
      
      // Split cover text into words
      const words = coverText.split(' ');
      let result = '';
      let binaryIndex = 0;
      
      for (let i = 0; i < words.length && binaryIndex < binaryMessage.length; i++) {
        const word = words[i];
        const bit = binaryMessage[binaryIndex];
        
        // Add word
        result += word;
        
        // Add spaces based on bit (1 = two spaces, 0 = one space)
        if (bit === '1') {
          result += '  '; // Two spaces
        } else {
          result += ' '; // One space
        }
        
        binaryIndex++;
      }
      
      // Add remaining words normally
      result += words.slice(Math.min(words.length, binaryMessage.length)).join(' ');
      
      setResultText(result);
      
    } catch (error) {
      console.error('Error hiding message:', error);
    }
    
    setProcessing(false);
  };

  const revealMessage = () => {
    if (!coverText) return;
    
    setProcessing(true);
    
    try {
      // Analyze spaces between words
      const words = coverText.split(/\s+/);
      const spacePattern = coverText.match(/\s+/g) || [];
      
      let binaryMessage = '';
      
      // Extract bits based on space count
      for (let i = 0; i < spacePattern.length; i++) {
        const spaceCount = spacePattern[i].length;
        if (spaceCount === 1) {
          binaryMessage += '0';
        } else if (spaceCount >= 2) {
          binaryMessage += '1';
        }
      }
      
      // Find delimiter
      const delimiterIndex = binaryMessage.indexOf('11111111');
      if (delimiterIndex !== -1) {
        binaryMessage = binaryMessage.substring(0, delimiterIndex);
      }
      
      // Convert binary to text
      let message = '';
      for (let i = 0; i < binaryMessage.length; i += 8) {
        const byte = binaryMessage.substr(i, 8);
        if (byte.length === 8) {
          const charCode = parseInt(byte, 2);
          if (charCode > 0 && charCode < 128) {
            message += String.fromCharCode(charCode);
          }
        }
      }
      
      setRevealedMessage(message || 'No hidden message found');
      
    } catch (error) {
      console.error('Error revealing message:', error);
      setRevealedMessage('Error reading message');
    }
    
    setProcessing(false);
  };

  const sampleTexts = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and makes for excellent steganography testing. Hidden messages can be embedded seamlessly within ordinary text.",
    "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat."
  ];

  return (
    <div className="p-8">
      {/* Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setMode('hide')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              mode === 'hide'
                ? 'bg-green-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Hide Message
          </button>
          <button
            onClick={() => setMode('reveal')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              mode === 'reveal'
                ? 'bg-green-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Reveal Message
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Text
            </label>
            <textarea
              value={coverText}
              onChange={(e) => setCoverText(e.target.value)}
              placeholder="Enter the text that will hide your message..."
              className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            
            {/* Sample Text Buttons */}
            <div className="mt-2 space-x-2">
              <span className="text-xs text-gray-500">Try sample text:</span>
              {sampleTexts.map((text, index) => (
                <button
                  key={index}
                  onClick={() => setCoverText(text)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                >
                  Sample {index + 1}
                </button>
              ))}
            </div>
          </div>

          {mode === 'hide' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secret Message
              </label>
              <textarea
                value={secretMessage}
                onChange={(e) => setSecretMessage(e.target.value)}
                placeholder="Enter your secret message..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Keep message shorter than cover text for best results
              </p>
            </div>
          )}

          <button
            onClick={mode === 'hide' ? hideMessage : revealMessage}
            disabled={!coverText || (mode === 'hide' && !secretMessage) || processing}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {processing ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <span>{mode === 'hide' ? 'Hide Message' : 'Reveal Message'}</span>
            )}
          </button>
        </div>

        {/* Result Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {mode === 'hide' ? 'Result Text' : 'Hidden Message'}
            </label>
            
            {mode === 'hide' && resultText && (
              <div className="space-y-4">
                <textarea
                  value={resultText}
                  readOnly
                  className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(resultText)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                  Copy Text
                </button>
              </div>
            )}

            {mode === 'reveal' && revealedMessage && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Revealed Message:</p>
                <p className="text-gray-900 whitespace-pre-wrap">{revealedMessage}</p>
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="text-sm font-semibold text-green-800 mb-2">How it works:</h4>
            <ul className="text-xs text-green-700 space-y-1">
              <li>• Uses whitespace steganography technique</li>
              <li>• Single space = binary 0, double space = binary 1</li>
              <li>• Message is encoded in spacing between words</li>
              <li>• Completely invisible to casual readers</li>
            </ul>
          </div>

          {/* Visual Indicator */}
          {mode === 'hide' && resultText && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="text-sm font-semibold text-yellow-800 mb-2">Space Analysis:</h4>
              <p className="text-xs text-yellow-700">
                The result text contains {resultText.match(/  /g)?.length || 0} double spaces 
                and {resultText.match(/ /g)?.length || 0} total spaces.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextSteganography;
