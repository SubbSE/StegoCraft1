import React, { useState, useRef } from 'react';

const AudioSteganography = () => {
  const [mode, setMode] = useState('hide');
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [revealedMessage, setRevealedMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      setResultUrl(null);
      setRevealedMessage('');
      setError('');
    }
  };

  const processAudio = async (hide = true) => {
    if (!selectedFile || (hide && !message)) return;
    
    setProcessing(true);
    setError('');
    
    try {
      // Create audio context
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(ctx);
      
      // Read file as array buffer
      const arrayBuffer = await selectedFile.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      
      // Get audio data (first channel)
      const originalData = audioBuffer.getChannelData(0);
      const audioData = new Float32Array(originalData); // Create a copy
      const sampleRate = audioBuffer.sampleRate;
      const numChannels = audioBuffer.numberOfChannels;
      
      console.log(`Audio info: ${audioData.length} samples, ${sampleRate}Hz, ${numChannels} channels`);
      
      if (hide) {
        // Hide message - FIXED ALGORITHM
        const messageBinary = message.split('').map(char => 
          char.charCodeAt(0).toString(2).padStart(8, '0')
        ).join('') + '1111111111111110'; // 16-bit delimiter
        
        console.log(`Message binary length: ${messageBinary.length} bits`);
        
        if (messageBinary.length > audioData.length) {
          throw new Error('Message too long for this audio file');
        }
        
        // IMPROVED: More robust LSB modification
        for (let i = 0; i < messageBinary.length; i++) {
          // Convert float to 16-bit integer (more precise range)
          let sample16 = Math.round(audioData[i] * 32767);
          
          // Clamp to valid range
          sample16 = Math.max(-32768, Math.min(32767, sample16));
          
          // Clear LSB and set new bit
          const bit = parseInt(messageBinary[i]);
          sample16 = (sample16 & 0xFFFE) | bit;
          
          // Convert back to float
          audioData[i] = sample16 / 32767;
        }
        
        // Create new audio buffer with modified data
        const newBuffer = ctx.createBuffer(numChannels, audioData.length, sampleRate);
        newBuffer.getChannelData(0).set(audioData);
        
        // Copy other channels unchanged
        for (let channel = 1; channel < numChannels; channel++) {
          const channelData = audioBuffer.getChannelData(channel);
          newBuffer.getChannelData(channel).set(channelData);
        }
        
        // Convert to WAV
        const blob = await audioBufferToWav(newBuffer);
        const url = URL.createObjectURL(blob);
        setResultUrl(url);
        
        console.log('Message hidden successfully');
        
      } else {
        // Reveal message - FIXED ALGORITHM
        let binaryMessage = '';
        
        // Extract bits from samples (limit search for performance)
        const maxSamples = Math.min(audioData.length, 100000);
        
        for (let i = 0; i < maxSamples; i++) {
          // Convert float to 16-bit integer
          let sample16 = Math.round(audioData[i] * 32767);
          sample16 = Math.max(-32768, Math.min(32767, sample16));
          
          // Extract LSB
          binaryMessage += (sample16 & 1).toString();
        }
        
        console.log(`Extracted ${binaryMessage.length} bits`);
        
        // Find delimiter
        const delimiterIndex = binaryMessage.indexOf('1111111111111110');
        if (delimiterIndex !== -1) {
          binaryMessage = binaryMessage.substring(0, delimiterIndex);
          console.log(`Found delimiter at position ${delimiterIndex}`);
        }
        
        // Convert binary to text
        let extractedMessage = '';
        for (let i = 0; i < binaryMessage.length; i += 8) {
          const byte = binaryMessage.substr(i, 8);
          if (byte.length === 8) {
            const charCode = parseInt(byte, 2);
            // Accept printable ASCII and common whitespace
            if ((charCode >= 32 && charCode <= 126) || charCode === 10 || charCode === 13) {
              extractedMessage += String.fromCharCode(charCode);
            }
          }
        }
        
        console.log(`Extracted message: "${extractedMessage}"`);
        setRevealedMessage(extractedMessage || 'No hidden message found');
      }
      
    } catch (error) {
      console.error('Error processing audio:', error);
      setError(error.message || 'Error processing audio file');
      if (!hide) {
        setRevealedMessage('Error reading message');
      }
    }
    
    setProcessing(false);
  };

  // WAV conversion function (unchanged - it's good)
  const audioBufferToWav = async (buffer) => {
    const length = buffer.length;
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const bytesPerSample = 2;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = length * blockAlign;
    
    const arrayBuffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(arrayBuffer);
    
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    // WAV header
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);
    
    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        const sample = buffer.getChannelData(channel)[i];
        const clampedSample = Math.max(-1, Math.min(1, sample));
        const intSample = Math.round(clampedSample * 32767);
        view.setInt16(offset, intSample, true);
        offset += 2;
      }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  const calculateCapacity = () => {
    if (!selectedFile || !message) return null;
    
    const estimatedSamples = 44100 * 10; // Rough estimate
    const bitsNeeded = message.length * 8 + 16;
    
    return {
      needed: bitsNeeded,
      estimated: estimatedSamples,
      canFit: bitsNeeded < estimatedSamples
    };
  };

  return (
    <div className="p-8">
      {/* Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-800/50 backdrop-blur-xl p-1 rounded-lg border border-slate-600/50">
          <button
            onClick={() => {
              setMode('hide');
              setRevealedMessage('');
              setResultUrl('');
              setError('');
            }}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              mode === 'hide'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            Hide Message
          </button>
          <button
            onClick={() => {
              setMode('reveal');
              setRevealedMessage('');
              setResultUrl('');
              setError('');
            }}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              mode === 'reveal'
                ? 'bg-purple-600 text-white shadow-lg'
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
              {mode === 'hide' ? 'Select Audio File' : 'Audio File with Hidden Message'}
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-600/50 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400/50 transition-all bg-slate-800/30 backdrop-blur-xl"
            >
              {selectedFile ? (
                <div>
                  <svg className="mx-auto h-12 w-12 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                  </svg>
                  <p className="mt-2 text-sm text-white font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-gray-400">Click to change</p>
                </div>
              ) : (
                <div>
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-300">Click to select an audio file</p>
                  <p className="text-xs text-gray-500">WAV, MP3, or other audio formats</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {selectedFile && (
            <div className="bg-slate-800/50 backdrop-blur-xl p-4 rounded-lg border border-slate-600/50">
              <audio controls className="w-full">
                <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type} />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {mode === 'hide' && (
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Secret Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your secret message..."
                className="w-full h-32 px-3 py-2 bg-slate-800/50 backdrop-blur-xl border border-slate-600/50 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-400">
                  Message: {message.length} chars → Needs: {message.length * 8 + 16} bits
                </p>
                {message && selectedFile && (() => {
                  const capacity = calculateCapacity();
                  return capacity ? (
                    <p className="text-xs">
                      {capacity.canFit ? 
                        <span className="text-green-400">✓ Should fit in audio file</span> : 
                        <span className="text-red-400">⚠️ Message may be too long</span>
                      }
                    </p>
                  ) : null;
                })()}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-600/20 border border-red-400/50 rounded-lg p-3">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={() => processAudio(mode === 'hide')}
            disabled={!selectedFile || (mode === 'hide' && !message) || processing}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {processing ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Processing Audio...</span>
              </>
            ) : (
              <span>{mode === 'hide' ? 'Hide Message' : 'Reveal Message'}</span>
            )}
          </button>
        </div>

        {/* Result Section */}
        <div className="space-y-6">
          {/* Info Panel - Moved to Top */}
          <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 rounded-xl p-6 text-white shadow-xl">
            <h3 className="text-lg font-semibold text-purple-400 mb-4">How it works:</h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-purple-400 mt-1">•</span>
                <span className="text-gray-300">Uses LSB (Least Significant Bit) substitution</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-400 mt-1">•</span>
                <span className="text-gray-300">Modifies the last bit of each audio sample</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-400 mt-1">•</span>
                <span className="text-gray-300">Changes are inaudible to human ear</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-400 mt-1">•</span>
                <span className="text-gray-300">Works best with uncompressed audio</span>
              </li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              {mode === 'hide' ? 'Result Audio' : 'Hidden Message'}
            </label>
            
            {mode === 'hide' && resultUrl && (
              <div className="space-y-4">
                <div className="bg-slate-800/50 backdrop-blur-xl p-4 rounded-lg border border-slate-600/50">
                  <audio controls className="w-full">
                    <source src={resultUrl} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
                <div className="flex space-x-2">
                  <a
                    href={resultUrl}
                    download="steganography-audio.wav"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    </svg>
                    Download Audio
                  </a>
                  <button
                    onClick={() => {
                      setMode('reveal');
                      setResultUrl('');
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
                <p className="text-sm font-medium text-purple-400 mb-2">Revealed Message:</p>
                <p className="text-gray-200 whitespace-pre-wrap font-mono text-lg">{revealedMessage}</p>
              </div>
            )}

            {/* Placeholder when no result */}
            {!resultUrl && !revealedMessage && !error && (
              <div className="border-2 border-dashed border-slate-600/50 rounded-lg p-8 text-center bg-slate-800/30 backdrop-blur-xl">
                <div className="text-gray-400">
                  {mode === 'hide' ? (
                    <div>
                      <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      <p className="text-sm">Modified audio will appear here</p>
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
        </div>
      </div>
    </div>
  );
};

export default AudioSteganography;
