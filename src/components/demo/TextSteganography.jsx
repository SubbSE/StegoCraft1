import React, { useState } from 'react';

const TextSteganography = () => {
  const [mode, setMode] = useState('hide');
  const [coverText, setCoverText] = useState('');
  const [secretMessage, setSecretMessage] = useState('');
  const [resultText, setResultText] = useState('');
  const [revealedMessage, setRevealedMessage] = useState('');
  const [processing, setProcessing] = useState(false);

  // Random words for padding
  const randomWords = [
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'day',
    'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did',
    'its', 'let', 'put', 'say', 'she', 'too', 'use', 'also', 'back', 'call', 'came', 'each', 'find', 'good',
    'here', 'just', 'know', 'last', 'left', 'life', 'live', 'look', 'made', 'make', 'many', 'most', 'move',
    'must', 'name', 'need', 'next', 'only', 'over', 'said', 'same', 'tell', 'than', 'that', 'them', 'they',
    'this', 'time', 'very', 'well', 'went', 'were', 'what', 'when', 'with', 'word', 'work', 'year', 'your',
    'about', 'after', 'again', 'being', 'could', 'every', 'first', 'found', 'great', 'group', 'house',
    'large', 'place', 'right', 'small', 'sound', 'still', 'such', 'think', 'those', 'three', 'under',
    'water', 'where', 'while', 'world', 'would', 'write', 'young', 'something', 'together', 'important'
  ];

  const generateRandomWords = (count) => {
    const words = [];
    for (let i = 0; i < count; i++) {
      words.push(randomWords[Math.floor(Math.random() * randomWords.length)]);
    }
    return words.join(' ');
  };

  const autoExtendText = () => {
    if (!coverText || !secretMessage) return;
    
    const requiredBits = secretMessage.length * 8 + 16; // +16 for delimiter
    const currentSpaces = coverText.split(' ').length - 1;
    const neededSpaces = requiredBits - currentSpaces;
    
    if (neededSpaces > 0) {
      const additionalWords = generateRandomWords(neededSpaces);
      setCoverText(coverText + ' ' + additionalWords);
    }
  };

  const hideMessage = () => {
    if (!coverText || !secretMessage) return;
    
    setProcessing(true);
    
    try {
      // Convert secret message to binary
      const binaryMessage = secretMessage.split('').map(char => 
        char.charCodeAt(0).toString(2).padStart(8, '0')
      ).join('') + '1111111111111110'; // Unique delimiter (16 bits)
      
      // Split cover text into words
      const words = coverText.split(' ');
      let result = '';
      let binaryIndex = 0;
      
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        result += word;
        
        // Add space(s) based on binary data
        if (i < words.length - 1) { // Don't add space after last word
          if (binaryIndex < binaryMessage.length) {
            const bit = binaryMessage[binaryIndex];
            if (bit === '1') {
              result += '  '; // Exactly two spaces for binary 1
            } else {
              result += ' '; // Exactly one space for binary 0
            }
            binaryIndex++;
          } else {
            result += ' '; // Normal single space for remaining words
          }
        }
      }
      
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
      // Use more robust regex to split and capture spaces
      const parts = coverText.split(/(\s+)/);
      let binaryMessage = '';
      
      // Extract only the space parts (odd indices)
      for (let i = 1; i < parts.length; i += 2) {
        const spacePart = parts[i];
        const spaceCount = (spacePart.match(/ /g) || []).length;
        
        if (spaceCount === 1) {
          binaryMessage += '0'; // Single space = 0
        } else if (spaceCount === 2) {
          binaryMessage += '1'; // Double space = 1
        }
      }
      
      console.log('Extracted binary:', binaryMessage);
      
      // Find delimiter (1111111111111110)
      const delimiterIndex = binaryMessage.indexOf('1111111111111110');
      if (delimiterIndex !== -1) {
        binaryMessage = binaryMessage.substring(0, delimiterIndex);
      }
      
      console.log('Binary after delimiter removal:', binaryMessage);
      
      // Convert binary to text
      let message = '';
      for (let i = 0; i < binaryMessage.length; i += 8) {
        const byte = binaryMessage.substr(i, 8);
        if (byte.length === 8) {
          const charCode = parseInt(byte, 2);
          if (charCode > 0 && charCode <= 127) { // Valid ASCII range
            message += String.fromCharCode(charCode);
          }
        }
      }
      
      console.log('Decoded message:', message);
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

  const requiredSpaces = secretMessage ? secretMessage.length * 8 + 16 : 0;
  const availableSpaces = coverText ? coverText.split(' ').length - 1 : 0;
  const needsMoreWords = requiredSpaces > availableSpaces;

  return (
    <div className="p-8">
      {/* Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-800/50 backdrop-blur-xl p-1 rounded-lg border border-slate-600/50">
          <button
            onClick={() => {
              setMode('hide');
              setRevealedMessage('');
              setResultText('');
            }}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              mode === 'hide'
                ? 'bg-green-600 text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            Hide Message
          </button>
          <button
            onClick={() => {
              setMode('reveal');
              setRevealedMessage('');
              setResultText('');
            }}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              mode === 'reveal'
                ? 'bg-green-600 text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
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
            <label className="block text-sm font-medium text-white mb-2">
              {mode === 'hide' ? 'Cover Text' : 'Text with Hidden Message'}
            </label>
            <textarea
              value={coverText}
              onChange={(e) => setCoverText(e.target.value)}
              placeholder={mode === 'hide' 
                ? "Enter the text that will hide your message..." 
                : "Paste the text that contains a hidden message..."
              }
              className="w-full h-40 px-3 py-2 bg-slate-800/50 backdrop-blur-xl border border-slate-600/50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 font-mono"
            />
            
            {/* Sample Text Buttons - Only show in hide mode */}
            {mode === 'hide' && (
              <div className="mt-2 space-x-2">
                <span className="text-xs text-gray-400">Try sample text:</span>
                {sampleTexts.map((text, index) => (
                  <button
                    key={index}
                    onClick={() => setCoverText(text)}
                    className="text-xs bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 hover:text-white px-2 py-1 rounded transition-all border border-slate-600/50"
                  >
                    Sample {index + 1}
                  </button>
                ))}
              </div>
            )}

            {/* Instructions for reveal mode */}
            {mode === 'reveal' && (
              <div className="mt-2 text-xs text-yellow-300 bg-yellow-600/20 border border-yellow-400/30 rounded p-2">
                💡 Tip: Copy and paste text that was created using the "Hide Message" function
              </div>
            )}
          </div>

          {mode === 'hide' && (
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Secret Message
              </label>
              <textarea
                value={secretMessage}
                onChange={(e) => setSecretMessage(e.target.value)}
                placeholder="Enter your secret message..."
                className="w-full h-32 px-3 py-2 bg-slate-800/50 backdrop-blur-xl border border-slate-600/50 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
              />
              
              {/* Capacity Information */}
              <div className="mt-2 space-y-2">
                <p className="text-xs text-gray-400">
                  Message: {secretMessage.length} chars → Needs: {requiredSpaces} spaces → Available: {availableSpaces} spaces
                </p>
                
                {coverText && secretMessage && (
                  <div className="flex items-center space-x-2">
                    {needsMoreWords ? (
                      <>
                        <span className="text-xs text-red-400">⚠️ Need {requiredSpaces - availableSpaces} more spaces</span>
                        <button
                          onClick={autoExtendText}
                          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-all"
                        >
                          Auto-Add Words
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-green-400">✓ Sufficient space available</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            onClick={mode === 'hide' ? hideMessage : revealMessage}
            disabled={!coverText || (mode === 'hide' && (!secretMessage || needsMoreWords)) || processing}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
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
          {/* Info Panel */}
          <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 rounded-xl p-6 text-white shadow-xl">
            <h3 className="text-lg font-semibold text-green-400 mb-4">How it works:</h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-green-400 mt-1">•</span>
                <span className="text-gray-300">Uses whitespace steganography technique</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-400 mt-1">•</span>
                <span className="text-gray-300">Exactly 1 space = binary 0, exactly 2 spaces = binary 1</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-400 mt-1">•</span>
                <span className="text-gray-300">Auto-generates random words when needed</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-400 mt-1">•</span>
                <span className="text-gray-300">Completely invisible to casual readers</span>
              </li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              {mode === 'hide' ? 'Result Text' : 'Hidden Message'}
            </label>
            
            {mode === 'hide' && resultText && (
              <div className="space-y-4">
                <textarea
                  value={resultText}
                  readOnly
                  className="w-full h-40 px-3 py-2 bg-slate-800/50 backdrop-blur-xl border border-slate-600/50 rounded-md text-gray-200 text-sm font-mono"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(resultText)}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                    Copy Text
                  </button>
                  <button
                    onClick={() => {
                      setCoverText(resultText);
                      setMode('reveal');
                      setResultText('');
                    }}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Test Reveal
                  </button>
                </div>
              </div>
            )}

            {mode === 'reveal' && revealedMessage && (
              <div className="p-4 bg-slate-800/50 backdrop-blur-xl rounded-lg border border-slate-600/50 shadow-lg">
                <p className="text-sm font-medium text-green-400 mb-2">Revealed Message:</p>
                <p className="text-gray-200 whitespace-pre-wrap font-mono text-lg">{revealedMessage}</p>
              </div>
            )}

            {/* Placeholder when no result */}
            {!resultText && !revealedMessage && (
              <div className="border-2 border-dashed border-slate-600/50 rounded-lg p-8 text-center bg-slate-800/30 backdrop-blur-xl">
                <div className="text-gray-400">
                  {mode === 'hide' ? (
                    <div>
                      <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm">Result text will appear here</p>
                    </div>
                  ) : (
                    <div>
                      <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm">Hidden message will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Visual Indicator */}
          {mode === 'hide' && resultText && (
            <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-xl border border-yellow-400/30 rounded-xl p-4 text-white shadow-xl">
              <h4 className="text-sm font-semibold text-yellow-300 mb-2">Space Analysis:</h4>
              <p className="text-xs text-yellow-100">
                Double spaces (1s): <span className="font-bold">{(resultText.match(/  /g) || []).length}</span> | 
                Single spaces (0s): <span className="font-bold">{(resultText.split(' ').length - 1) - (resultText.match(/  /g) || []).length}</span>
              </p>
              <p className="text-xs text-yellow-100 mt-1">
                Total bits encoded: <span className="font-bold">{(resultText.split(' ').length - 1)}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextSteganography;
