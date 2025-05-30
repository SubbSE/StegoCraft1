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
        <div className="bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setMode('hide')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              mode === 'hide'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Hide Message
          </button>
          <button
            onClick={() => setMode('reveal')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              mode === 'reveal'
                ? 'bg-blue-600 text-white shadow-lg'
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
              Select Image
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Selected"
                  className="max-w-full max-h-48 mx-auto rounded-lg"
                />
              ) : (
                <div>
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">Click to select an image</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secret Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your secret message..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Max ~{selectedFile ? Math.floor((1000 * 1000) / 8) : 0} characters
              </p>
            </div>
          )}

          <button
            onClick={mode === 'hide' ? hideMessage : revealMessage}
            disabled={!selectedFile || (mode === 'hide' && !message) || processing}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
              {mode === 'hide' ? 'Result Image' : 'Hidden Message'}
            </label>
            
            {mode === 'hide' && resultUrl && (
              <div className="space-y-4">
                <img
                  src={resultUrl}
                  alt="Result"
                  className="max-w-full rounded-lg border border-gray-200"
                />
                <a
                  href={resultUrl}
                  download="steganography-result.png"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                  Download Image
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
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">How it works:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Uses LSB (Least Significant Bit) substitution</li>
              <li>• Modifies the last bit of red channel pixels</li>
              <li>• Changes are invisible to human eye</li>
              <li>• Message is encoded in binary format</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSteganography;
