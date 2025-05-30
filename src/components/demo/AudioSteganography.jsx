// src/components/demo/AudioSteganography.jsx
import React, { useState, useRef } from 'react';

const AudioSteganography = () => {
  const [mode, setMode] = useState('hide');
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [revealedMessage, setRevealedMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      setResultUrl(null);
      setRevealedMessage('');
    }
  };

  const processAudio = async (hide = true) => {
    if (!selectedFile || (hide && !message)) return;
    
    setProcessing(true);
    
    try {
      // Create audio context
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(ctx);
      
      // Read file as array buffer
      const arrayBuffer = await selectedFile.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      
      // Get audio data (first channel)
      const audioData = audioBuffer.getChannelData(0);
      const sampleRate = audioBuffer.sampleRate;
      
      if (hide) {
        // Hide message
        const messageBinary = message.split('').map(char => 
          char.charCodeAt(0).toString(2).padStart(8, '0')
        ).join('') + '11111111'; // Delimiter
        
        // Modify LSB of audio samples
        for (let i = 0; i < messageBinary.length && i < audioData.length; i++) {
          const sample = audioData[i];
          const intSample = Math.round(sample * 32767);
          const newSample = (intSample & 0xFFFE) | parseInt(messageBinary[i]);
          audioData[i] = newSample / 32767;
        }
        
        // Create new audio buffer with modified data
        const newBuffer = ctx.createBuffer(1, audioData.length, sampleRate);
        newBuffer.getChannelData(0).set(audioData);
        
        // Convert to WAV (simplified)
        const blob = await audioBufferToWav(newBuffer);
        const url = URL.createObjectURL(blob);
        setResultUrl(url);
        
      } else {
        // Reveal message
        let binaryMessage = '';
        for (let i = 0; i < Math.min(10000, audioData.length); i++) {
          const sample = audioData[i];
          const intSample = Math.round(sample * 32767);
          binaryMessage += (intSample & 1).toString();
        }
        
        // Find delimiter
        const delimiterIndex = binaryMessage.indexOf('11111111');
        if (delimiterIndex !== -1) {
          binaryMessage = binaryMessage.substring(0, delimiterIndex);
        }
        
        // Convert binary to text
        let extractedMessage = '';
        for (let i = 0; i < binaryMessage.length; i += 8) {
          const byte = binaryMessage.substr(i, 8);
          if (byte.length === 8) {
            const charCode = parseInt(byte, 2);
            if (charCode > 0 && charCode < 128) {
              extractedMessage += String.fromCharCode(charCode);
            }
          }
        }
        
        setRevealedMessage(extractedMessage || 'No hidden message found');
      }
      
    } catch (error) {
      console.error('Error processing audio:', error);
      if (!hide) {
        setRevealedMessage('Error reading message');
      }
    }
    
    setProcessing(false);
  };

  // Simplified WAV conversion (basic implementation)
  const audioBufferToWav = async (buffer) => {
    const length = buffer.length;
    const data = new Float32Array(length);
    buffer.copyFromChannel(data, 0);
    
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);
    
    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, data[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  return (
    <div className="p-8">
      {/* Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setMode('hide')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              mode === 'hide'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Hide Message
          </button>
          <button
            onClick={() => setMode('reveal')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              mode === 'reveal'
                ? 'bg-purple-600 text-white shadow-lg'
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
              Select Audio File
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
            >
              {selectedFile ? (
                <div>
                  <svg className="mx-auto h-12 w-12 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                  </svg>
                  <p className="mt-2 text-sm text-gray-900 font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">Click to change</p>
                </div>
              ) : (
                <div>
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">Click to select an audio file</p>
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
            <div className="bg-gray-50 p-4 rounded-lg">
              <audio controls className="w-full">
                <source src={URL.createObjectURL(selectedFile)} type={selectedFile.type} />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {mode === 'hide' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secret Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your secret message..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Keep message short for better audio quality
              </p>
            </div>
          )}

          <button
            onClick={() => processAudio(mode === 'hide')}
            disabled={!selectedFile || (mode === 'hide' && !message) || processing}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {mode === 'hide' ? 'Result Audio' : 'Hidden Message'}
            </label>
            
            {mode === 'hide' && resultUrl && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <audio controls className="w-full">
                    <source src={resultUrl} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
                <a
                  href={resultUrl}
                  download="steganography-audio.wav"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                  Download Audio
                </a>
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
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="text-sm font-semibold text-purple-800 mb-2">How it works:</h4>
            <ul className="text-xs text-purple-700 space-y-1">
              <li>• Uses LSB substitution in audio samples</li>
              <li>• Modifies the least significant bit of each sample</li>
              <li>• Changes are inaudible to human ear</li>
              <li>• Works with WAV and uncompressed audio</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioSteganography;
