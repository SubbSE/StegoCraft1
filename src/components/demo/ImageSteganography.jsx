// src/components/demo/ImageSteganography.jsx
import React, { useState, useRef } from 'react';

const ImageSteganography = () => {
  const [mode, setMode] = useState('hide'); // 'hide' or 'reveal'
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState('');
  const [revealedMessage, setRevealedMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResultUrl(null);
      setRevealedMessage('');
    }
  };

  const hideMessage = async () => {
    if (!selectedFile || !message) return;
    
    setProcessing(true);
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Convert message to binary
        const messageBinary = message.split('').map(char => 
          char.charCodeAt(0).toString(2).padStart(8, '0')
        ).join('') + '1111111111111110'; // Delimiter
        
        // Hide message in LSB of red channel
        for (let i = 0; i < messageBinary.length && i < data.length / 4; i++) {
          const pixelIndex = i * 4; // Red channel
          data[pixelIndex] = (data[pixelIndex] & 0xFE) | parseInt(messageBinary[i]);
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        // Create download URL
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          setResultUrl(url);
          setProcessing(false);
        }, 'image/png');
      };
      
      img.src = previewUrl;
    } catch (error) {
      console.error('Error hiding message:', error);
      setProcessing(false);
    }
  };

  const revealMessage = async () => {
    if (!selectedFile) return;
    
    setProcessing(true);
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Extract LSB from red channel
        let binaryMessage = '';
        for (let i = 0; i < data.length / 4; i++) {
          const pixelIndex = i * 4; // Red channel
          binaryMessage += (data[pixelIndex] & 1).toString();
        }
        
        // Find delimiter
        const delimiterIndex = binaryMessage.indexOf('1111111111111110');
        if (delimiterIndex !== -1) {
          binaryMessage = binaryMessage.substring(0, delimiterIndex);
        }
        
        // Convert binary to text
        let message = '';
        for (let i = 0; i < binaryMessage.length; i += 8) {
          const byte = binaryMessage.substr(i, 8);
          if (byte.length === 8) {
            const charCode = parseInt(byte, 2);
            if (charCode > 0) {
              message += String.fromCharCode(charCode);
            }
          }
        }
        
        setRevealedMessage(message || 'No hidden message found');
        setProcessing(false);
      };
      
      img.src = previewUrl;
    } catch (error) {
      console.error('Error revealing message:', error);
      setRevealedMessage('Error reading message');
      setProcessing(false);
    }
  };

  return (
    <div className="p-8">
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-800/50 backdrop-blur-xl p-1 rounded-lg border border-slate-600/50">
          <button
            onClick={() => setMode('hide')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              mode === 'hide'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            Hide Message
          </button>
          <button
            onClick={() => setMode('reveal')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              mode === 'reveal'
                ? 'bg-blue-600 text-white shadow-lg'
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
              Select Image
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-600/50 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-400/50 transition-all bg-slate-800/30 backdrop-blur-xl"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Selected"
                  className="max-w-full max-h-48 mx-auto rounded-lg shadow-lg"
                />
              ) : (
                <div>
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-300">Click to select an image</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {mode === 'hide' && (
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Secret Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your secret message..."
                className="w-full h-32 px-3 py-2 bg-slate-800/50 backdrop-blur-xl border border-slate-600/50 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <p className="text-xs text-gray-400 mt-1">
                Max ~{selectedFile ? Math.floor((1000 * 1000) / 8) : 0} characters
              </p>
            </div>
          )}

          <button
            onClick={mode === 'hide' ? hideMessage : revealMessage}
            disabled={!selectedFile || (mode === 'hide' && !message) || processing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
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
          {/* Info Panel - Moved to Top */}
          <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-600/50 rounded-xl p-6 text-white shadow-xl">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4">How it works:</h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span className="text-gray-300">Uses LSB (Least Significant Bit) substitution</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span className="text-gray-300">Modifies the last bit of red channel pixels</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span className="text-gray-300">Changes are invisible to human eye</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span className="text-gray-300">Message is encoded in binary format</span>
              </li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              {mode === 'hide' ? 'Result Image' : 'Hidden Message'}
            </label>
            
            {mode === 'hide' && resultUrl && (
              <div className="space-y-4">
                <img
                  src={resultUrl}
                  alt="Result"
                  className="max-w-full rounded-lg border border-slate-600/50 shadow-lg"
                />
                <a
                  href={resultUrl}
                  download="steganography-result.png"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                  Download Image
                </a>
              </div>
            )}

            {mode === 'reveal' && revealedMessage && (
              <div className="p-4 bg-slate-800/50 backdrop-blur-xl rounded-lg border border-slate-600/50 shadow-lg">
                <p className="text-sm font-medium text-cyan-400 mb-2">Revealed Message:</p>
                <p className="text-gray-200 whitespace-pre-wrap font-mono">{revealedMessage}</p>
              </div>
            )}

            {/* Placeholder when no result */}
            {!resultUrl && !revealedMessage && (
              <div className="border-2 border-dashed border-slate-600/50 rounded-lg p-8 text-center bg-slate-800/30 backdrop-blur-xl">
                <div className="text-gray-400">
                  {mode === 'hide' ? (
                    <div>
                      <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <p className="text-sm">Result image will appear here</p>
                    </div>
                  ) : (
                    <div>
                      <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

export default ImageSteganography;
