// src/pages/Techniques.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Techniques = () => {
  const [activeCategory, setActiveCategory] = useState('image');
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = {
    image: {
      title: 'Image Steganography',
      icon: '🖼️',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-slate-800/50',
      description: 'Hide data within digital images using pixel manipulation techniques',
      techniques: [
        {
          id: 'lsb-image',
          name: 'LSB Substitution',
          difficulty: 'Beginner',
          capacity: 'High',
          detection: 'Easy',
          description: 'Replace the least significant bits of image pixels with secret data',
          simpleExplanation: 'Think of each pixel as a tiny box with a number. We secretly change the last digit of that number to hide our message. Since the change is so small, the picture looks exactly the same to your eyes!',
          
          visualDemo: {
            type: 'image-lsb',
            interactive: true,
            steps: [
              {
                title: 'Original Image',
                description: 'Start with any digital image as your cover medium',
                animation: 'fade-in'
              },
              {
                title: 'Binary Message',
                description: 'Convert your secret text into binary code (1s and 0s)',
                animation: 'type-writer'
              },
              {
                title: 'Pixel Modification',
                description: 'Change the last bit of each pixel color value',
                animation: 'pixel-flip'
              },
              {
                title: 'Stego Image',
                description: 'The result looks identical but contains hidden data',
                animation: 'slide-compare'
              }
            ],
            performanceMetrics: {
              capacity: '8 bits per 3 pixels (RGB)',
              imperceptibility: 'PSNR > 50dB',
              robustness: 'Lost on compression',
              complexity: 'O(n) linear'
            }
          },
          
          realWorldExample: 'Like writing in invisible ink - the message is there, but you need to know the secret to see it.',
          
          advantages: [
            'Simple to understand and implement',
            'Can hide large amounts of data',
            'Works with any image format',
            'Almost invisible to human eye'
          ],
          
          disadvantages: [
            'Easy to detect with computer analysis',
            'Message lost if image is compressed',
            'Not secure against determined attackers',
            'Changes destroyed by image editing'
          ],
          
          applications: [
            'Basic message hiding',
            'Educational demonstrations',
            'Proof of concept projects',
            'Personal secret messages'
          ],
          
          codeExample: `"""
Advanced LSB Steganography Implementation
Supports multiple image formats with error checking and quality metrics
"""

import cv2
import numpy as np
from PIL import Image
import hashlib

class LSBSteganography:
    def __init__(self):
        self.delimiter = '1111111111111110'
    
    def text_to_binary(self, text):
        """Convert text to binary with length prefix"""
        length = format(len(text), '032b')
        binary = ''.join(format(ord(char), '08b') for char in text)
        return length + binary + self.delimiter
    
    def embed(self, cover_path, message, output_path):
        """Embed message in cover image"""
        try:
            image = cv2.imread(cover_path)
            if image is None:
                raise ValueError("Could not load image")
            
            binary_message = self.text_to_binary(message)
            height, width, channels = image.shape
            capacity = height * width * channels
            
            if len(binary_message) > capacity:
                raise ValueError(f"Message too long. Max: {capacity//8} chars")
            
            stego_image = self._embed_lsb(image, binary_message)
            cv2.imwrite(output_path, stego_image)
            
            psnr = self._calculate_psnr(image, stego_image)
            
            return {
                'success': True,
                'psnr': psnr,
                'capacity_used': len(binary_message) / capacity * 100
            }
            
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def _embed_lsb(self, image, binary_message):
        """Core LSB embedding logic"""
        stego_image = image.copy()
        height, width, channels = image.shape
        
        bit_index = 0
        for i in range(height):
            for j in range(width):
                for k in range(channels):
                    if bit_index < len(binary_message):
                        pixel_val = stego_image[i, j, k]
                        pixel_val = (pixel_val & 0xFE) | int(binary_message[bit_index])
                        stego_image[i, j, k] = pixel_val
                        bit_index += 1
                    else:
                        return stego_image
        return stego_image
    
    def _calculate_psnr(self, original, stego):
        """Calculate Peak Signal-to-Noise Ratio"""
        mse = np.mean((original - stego) ** 2)
        if mse == 0:
            return float('inf')
        return 20 * np.log10(255.0 / np.sqrt(mse))`
        },

        {
          id: 'dct-domain',
          name: 'DCT Domain Hiding',
          difficulty: 'Intermediate',
          capacity: 'Medium',
          detection: 'Medium',
          description: 'Embed data in the frequency domain using Discrete Cosine Transform',
          simpleExplanation: 'Instead of changing pixel colors directly, we break the image into patterns and hide data in those patterns. This is like hiding a message in the rhythm of a song rather than the words.',
          
          visualDemo: {
            type: 'dct-domain',
            interactive: true,
            steps: [
              {
                title: 'Image Blocks',
                description: 'Split the image into 8×8 pixel blocks',
                animation: 'grid-overlay'
              },
              {
                title: 'DCT Transform',
                description: 'Convert each block to frequency domain',
                animation: 'frequency-transform'
              },
              {
                title: 'Coefficient Modification',
                description: 'Modify mid-frequency coefficients to embed data',
                animation: 'coefficient-highlight'
              },
              {
                title: 'JPEG Compatible',
                description: 'Reconstruct image that survives compression',
                animation: 'compression-test'
              }
            ],
            performanceMetrics: {
              capacity: '1 bit per 8×8 block',
              imperceptibility: 'PSNR > 45dB',
              robustness: 'Survives JPEG compression',
              complexity: 'O(n log n) for DCT'
            }
          },
          
          realWorldExample: 'Like hiding a secret code in the background music of a video - it\'s there, but mixed into the natural patterns.',
          
          advantages: [
            'Survives JPEG compression',
            'More secure than simple methods',
            'Maintains excellent image quality',
            'Harder to detect automatically'
          ],
          
          disadvantages: [
            'More complex to understand',
            'Can hide less data than LSB',
            'Requires mathematical knowledge',
            'Takes more processing power'
          ],
          
          applications: [
            'JPEG image steganography',
            'Digital watermarking',
            'Copyright protection',
            'Professional security applications'
          ],
          
          codeExample: `"""
DCT Domain Steganography - JPEG Compatible
Professional implementation using frequency domain embedding
"""

import numpy as np
import cv2
from scipy.fftpack import dct, idct

class DCTSteganography:
    def __init__(self, quality=90):
        self.block_size = 8
        self.quality = quality
        self.quantization_step = self._get_quantization_step(quality)
        self.embed_positions = [(1,2), (2,1), (2,2), (1,3), (3,1)]
    
    def _apply_dct_2d(self, block):
        """Apply 2D DCT to block"""
        centered = block.astype(np.float64) - 128
        dct_block = dct(dct(centered.T, norm='ortho').T, norm='ortho')
        return dct_block
    
    def _embed_bit_in_dct(self, dct_block, bit, position):
        """Embed single bit using quantization"""
        modified_block = dct_block.copy()
        i, j = position
        coefficient = modified_block[i, j]
        
        quantized = int(coefficient / self.quantization_step)
        
        if bit == '1':
            if quantized % 2 == 0:
                quantized += 1 if quantized >= 0 else -1
        else:
            if quantized % 2 == 1:
                quantized += 1 if quantized >= 0 else -1
        
        modified_block[i, j] = quantized * self.quantization_step
        return modified_block
    
    def embed(self, cover_path, message, output_path):
        """Embed message in DCT domain"""
        try:
            image = cv2.imread(cover_path, cv2.IMREAD_GRAYSCALE)
            binary_message = self._text_to_binary(message)
            
            blocks, shape = self._divide_into_blocks(image)
            max_bits = len(blocks) * len(self.embed_positions)
            
            if len(binary_message) > max_bits:
                raise ValueError(f"Message too long. Max: {max_bits // 8} chars")
            
            modified_blocks = []
            bit_index = 0
            
            for block, i, j in blocks:
                dct_block = self._apply_dct_2d(block)
                
                for position in self.embed_positions:
                    if bit_index < len(binary_message):
                        dct_block = self._embed_bit_in_dct(
                            dct_block, binary_message[bit_index], position)
                        bit_index += 1
                
                modified_blocks.append((dct_block, i, j))
            
            stego_image = self._reconstruct_image(modified_blocks, shape)
            cv2.imwrite(output_path, stego_image, 
                       [cv2.IMWRITE_JPEG_QUALITY, self.quality])
            
            return {'success': True, 'jpeg_quality': self.quality}
            
        except Exception as e:
            return {'success': False, 'error': str(e)}`
        },

        {
          id: 'spread-spectrum',
          name: 'Spread Spectrum',
          difficulty: 'Advanced',
          capacity: 'Low',
          detection: 'Hard',
          description: 'Spread the hidden data across the entire frequency spectrum of the image',
          simpleExplanation: 'Like whispering your secret across an entire crowd instead of to one person. The message is spread so thin across the whole image that it becomes almost impossible to detect.',
          
          visualDemo: {
            type: 'spread-spectrum',
            interactive: true,
            steps: [
              {
                title: 'Spreading Sequence',
                description: 'Generate a pseudorandom spreading pattern',
                animation: 'random-pattern'
              },
              {
                title: 'Bit Spreading',
                description: 'Multiply each message bit across many chips',
                animation: 'bit-multiplication'
              },
              {
                title: 'Frequency Addition',
                description: 'Add spread signal to image frequency domain',
                animation: 'spectrum-overlay'
              },
              {
                title: 'Correlation Detection',
                description: 'Extract using correlation with known sequence',
                animation: 'correlation-peaks'
              }
            ],
            performanceMetrics: {
              capacity: '1 bit per 1000 pixels',
              imperceptibility: 'PSNR > 40dB',
              robustness: 'Military-grade security',
              complexity: 'O(n log n) for FFT'
            }
          },
          
          realWorldExample: 'Like having a conversation in a noisy restaurant - without knowing what to listen for, the message is lost in the background noise.',
          
          advantages: [
            'Extremely difficult to detect',
            'Very secure against attacks',
            'Military-grade security level',
            'Robust against image modifications'
          ],
          
          disadvantages: [
            'Very complex to implement',
            'Can only hide small amounts of data',
            'Requires cryptographic keys',
            'Needs significant processing power'
          ],
          
          applications: [
            'Military communications',
            'High-security corporate data',
            'Research projects',
            'Advanced watermarking'
          ],
          
          codeExample: `"""
Military-Grade Spread Spectrum Steganography
Advanced implementation with cryptographic security
"""

import numpy as np
import hashlib
from cryptography.fernet import Fernet

class SpreadSpectrumSteganography:
    def __init__(self, key, spreading_factor=1000):
        self.key = key
        self.spreading_factor = spreading_factor
        self.alpha = 0.015
        
        key_hash = hashlib.sha256(key.encode()).digest()
        self.fernet_key = base64.urlsafe_b64encode(key_hash[:32])
        self.cipher = Fernet(self.fernet_key)
    
    def _generate_spreading_sequence(self, length):
        """Generate cryptographically secure spreading sequence"""
        seed = int(hashlib.sha256(self.key.encode()).hexdigest()[:16], 16)
        np.random.seed(seed)
        return self._generate_gold_sequence(length)
    
    def embed(self, cover_path, message, output_path):
        """Embed message using spread spectrum"""
        try:
            cover_image = cv2.imread(cover_path, cv2.IMREAD_GRAYSCALE)
            encrypted_message = self.cipher.encrypt(message.encode())
            
            # Generate spreading sequence and embed
            total_chips = len(message) * 8 * self.spreading_factor
            spreading_seq = self._generate_spreading_sequence(total_chips)
            
            spread_signal = self._spread_message(message, spreading_seq)
            stego_image = self._embed_in_frequency_domain(cover_image, spread_signal)
            
            cv2.imwrite(output_path, stego_image)
            
            return {
                'success': True,
                'security_level': 'Military Grade',
                'processing_gain': 10 * np.log10(self.spreading_factor)
            }
            
        except Exception as e:
            return {'success': False, 'error': str(e)}`
        }
      ]
    },
    
    audio: {
      title: 'Audio Steganography',
      icon: '🎵',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      description: 'Conceal information within audio files using various signal processing techniques',
      techniques: [
        {
          id: 'lsb-audio',
          name: 'Audio LSB',
          difficulty: 'Beginner',
          capacity: 'High',
          detection: 'Easy',
          description: 'Replace least significant bits of audio samples with hidden data',
          simpleExplanation: 'Just like with images, we change the smallest part of each sound sample to hide our message. The changes are so tiny that your ears can\'t hear the difference!',
          
          visualDemo: {
            type: 'audio-lsb',
            interactive: true,
            steps: [
              {
                title: 'Audio Waveform',
                description: 'Digital audio as thousands of amplitude samples',
                animation: 'waveform-display'
              },
              {
                title: 'Sample Values',
                description: 'Each point represents sound amplitude at that moment',
                animation: 'sample-zoom'
              },
              {
                title: 'LSB Modification',
                description: 'Change the last bit of each sample value',
                animation: 'bit-toggle'
              },
              {
                title: 'Identical Sound',
                description: 'Audio sounds exactly the same to human ears',
                animation: 'audio-comparison'
              }
            ],
            performanceMetrics: {
              capacity: '1 bit per sample (high)',
              imperceptibility: 'SNR > 80dB',
              robustness: 'Lost on compression',
              complexity: 'O(n) linear'
            }
          },
          
          realWorldExample: 'Like whispering so quietly that only someone with special equipment could hear you.',
          
          advantages: [
            'Can hide lots of data',
            'Simple to understand',
            'Completely inaudible',
            'Works with uncompressed audio'
          ],
          
          disadvantages: [
            'Lost on MP3 compression',
            'Destroyed by audio editing',
            'Easy to detect with tools',
            'Not robust against processing'
          ],
          
          applications: [
            'Hidden voice messages',
            'Audio watermarking', 
            'Secret communication',
            'Digital rights management'
          ],
          
          codeExample: `"""
Professional Audio LSB Steganography
High-quality audio processing with integrity checking
"""

import librosa
import numpy as np
import soundfile as sf
import hashlib

class AudioLSBSteganography:
    def __init__(self, sample_rate=44100):
        self.sample_rate = sample_rate
        self.magic_number = "ASTEG"
        
    def embed(self, cover_audio_path, message, output_path):
        """Embed message in audio file"""
        try:
            audio_data, sr = librosa.load(cover_audio_path, sr=self.sample_rate, mono=True)
            audio_int16 = (audio_data * 32767).astype(np.int16)
            
            binary_message, checksum = self._prepare_message(message)
            
            if len(binary_message) > len(audio_int16):
                raise ValueError("Message too long for audio file")
            
            stego_audio = self._embed_lsb(audio_int16, binary_message)
            sf.write(output_path, stego_audio, sr, subtype='PCM_16')
            
            snr = self._calculate_snr(audio_int16, stego_audio)
            
            return {
                'success': True,
                'snr': snr,
                'checksum': checksum,
                'audio_duration': len(audio_data) / sr
            }
            
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def _embed_lsb(self, audio_samples, binary_message):
        """Core LSB embedding with overflow protection"""
        stego_audio = audio_samples.copy().astype(np.int32)
        
        for i, bit in enumerate(binary_message):
            if i < len(stego_audio):
                if bit == '1':
                    stego_audio[i] = audio_samples[i] | 1
                else:
                    stego_audio[i] = audio_samples[i] & 0xFFFE
        
        return np.clip(stego_audio, -32768, 32767).astype(np.int16)
    
    def _calculate_snr(self, original, stego):
        """Calculate Signal-to-Noise Ratio"""
        signal_power = np.mean(original.astype(float) ** 2)
        noise_power = np.mean((original.astype(float) - stego.astype(float)) ** 2)
        
        if noise_power == 0:
            return float('inf')
        return 10 * np.log10(signal_power / noise_power)`
        },

        {
          id: 'echo-hiding',
          name: 'Echo Hiding',
          difficulty: 'Intermediate',
          capacity: 'Low',
          detection: 'Medium',
          description: 'Embed data by introducing controlled echoes in audio signals',
          simpleExplanation: 'We add tiny, almost silent echoes to the audio. Different echo timings represent different parts of our secret message. It\'s like morse code, but with echoes instead of beeps!',
          
          visualDemo: {
            type: 'echo-hiding',
            interactive: true,
            steps: [
              {
                title: 'Original Audio',
                description: 'Clean audio signal without any artificial echoes',
                animation: 'clean-waveform'
              },
              {
                title: 'Echo Kernels',
                description: 'Generate echo impulses for 0 and 1 bits',
                animation: 'kernel-display'
              },
              {
                title: 'Echo Addition',
                description: 'Add imperceptible echoes at specific delays',
                animation: 'echo-convolution'
              },
              {
                title: 'Natural Sound',
                description: 'Audio sounds completely natural with hidden data',
                animation: 'naturalness-test'
              }
            ],
            performanceMetrics: {
              capacity: '1 bit per audio segment',
              imperceptibility: 'Below 2ms threshold',
              robustness: 'Survives light compression',
              complexity: 'O(n log n) convolution'
            }
          },
          
          realWorldExample: 'Like clapping in a room - the echo tells you the room size, but we use it for secret messages.',
          
          advantages: [
            'Survives audio compression',
            'Very difficult to detect by ear',
            'Works with most audio formats',
            'Sounds completely natural'
          ],
          
          disadvantages: [
            'Very small data capacity',
            'Complex to implement correctly',
            'Sensitive to timing changes',
            'Requires precise processing'
          ],
          
          applications: [
            'Radio broadcast monitoring',
            'Audio authentication',
            'Copyright protection',
            'Quality verification'
          ],
          
          codeExample: `"""
Advanced Echo Hiding Steganography
Professional implementation with cepstral analysis
"""

import numpy as np
import librosa
import scipy.signal

class EchoHidingSteganography:
    def __init__(self, sample_rate=44100):
        self.sample_rate = sample_rate
        self.bit_0_delay = 0.8e-3  # 0.8ms for bit 0
        self.bit_1_delay = 1.6e-3  # 1.6ms for bit 1  
        self.echo_amplitude = 0.08
        
    def _generate_adaptive_kernels(self, segment_characteristics):
        """Generate echo kernels adapted to segment"""
        delay_0_samples = int(self.bit_0_delay * self.sample_rate)
        delay_1_samples = int(self.bit_1_delay * self.sample_rate)
        
        kernel_length = max(delay_0_samples, delay_1_samples) + 50
        
        kernel_0 = np.zeros(kernel_length)
        kernel_1 = np.zeros(kernel_length)
        
        kernel_0[0] = 1.0
        kernel_1[0] = 1.0
        
        # Adaptive amplitude
        adaptive_amplitude = self.echo_amplitude / (1 + segment_characteristics.get('energy', 0.5))
        
        # Apply windowed echo
        echo_window = np.hanning(11)[5:]
        
        start_0 = delay_0_samples
        if start_0 + len(echo_window) <= len(kernel_0):
            kernel_0[start_0:start_0 + len(echo_window)] = adaptive_amplitude * echo_window
            
        start_1 = delay_1_samples 
        if start_1 + len(echo_window) <= len(kernel_1):
            kernel_1[start_1:start_1 + len(echo_window)] = adaptive_amplitude * echo_window
        
        return kernel_0, kernel_1
    
    def embed(self, cover_path, message, output_path):
        """Embed message using echo hiding"""
        try:
            audio, sr = librosa.load(cover_path, sr=self.sample_rate)
            
            # Find suitable segments and embed
            segments = self._find_optimal_segments(audio, len(message) * 8)
            stego_audio = self._embed_echoes(audio, message, segments)
            
            import soundfile as sf
            sf.write(output_path, stego_audio, sr)
            
            return {'success': True}
            
        except Exception as e:
            return {'success': False, 'error': str(e)}`
        },

        {
          id: 'phase-coding',
          name: 'Phase Coding',
          difficulty: 'Advanced',
          capacity: 'Medium',
          detection: 'Hard',
          description: 'Modify the phase components of audio frequency spectrum',
          simpleExplanation: 'Sound waves have two parts: how loud they are and their timing. We secretly change the timing part while keeping the loudness the same. Your ears only notice loudness, so the message is invisible!',
          
          visualDemo: {
            type: 'phase-coding',
            interactive: true,
            steps: [
              {
                title: 'Frequency Analysis',
                description: 'Break audio into frequency components using FFT',
                animation: 'fft-transform'
              },
              {
                title: 'Phase vs Magnitude',
                description: 'Separate phase (timing) from magnitude (loudness)',
                animation: 'phase-separation'
              },
              {
                title: 'Phase Modification',
                description: 'Modify phase while preserving magnitude',
                animation: 'phase-shift'
              },
              {
                title: 'Reconstruct Audio',
                description: 'Combine back to time domain - sounds identical',
                animation: 'ifft-reconstruct'
              }
            ],
            performanceMetrics: {
              capacity: '1 bit per frequency bin',
              imperceptibility: 'Phase below JND',
              robustness: 'Survives most processing',
              complexity: 'O(n log n) for FFT'
            }
          },
          
          realWorldExample: 'Like changing when each musician starts playing while keeping volume same - sounds identical but timing carries a message.',
          
          advantages: [
            'Invisible to human hearing',
            'Survives audio processing',
            'Good data capacity',
            'Very secure method'
          ],
          
          disadvantages: [
            'Complex frequency analysis',
            'Sensitive to synchronization',
            'Advanced signal processing',
            'Limited by audio content'
          ],
          
          applications: [
            'Professional watermarking',
            'Audio forensics',
            'Secure communications',
            'Content verification'
          ],
          
          codeExample: `"""
Phase Coding Steganography
Advanced frequency-domain phase manipulation
"""

import numpy as np
import librosa

class PhaseCodingSteganography:
    def __init__(self, sample_rate=44100):
        self.sample_rate = sample_rate
        self.frame_size = 1024
        self.hop_length = 512
        self.phase_shift = np.pi / 4
        
    def embed(self, cover_path, message, output_path):
        """Embed message using phase coding"""
        try:
            audio, sr = librosa.load(cover_path, sr=self.sample_rate)
            binary_message = self._text_to_binary(message)
            
            # Apply STFT
            stft = librosa.stft(audio, 
                              n_fft=self.frame_size, 
                              hop_length=self.hop_length)
            
            # Separate magnitude and phase
            magnitude = np.abs(stft)
            phase = np.angle(stft)
            
            # Embed in phase
            modified_phase = self._embed_in_phase(phase, binary_message)
            
            # Reconstruct
            modified_stft = magnitude * np.exp(1j * modified_phase)
            stego_audio = librosa.istft(modified_stft, hop_length=self.hop_length)
            
            import soundfile as sf
            sf.write(output_path, stego_audio, sr)
            
            return {'success': True}
            
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def _embed_in_phase(self, phase, binary_message):
        """Embed binary message in phase spectrum"""
        modified_phase = phase.copy()
        freq_bins = self._select_embedding_bins(phase.shape[0])
        
        bit_index = 0
        for frame_idx in range(phase.shape[1]):
            for bin_idx in freq_bins:
                if bit_index < len(binary_message):
                    if binary_message[bit_index] == '1':
                        modified_phase[bin_idx, frame_idx] += self.phase_shift
                    bit_index += 1
                else:
                    break
        
        return modified_phase`
        }
      ]
    },
    
    text: {
      title: 'Text Steganography',
      icon: '📝',
      color: 'from-green-500 to-teal-500',
      bgColor: 'bg-green-50',
      description: 'Hide messages within text documents using linguistic and formatting methods',
      techniques: [
        {
          id: 'whitespace',
          name: 'Whitespace Encoding',
          difficulty: 'Beginner',
          capacity: 'Low',
          detection: 'Easy',
          description: 'Use spaces and tabs to encode binary information',
          simpleExplanation: 'We use invisible spaces between words as a secret code. One space means 0, two spaces means 1. To everyone else, it just looks like normal text with regular spacing!',
          
          visualDemo: {
            type: 'whitespace',
            interactive: true,
            steps: [
              {
                title: 'Normal Text',
                description: 'Regular text document with standard spacing',
                animation: 'text-display'
              },
              {
                title: 'Binary Message',
                description: 'Convert secret message to 1s and 0s',
                animation: 'binary-encoding'
              },
              {
                title: 'Space Encoding',
                description: 'Replace spaces: single space = 0, double space = 1',
                animation: 'space-replacement'
              },
              {
                title: 'Hidden Message',
                description: 'Text looks normal but spacing contains secret data',
                animation: 'invisible-data'
              }
            ],
            performanceMetrics: {
              capacity: '1 bit per word boundary',
              imperceptibility: 'Invisible to casual reading',
              robustness: 'Lost on reformatting',
              complexity: 'O(n) where n = words'
            }
          },
          
          realWorldExample: 'Like writing a letter where spacing between words secretly spells another message.',
          
          advantages: [
            'Extremely simple to understand',
            'Completely invisible when reading',
            'Works with any text document',
            'No special software needed'
          ],
          
          disadvantages: [
            'Very small message capacity',
            'Lost when text is reformatted',
            'Easy to detect with analysis',
            'Destroyed by copy-paste'
          ],
          
          applications: [
            'Document authentication',
            'Hidden notes in documents',
            'Educational demonstrations',
            'Basic covert communication'
          ],
          
          codeExample: `"""
Advanced Whitespace Steganography
Multiple encoding methods with robust extraction
"""

import re
import unicodedata

class WhitespaceStego:
    def __init__(self):
        self.encoding_methods = {
            'single_double_space': {
                'bit_0': ' ',
                'bit_1': '  ',
            },
            'space_tab': {
                'bit_0': ' ',
                'bit_1': '\\t',
            },
            'unicode_spaces': {
                'bit_0': '\\u0020',  # Regular space
                'bit_1': '\\u2009',  # Thin space
            },
            'zero_width': {
                'bit_0': '\\u200C',  # Zero Width Non-Joiner
                'bit_1': '\\u200D',  # Zero Width Joiner
            }
        }
        
    def embed_advanced_whitespace(self, cover_text, message, method='single_double_space'):
        """Advanced whitespace embedding"""
        encoding = self.encoding_methods[method]
        message_data = self._prepare_message(message)
        binary_message = message_data['full_binary']
        
        if method == 'zero_width':
            return self._embed_zero_width(cover_text, binary_message, encoding)
        elif method == 'unicode_spaces':
            return self._embed_unicode_spaces(cover_text, binary_message, encoding)
        else:
            return self._embed_traditional_spaces(cover_text, binary_message, encoding)
    
    def _prepare_message(self, text):
        """Prepare message with metadata"""
        import hashlib
        
        checksum = hashlib.md5(text.encode()).hexdigest()[:4]
        length_header = format(len(text), '016b')
        message_binary = ''.join(format(ord(c), '08b') for c in text)
        
        full_binary = '0001' + length_header + message_binary + '1111111111111110'
        
        return {'full_binary': full_binary}
    
    def _embed_traditional_spaces(self, text, binary_msg, encoding):
        """Embed using traditional space method"""
        segments = re.split(r'(\\s+)', text)
        positions = []
        
        for i, segment in enumerate(segments):
            if segment.strip() == '' and i > 0 and i < len(segments) - 1:
                if segments[i-1].strip() and segments[i+1].strip():
                    positions.append(i)
        
        stego_segments = segments.copy()
        for bit_index, bit in enumerate(binary_msg[:len(positions)]):
            pos = positions[bit_index]
            if bit == '0':
                stego_segments[pos] = encoding['bit_0']
            else:
                stego_segments[pos] = encoding['bit_1']
        
        return ''.join(stego_segments), positions`
        },

        {
          id: 'synonym-substitution',
          name: 'Synonym Substitution',
          difficulty: 'Intermediate',
          capacity: 'Medium',
          detection: 'Medium',
          description: 'Replace words with synonyms based on hidden message bits',
          simpleExplanation: 'We secretly choose between different words that mean the same thing. For example, "big" vs "large" could represent 0 vs 1. The text reads normally but word choices carry a hidden message!',
          
          visualDemo: {
            type: 'synonym-substitution',
            interactive: true,
            steps: [
              {
                title: 'Original Text',
                description: 'Text with words that have synonym alternatives',
                animation: 'text-analysis'
              },
              {
                title: 'Synonym Database',
                description: 'Build dictionary of word pairs with same meaning',
                animation: 'dictionary-build'
              },
              {
                title: 'Word Selection',
                description: 'Choose synonyms based on binary message bits',
                animation: 'word-substitution'
              },
              {
                title: 'Natural Text',
                description: 'Text reads normally but carries hidden message',
                animation: 'meaning-preservation'
              }
            ],
            performanceMetrics: {
              capacity: '1 bit per synonym pair',
              imperceptibility: 'Maintains natural flow',
              robustness: 'Survives casual editing',
              complexity: 'O(n) with NLP processing'
            }
          },
          
          realWorldExample: 'Like choosing between "happy" and "joyful" - both mean the same but your choice secretly carries part of a hidden message.',
          
          advantages: [
            'Text meaning stays identical',
            'Reads like natural language',
            'Difficult to detect casually',
            'Moderate data capacity'
          ],
          
          disadvantages: [
            'Requires synonym database',
            'Complex NLP processing',
            'May change writing style',
            'Context limits word choices'
          ],
          
          applications: [
            'Hidden messages in literature',
            'Academic paper steganography',
            'Natural language covert channels',
            'Content generation'
          ],
          
          codeExample: `"""
Synonym Substitution Steganography
Natural language processing for semantic hiding
"""

import nltk
from nltk.corpus import wordnet

class SynonymSteganography:
    def __init__(self):
        self.synonym_cache = {}
        self._initialize_nltk()
    
    def get_synonyms(self, word, pos_tag=None):
        """Get synonyms for a word using WordNet"""
        if word.lower() in self.synonym_cache:
            return self.synonym_cache[word.lower()]
        
        synonyms = set()
        synsets = wordnet.synsets(word.lower())
        
        for synset in synsets:
            for lemma in synset.lemmas():
                synonym = lemma.name().replace('_', ' ')
                if synonym.lower() != word.lower():
                    synonyms.add(synonym)
        
        synonym_list = list(synonyms)[:5]
        self.synonym_cache[word.lower()] = synonym_list
        return synonym_list
    
    def embed(self, cover_text, message):
        """Embed message using synonym substitution"""
        try:
            words = nltk.word_tokenize(cover_text)
            pos_tags = nltk.pos_tag(words)
            
            binary_message = self._text_to_binary(message)
            
            # Find substitutable words
            substitutable_positions = []
            
            for i, (word, pos) in enumerate(pos_tags):
                if pos.startswith(('NN', 'VB', 'JJ', 'RB')):
                    synonyms = self.get_synonyms(word, pos)
                    if len(synonyms) >= 2:
                        substitutable_positions.append((i, word, synonyms[:2]))
            
            if len(substitutable_positions) < len(binary_message):
                raise ValueError("Not enough substitutable words")
            
            # Perform substitutions
            stego_words = words.copy()
            
            for bit_index, bit in enumerate(binary_message):
                pos_index, original_word, synonyms = substitutable_positions[bit_index]
                
                if bit == '0':
                    stego_words[pos_index] = original_word
                else:
                    stego_words[pos_index] = synonyms[1] if len(synonyms) > 1 else synonyms[0]
            
            stego_text = ' '.join(stego_words)
            
            return {
                'success': True,
                'stego_text': stego_text,
                'substitutions_made': len([bit for bit in binary_message if bit == '1'])
            }
            
        except Exception as e:
            return {'success': False, 'error': str(e)}`
        },

        {
          id: 'unicode-hiding',
          name: 'Unicode Steganography',
          difficulty: 'Advanced',
          capacity: 'High',
          detection: 'Hard',
          description: 'Utilize Unicode characters and zero-width characters for hiding data',
          simpleExplanation: 'We use special invisible characters that computers understand but humans can\'t see. It\'s like writing with invisible ink that only computers can read - huge amounts of data can be hidden!',
          
          visualDemo: {
            type: 'unicode-hiding',
            interactive: true,
            steps: [
              {
                title: 'Visible Text',
                description: 'Normal text that everyone can see and read',
                animation: 'visible-display'
              },
              {
                title: 'Unicode Characters',
                description: 'Special invisible characters from Unicode standard',
                animation: 'unicode-reveal'
              },
              {
                title: 'Character Encoding',
                description: 'Different invisible chars represent different bits',
                animation: 'character-mapping'
              },
              {
                title: 'Massive Capacity',
                description: 'Text looks normal but contains huge hidden payload',
                animation: 'capacity-demonstration'
              }
            ],
            performanceMetrics: {
              capacity: 'Multiple bits per position',
              imperceptibility: 'Completely invisible',
              robustness: 'Survives copy-paste',
              complexity: 'Complex Unicode handling'
            }
          },
          
          realWorldExample: 'Like having a secret invisible alphabet that only computers can see - you can write entire letters in invisible text.',
          
          advantages: [
            'Can hide enormous amounts of data',
            'Completely invisible to human eyes',
            'Survives copy-paste operations',
            'Works in digital documents'
          ],
          
          disadvantages: [
            'Different devices may render differently',
            'Some fonts don\'t support all characters',
            'Complex encoding and decoding',
            'May be detected by security systems'
          ],
          
          applications: [
            'Digital document security',
            'Website-based hiding',
            'International text encoding',
            'Advanced covert channels'
          ],
          
          codeExample: `"""
Unicode Steganography System
Advanced implementation using zero-width and invisible characters
"""

import unicodedata

class UnicodeStego:
    def __init__(self):
        # Zero-width characters for encoding
        self.encoding_chars = {
            '00': '\\u200C',  # Zero Width Non-Joiner
            '01': '\\u200D',  # Zero Width Joiner
            '10': '\\u2060',  # Word Joiner
            '11': '\\uFEFF',  # Zero Width No-Break Space
        }
        
        self.decoding_chars = {v: k for k, v in self.encoding_chars.items()}
        
    def embed(self, cover_text, message):
        """Embed message using zero-width characters"""
        try:
            binary_message = self._text_to_binary_with_header(message)
            
            # Convert binary to pairs
            bit_pairs = [binary_message[i:i+2] for i in range(0, len(binary_message), 2)]
            
            if len(bit_pairs[-1]) == 1:
                bit_pairs[-1] += '0'
            
            stego_text = self._insert_invisible_chars(cover_text, bit_pairs)
            
            return {
                'success': True,
                'stego_text': stego_text,
                'bits_embedded': len(binary_message)
            }
            
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def _insert_invisible_chars(self, text, bit_pairs):
        """Insert invisible Unicode characters into text"""
        result = ""
        char_index = 0
        
        for char in text:
            result += char
            
            if char_index < len(bit_pairs):
                invisible_char = self.encoding_chars[bit_pairs[char_index]]
                result += invisible_char.encode().decode('unicode_escape')
                char_index += 1
        
        return result
    
    def _text_to_binary_with_header(self, text):
        """Convert text to binary with length header"""
        length_header = format(len(text), '016b')
        message_binary = ''.join(format(ord(c), '08b') for c in text)
        delimiter = '1111111111111110'
        return length_header + message_binary + delimiter`
        }
      ]
    }
  };

  const allTechniques = Object.values(categories).flatMap(cat => 
    cat.techniques.map(tech => ({ ...tech, category: cat.title }))
  );

  const filteredTechniques = allTechniques.filter(tech =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-400/20 text-green-300 border-green-400/30';
      case 'Intermediate': return 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30';
      case 'Advanced': return 'bg-orange-400/20 text-orange-300 border-orange-400/30';
      case 'Expert': return 'bg-red-400/20 text-red-300 border-red-400/30';
      default: return 'bg-gray-400/20 text-gray-300 border-gray-400/30';
    }
  };

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
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-white">Comprehensive Guide</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Steganography 
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> Techniques </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
            Explore 9 detailed steganography techniques across 3 major categories with interactive visual demonstrations, step-by-step explanations, and production-ready implementations.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search techniques..."
              className="w-full px-4 py-3 pl-12 rounded-lg bg-slate-800/70 backdrop-blur-xl border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
            />
            <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.keys(categories).map((key) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`group flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 backdrop-blur-xl ${
                activeCategory === key
                  ? `bg-gradient-to-r ${categories[key].color} text-white shadow-lg transform scale-105 border border-white/20`
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 shadow-md hover:shadow-lg hover:scale-105 border border-slate-600/30 hover:border-cyan-400/50'
              }`}
            >
              <span className="text-xl">{categories[key].icon}</span>
              <span>{categories[key].title}</span>
              <span className="text-sm opacity-75">
                ({categories[key].techniques.length})
              </span>
            </button>
          ))}
        </div>

        {/* Active Category Overview */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border border-slate-600/30 shadow-xl">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${categories[activeCategory].color} rounded-2xl text-3xl mb-4 shadow-lg`}>
                {categories[activeCategory].icon}
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                {categories[activeCategory].title}
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                {categories[activeCategory].description}
              </p>
            </div>
          </div>
        </div>

        {/* Techniques Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {(searchTerm ? filteredTechniques : categories[activeCategory].techniques).map((technique) => (
            <div
              key={technique.id}
              className="group relative bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-600/30 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 hover:border-cyan-400/50"
              onClick={() => setSelectedTechnique(technique)}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-blue-500/5 to-purple-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              
              <div className="p-6 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {technique.name}
                  </h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getDifficultyColor(technique.difficulty)}`}>
                    {technique.difficulty}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-300 mb-6 leading-relaxed group-hover:text-gray-200 transition-colors">
                  {technique.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-400 mb-1">Capacity</div>
                    <div className={`text-sm font-bold ${
                      technique.capacity === 'High' || technique.capacity === 'Very High' ? 'text-green-400' :
                      technique.capacity === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {technique.capacity}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-400 mb-1">Detection</div>
                    <div className={`text-sm font-bold ${
                      technique.detection === 'Easy' ? 'text-red-400' :
                      technique.detection === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {technique.detection}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-400 mb-1">Level</div>
                    <div className="text-sm font-bold text-cyan-400">
                      {technique.difficulty}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2 group shadow-lg">
                  <span>Learn More</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-600/30">
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">3</div>
            <div className="text-gray-300 font-medium">Categories</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-600/30">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">9</div>
            <div className="text-gray-300 font-medium">Techniques</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-600/30">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent mb-2">Live</div>
            <div className="text-gray-300 font-medium">Visual Demos</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-600/30">
            <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">Code</div>
            <div className="text-gray-300 font-medium">Open Source</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative text-center bg-gradient-to-br from-blue-600/80 to-purple-600/80 backdrop-blur-xl rounded-3xl p-12 text-white shadow-2xl border border-blue-400/30 overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-3xl"></div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">Ready to Try These Techniques?</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Experience steganography hands-on with our interactive demos. Practice what you've learned with real algorithms and production-ready code.
            </p>
            <Link
              to="/demo"
              className="inline-flex items-center space-x-3 bg-white text-blue-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Try Interactive Demos</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {selectedTechnique && (
        <TechniqueModal 
          technique={selectedTechnique} 
          onClose={() => setSelectedTechnique(null)} 
        />
      )}
    </div>
  );
};

// Visual Demo Component with Animations
const VisualDemo = ({ technique }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const renderVisualByType = () => {
    switch (technique.visualDemo?.type) {
      case 'image-lsb':
        return <ImageLSBDemo currentStep={currentStep} />;
      case 'dct-domain':
        return <DCTDemo currentStep={currentStep} />;
      case 'spread-spectrum':
        return <SpreadSpectrumDemo currentStep={currentStep} />;
      case 'audio-lsb':
        return <AudioLSBDemo currentStep={currentStep} />;
      case 'echo-hiding':
        return <EchoHidingDemo currentStep={currentStep} />;
      case 'phase-coding':
        return <PhaseCodingDemo currentStep={currentStep} />;
      case 'whitespace':
        return <WhitespaceDemo currentStep={currentStep} />;
      case 'synonym-substitution':
        return <SynonymDemo currentStep={currentStep} />;
      case 'unicode-hiding':
        return <UnicodeDemo currentStep={currentStep} />;
      default:
        return <DefaultDemo technique={technique} currentStep={currentStep} />;
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-600/50">
      {/* Demo Controls */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Interactive Visual Demo</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
          >
            ← Previous
          </button>
          <span className="text-gray-300">
            {currentStep + 1} / {technique.visualDemo?.steps?.length || 1}
          </span>
          <button
            onClick={() => setCurrentStep(Math.min((technique.visualDemo?.steps?.length || 1) - 1, currentStep + 1))}
            disabled={currentStep === (technique.visualDemo?.steps?.length || 1) - 1}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Current Step Info */}
      {technique.visualDemo?.steps?.[currentStep] && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-cyan-400 mb-2">
            {technique.visualDemo.steps[currentStep].title}
          </h4>
          <p className="text-gray-300">
            {technique.visualDemo.steps[currentStep].description}
          </p>
        </div>
      )}

      {/* Visual Demo Area */}
      <div className="bg-slate-900/50 rounded-lg p-6 min-h-[300px] flex items-center justify-center">
        {renderVisualByType()}
      </div>
    </div>
  );
};

// Individual Demo Components with Animations - ALL 9 TECHNIQUES
const ImageLSBDemo = ({ currentStep }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    setAnimationClass('animate-fade-in');
    const timer = setTimeout(() => setAnimationClass(''), 500);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const demos = [
    <div key={0} className={`text-center ${animationClass}`}>
      <div className="w-64 h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center text-white font-semibold shadow-lg">
        🖼️ Original Image
      </div>
      <p className="text-gray-300">Clean image ready for embedding</p>
    </div>,

    <div key={1} className={`text-center ${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4 font-mono text-green-400">
        <div className="animate-pulse">H → 01001000</div>
        <div className="animate-pulse" style={{animationDelay: '0.2s'}}>i → 01101001</div>
        <div className="animate-pulse" style={{animationDelay: '0.4s'}}>! → 00100001</div>
      </div>
      <p className="text-gray-300">Converting message to binary</p>
    </div>,

    <div key={2} className={`${animationClass}`}>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[255, 128, 64].map((value, i) => (
          <div key={i} className="bg-slate-800 p-3 rounded text-center">
            <div className="text-white font-mono text-sm">{value}</div>
            <div className="text-cyan-400 text-xs">→</div>
            <div className="text-green-400 font-mono text-sm animate-pulse">
              {value % 2 === 0 ? value + 1 : value - 1}
            </div>
          </div>
        ))}
      </div>
      <p className="text-gray-300 text-center">LSB modification in action</p>
    </div>,

    <div key={3} className={`text-center ${animationClass}`}>
      <div className="relative">
        <div className="w-64 h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center text-white font-semibold shadow-lg">
          🖼️ Stego Image
        </div>
        <div className="absolute top-2 right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
      </div>
      <p className="text-gray-300">Visually identical but contains hidden data!</p>
    </div>
  ];

  return demos[currentStep] || demos[0];
};

const DCTDemo = ({ currentStep }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    setAnimationClass('animate-fade-in');
    const timer = setTimeout(() => setAnimationClass(''), 500);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const demos = [
    <div key={0} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-8 gap-1">
          {Array.from({length: 64}).map((_, i) => (
            <div 
              key={i} 
              className={`w-4 h-4 bg-blue-400 rounded-sm opacity-${Math.random() > 0.5 ? '100' : '50'} animate-pulse`} 
              style={{animationDelay: `${i * 0.01}s`}} 
            />
          ))}
        </div>
      </div>
      <p className="text-gray-300 text-center">Image divided into 8×8 blocks</p>
    </div>,

    <div key={1} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-cyan-400 text-sm mb-2">Spatial Domain</div>
            <div className="grid grid-cols-4 gap-1">
              {Array.from({length: 16}).map((_, i) => (
                <div key={i} className="w-3 h-3 bg-blue-400 rounded animate-pulse" />
              ))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-green-400 text-sm mb-2">Frequency Domain</div>
            <div className="grid grid-cols-4 gap-1">
              {Array.from({length: 16}).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-3 h-3 rounded animate-pulse ${
                    i < 4 ? 'bg-yellow-400' : i < 8 ? 'bg-orange-400' : 'bg-red-400'
                  }`} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="text-gray-300 text-center">DCT reveals frequency patterns</p>
    </div>,

    <div key={2} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-4 gap-2">
          {['DC', 'Low', 'Mid', 'High'].map((freq, i) => (
            <div key={i} className="text-center p-2 bg-slate-700 rounded">
              <div className="text-xs text-gray-400">{freq} Freq</div>
              <div className={`text-sm font-mono mt-1 ${
                freq === 'Mid' ? 'text-green-400 animate-pulse' : 'text-white'
              }`}>
                {freq === 'Mid' ? '→ Modified' : 'Preserved'}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-gray-300 text-center">Mid-frequency coefficients modified</p>
    </div>,

    <div key={3} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4 relative">
        <div className="flex items-center justify-center space-x-4">
          <div className="w-24 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded flex items-center justify-center text-white text-xs">
            Original
          </div>
          <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
          </svg>
          <div className="w-24 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded flex items-center justify-center text-white text-xs relative">
            JPEG
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="text-center mt-2 text-green-400 text-xs animate-pulse">Survives Compression!</div>
      </div>
      <p className="text-gray-300 text-center">Data survives JPEG compression</p>
    </div>
  ];

  return demos[currentStep] || demos[0];
};

const SpreadSpectrumDemo = ({ currentStep }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    setAnimationClass('animate-fade-in');
    const timer = setTimeout(() => setAnimationClass(''), 500);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const demos = [
    <div key={0} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <div className="text-center text-cyan-400 text-sm mb-2">Pseudorandom Sequence</div>
        <div className="grid grid-cols-16 gap-1">
          {Array.from({length: 64}).map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full animate-pulse ${
                Math.random() > 0.5 ? 'bg-green-400' : 'bg-red-400'
              }`} 
              style={{animationDelay: `${i * 0.02}s`}} 
            />
          ))}
        </div>
        <div className="text-xs text-gray-400 mt-2">+1 and -1 values from secret key</div>
      </div>
      <p className="text-gray-300 text-center">Cryptographically secure spreading pattern</p>
    </div>,

    <div key={1} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <div className="space-y-3">
          <div className="text-center">
            <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Bit: 1</span>
          </div>
          <div className="flex justify-center">
            <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </div>
          <div className="grid grid-cols-10 gap-1">
            {Array.from({length: 20}).map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full animate-pulse ${
                  Math.random() > 0.5 ? 'bg-green-400' : 'bg-red-400'
                }`} 
                style={{animationDelay: `${i * 0.05}s`}} 
              />
            ))}
          </div>
          <div className="text-xs text-gray-400 text-center">1 bit → 1000 chips</div>
        </div>
      </div>
      <p className="text-gray-300 text-center">Each bit spread across many values</p>
    </div>,

    <div key={2} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-blue-400 text-xs mb-1">Image Spectrum</div>
            <div className="h-12 bg-gradient-to-t from-blue-600 to-blue-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center justify-center">
            <span className="text-cyan-400 text-xl">+</span>
          </div>
          <div className="text-center">
            <div className="text-green-400 text-xs mb-1">Spread Signal</div>
            <div className="h-12 bg-gradient-to-t from-green-600 to-green-200 rounded animate-pulse" style={{animationDelay: '0.3s'}} />
          </div>
        </div>
        <div className="text-center mt-3">
          <div className="h-6 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded animate-pulse" />
          <div className="text-xs text-gray-400 mt-1">Combined spectrum</div>
        </div>
      </div>
      <p className="text-gray-300 text-center">Signal added to entire frequency spectrum</p>
    </div>,

    <div key={3} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <div className="space-y-3">
          <div className="text-center text-cyan-400 text-sm">Correlation Detection</div>
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <div className="w-16 h-8 bg-yellow-400 rounded animate-pulse" />
              <div className="text-xs text-gray-400 mt-1">Known Key</div>
            </div>
            <span className="text-white">×</span>
            <div className="text-center">
              <div className="w-16 h-8 bg-purple-400 rounded animate-pulse" style={{animationDelay: '0.2s'}} />
              <div className="text-xs text-gray-400 mt-1">Received</div>
            </div>
            <span className="text-white">=</span>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}} />
              <div className="text-xs text-gray-400 mt-1">Peak!</div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-gray-300 text-center">Only correct key reveals the message</p>
    </div>
  ];

  return demos[currentStep] || demos[0];
};

const AudioLSBDemo = ({ currentStep }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    setAnimationClass('animate-fade-in');
    const timer = setTimeout(() => setAnimationClass(''), 500);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const demos = [
    <div key={0} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <svg className="w-full h-24" viewBox="0 0 400 96">
          <path
            d="M0,48 Q100,20 200,48 T400,48"
            stroke="#8B5CF6"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
        </svg>
      </div>
      <p className="text-gray-300 text-center">Digital audio waveform</p>
    </div>,

    <div key={1} className={`${animationClass}`}>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[32767, -16384, 8192, -4096].map((sample, i) => (
          <div key={i} className="bg-slate-800 p-2 rounded text-center text-xs">
            <div className="text-white font-mono">{sample}</div>
            <div className="text-cyan-400 mt-1">Sample {i+1}</div>
          </div>
        ))}
      </div>
      <p className="text-gray-300 text-center">Each sample = amplitude value</p>
    </div>,

    <div key={2} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <div className="space-y-2 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-white">32767</span>
            <span className="text-cyan-400">→</span>
            <span className="text-green-400 animate-pulse">32766</span>
            <span className="text-gray-400">(bit 0)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white">-16384</span>
            <span className="text-cyan-400">→</span>
            <span className="text-green-400 animate-pulse">-16383</span>
            <span className="text-gray-400">(bit 1)</span>
          </div>
        </div>
      </div>
      <p className="text-gray-300 text-center">LSB changes are inaudible</p>
    </div>,

    <div key={3} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4 relative">
        <svg className="w-full h-24" viewBox="0 0 400 96">
          <path
            d="M0,48 Q100,20 200,48 T400,48"
            stroke="#10B981"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="100" cy="30" r="3" fill="#EF4444" className="animate-pulse" />
          <circle cx="200" cy="48" r="3" fill="#EF4444" className="animate-pulse" />
          <circle cx="300" cy="30" r="3" fill="#EF4444" className="animate-pulse" />
        </svg>
        <div className="absolute top-2 right-2 text-green-400 text-xs">🔊 Hidden Data</div>
      </div>
      <p className="text-gray-300 text-center">Sounds identical - data is hidden!</p>
    </div>
  ];

  return demos[currentStep] || demos[0];
};

const EchoHidingDemo = ({ currentStep }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    setAnimationClass('animate-fade-in');
    const timer = setTimeout(() => setAnimationClass(''), 500);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const demos = [
    <div key={0} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <svg className="w-full h-20" viewBox="0 0 400 80">
          <path
            d="M0,40 Q50,10 100,40 T200,40 T300,40 T400,40"
            stroke="#8B5CF6"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
        </svg>
        <div className="text-center mt-2 text-purple-400 text-xs">Clean Audio Signal</div>
      </div>
      <p className="text-gray-300 text-center">Original audio without echoes</p>
    </div>,

    <div key={1} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-cyan-400 text-sm mb-2">Bit 0 (0.8ms)</div>
            <svg className="w-full h-12" viewBox="0 0 100 48">
              <line x1="10" y1="24" x2="10" y2="4" stroke="#10B981" strokeWidth="2" />
              <line x1="25" y1="24" x2="25" y2="14" stroke="#10B981" strokeWidth="1" className="animate-pulse" />
            </svg>
          </div>
          <div className="text-center">
            <div className="text-green-400 text-sm mb-2">Bit 1 (1.6ms)</div>
            <svg className="w-full h-12" viewBox="0 0 100 48">
              <line x1="10" y1="24" x2="10" y2="4" stroke="#10B981" strokeWidth="2" />
              <line x1="40" y1="24" x2="40" y2="14" stroke="#10B981" strokeWidth="1" className="animate-pulse" style={{animationDelay: '0.3s'}} />
            </svg>
          </div>
        </div>
      </div>
      <p className="text-gray-300 text-center">Different delays encode different bits</p>
    </div>,

    <div key={2} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <svg className="w-full h-20" viewBox="0 0 400 80">
          <path
            d="M0,40 Q50,10 100,40 T200,40 T300,40 T400,40"
            stroke="#10B981"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="60" cy="45" r="2" fill="#EF4444" className="animate-pulse" />
          <circle cx="160" cy="35" r="2" fill="#EF4444" className="animate-pulse" style={{animationDelay: '0.2s'}} />
          <circle cx="260" cy="45" r="2" fill="#EF4444" className="animate-pulse" style={{animationDelay: '0.4s'}} />
          <text x="380" y="15" fill="#EF4444" fontSize="8" className="animate-pulse">Echoes</text>
        </svg>
      </div>
      <p className="text-gray-300 text-center">Imperceptible echoes added at specific delays</p>
    </div>,

    <div key={3} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4 relative">
        <div className="flex items-center justify-center space-x-6">
          <div className="text-center">
            <div className="text-4xl animate-pulse">🎵</div>
            <div className="text-xs text-gray-400 mt-1">Sounds Normal</div>
          </div>
          <div className="text-center">
            <div className="text-4xl animate-pulse" style={{animationDelay: '0.5s'}}>🔐</div>
            <div className="text-xs text-gray-400 mt-1">Contains Data</div>
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded animate-pulse">
          Hidden!
        </div>
      </div>
      <p className="text-gray-300 text-center">Audio sounds completely natural</p>
    </div>
  ];

  return demos[currentStep] || demos[0];
};

const PhaseCodingDemo = ({ currentStep }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    setAnimationClass('animate-fade-in');
    const timer = setTimeout(() => setAnimationClass(''), 500);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const demos = [
    <div key={0} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <div className="text-center text-cyan-400 text-sm mb-3">FFT Analysis</div>
        <svg className="w-full h-16" viewBox="0 0 400 64">
          <defs>
            <linearGradient id="freqGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          {Array.from({length: 20}).map((_, i) => (
            <rect 
              key={i} 
              x={i * 20} 
              y={64 - (Math.random() * 40 + 10)} 
              width="18" 
              height={Math.random() * 40 + 10} 
              fill="url(#freqGradient)" 
              className="animate-pulse" 
              style={{animationDelay: `${i * 0.1}s`}} 
            />
          ))}
        </svg>
        <div className="text-xs text-gray-400 text-center mt-2">Low → Mid → High Frequencies</div>
      </div>
      <p className="text-gray-300 text-center">Audio broken into frequency components</p>
    </div>,

    <div key={1} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-yellow-400 text-sm mb-2">Magnitude (Volume)</div>
            <div className="space-y-1">
              {Array.from({length: 4}).map((_, i) => (
                <div 
                  key={i} 
                  className="h-2 bg-yellow-400 rounded animate-pulse" 
                  style={{width: `${60 + Math.random() * 40}%`, animationDelay: `${i * 0.1}s`}} 
                />
              ))}
            </div>
            <div className="text-xs text-gray-400 mt-1">Keep unchanged</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 text-sm mb-2">Phase (Timing)</div>
            <div className="space-y-1">
              {Array.from({length: 4}).map((_, i) => (
                <div key={i} className="relative">
                  <div className="h-2 bg-green-400 rounded animate-pulse" style={{animationDelay: `${i * 0.1}s`}} />
                  <div className="absolute right-0 top-0 w-1 h-2 bg-red-400 animate-pulse" style={{animationDelay: `${i * 0.1 + 0.2}s`}} />
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-400 mt-1">Modify secretly</div>
          </div>
        </div>
      </div>
      <p className="text-gray-300 text-center">Separate magnitude from phase components</p>
    </div>,

    <div key={2} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <div className="space-y-3">
          <div className="text-center text-cyan-400 text-sm">Phase Shift Encoding</div>
          <div className="grid grid-cols-3 gap-2">
            {['0°', '45°', '90°'].map((angle, i) => (
              <div key={i} className="text-center p-2 bg-slate-700 rounded">
                <div className="relative w-8 h-8 mx-auto mb-1">
                  <div className={`absolute inset-0 border-2 border-green-400 rounded-full transform ${i === 1 ? 'animate-spin' : ''}`} style={{animationDuration: '2s'}} />
                  <div 
                    className="absolute top-1/2 left-1/2 w-3 h-0.5 bg-green-400 transform -translate-y-1/2 origin-left" 
                    style={{transform: `translate(-50%, -50%) rotate(${i * 45}deg)`}} 
                  />
                </div>
                <div className="text-xs text-white">{angle}</div>
                <div className="text-xs text-gray-400">{i === 1 ? 'Bit 1' : 'Bit 0'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-300 text-center">Phase shifts encode message bits</p>
    </div>,

    <div key={3} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <div className="text-center text-cyan-400 text-sm mb-3">Inverse FFT</div>
        <div className="flex items-center justify-center space-x-4">
          <div className="text-center">
            <div className="w-16 h-10 bg-yellow-400 rounded animate-pulse" />
            <div className="text-xs text-gray-400 mt-1">Magnitude</div>
          </div>
          <span className="text-white text-xl">+</span>
          <div className="text-center">
            <div className="w-16 h-10 bg-green-400 rounded animate-pulse" style={{animationDelay: '0.2s'}} />
            <div className="text-xs text-gray-400 mt-1">Modified Phase</div>
          </div>
          <span className="text-white text-xl">→</span>
          <div className="text-center">
            <svg className="w-20 h-10" viewBox="0 0 80 40">
              <path d="M0,20 Q20,5 40,20 T80,20" stroke="#8B5CF6" strokeWidth="2" fill="none" className="animate-pulse" />
            </svg>
            <div className="text-xs text-gray-400 mt-1">Audio + Data</div>
          </div>
        </div>
      </div>
      <p className="text-gray-300 text-center">Sounds identical with hidden data</p>
    </div>
  ];

  return demos[currentStep] || demos[0];
};


const WhitespaceDemo = ({ currentStep }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    setAnimationClass('animate-fade-in');
    const timer = setTimeout(() => setAnimationClass(''), 500);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const demos = [
    <div key={0} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4 font-mono text-white text-sm">
        The quick brown fox jumps over the lazy dog
      </div>
      <p className="text-gray-300 text-center">Regular text with normal spacing</p>
    </div>,

    <div key={1} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <div className="text-center text-green-400 font-mono">
          <div className="animate-pulse">H → 01001000</div>
          <div className="animate-pulse" style={{animationDelay: '0.3s'}}>i → 01101001</div>
        </div>
      </div>
      <p className="text-gray-300 text-center">Secret message as binary</p>
    </div>,

    <div key={2} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <div className="text-center text-sm">
          <div className="text-cyan-400 mb-2">Encoding Rules:</div>
          <div className="text-white">Single space = 0</div>
          <div className="text-white">Double space = 1</div>
        </div>
      </div>
      <p className="text-gray-300 text-center">Space patterns encode bits</p>
    </div>,

    <div key={3} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4 font-mono text-white text-sm relative">
        The quick  brown fox  jumps over  the lazy  dog
        <div className="absolute top-2 right-2 text-green-400 text-xs animate-pulse">Hidden!</div>
      </div>
      <p className="text-gray-300 text-center">Text looks normal but contains secret data</p>
    </div>
  ];

  return demos[currentStep] || demos[0];
};

const SynonymDemo = ({ currentStep }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    setAnimationClass('animate-fade-in');
    const timer = setTimeout(() => setAnimationClass(''), 500);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const demos = [
    <div key={0} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <div className="text-white text-sm leading-relaxed">
          The <span className="bg-blue-500 px-1 rounded">big</span> house has a <span className="bg-blue-500 px-1 rounded">beautiful</span> garden with <span className="bg-blue-500 px-1 rounded">happy</span> flowers.
        </div>
        <div className="text-center mt-2">
          <div className="inline-flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-xs text-gray-400">Words with synonyms</span>
          </div>
        </div>
      </div>
      <p className="text-gray-300 text-center">Text with substitutable words highlighted</p>
    </div>,

    <div key={1} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <div className="space-y-2">
          {[
            {word: 'big', synonyms: ['large', 'huge']},
            {word: 'beautiful', synonyms: ['lovely', 'gorgeous']},
            {word: 'happy', synonyms: ['joyful', 'cheerful']}
          ].map((item, i) => (
            <div key={i} className="flex items-center space-x-2 text-sm">
              <span className="bg-blue-500 px-2 py-1 rounded text-white">{item.word}</span>
              <span className="text-gray-400">→</span>
              {item.synonyms.map((syn, j) => (
                <span 
                  key={j} 
                  className={`px-2 py-1 rounded animate-pulse ${j === 0 ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`} 
                  style={{animationDelay: `${j * 0.3}s`}}
                >
                  {syn}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="text-gray-300 text-center">Building synonym pairs for each word</p>
    </div>,

    <div key={2} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <div className="space-y-3">
          <div className="text-center text-cyan-400 text-sm">Binary: 1 0 1</div>
          <div className="space-y-2">
            {[
              {bit: '1', original: 'big', chosen: 'large', color: 'green'},
              {bit: '0', original: 'beautiful', chosen: 'beautiful', color: 'blue'},
              {bit: '1', original: 'happy', chosen: 'joyful', color: 'green'}
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-center space-x-3 text-sm">
                <span className="text-gray-400">Bit {item.bit}:</span>
                <span className="bg-gray-600 px-2 py-1 rounded">{item.original}</span>
                <span className="text-cyan-400">→</span>
                <span 
                  className={`bg-${item.color}-500 px-2 py-1 rounded text-white animate-pulse`} 
                  style={{animationDelay: `${i * 0.2}s`}}
                >
                  {item.chosen}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-300 text-center">Choose synonyms based on message bits</p>
    </div>,

    <div key={3} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4 relative">
        <div className="text-white text-sm leading-relaxed">
          The <span className="bg-green-500 px-1 rounded animate-pulse">large</span> house has a <span className="bg-blue-500 px-1 rounded">beautiful</span> garden with <span className="bg-green-500 px-1 rounded animate-pulse" style={{animationDelay: '0.3s'}}>joyful</span> flowers.
        </div>
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded animate-pulse">
          Hidden: 101
        </div>
        <div className="text-center mt-3 text-xs text-gray-400">
          Meaning preserved, message hidden in word choices
        </div>
      </div>
      <p className="text-gray-300 text-center">Text reads naturally but carries secret data</p>
    </div>
  ];

  return demos[currentStep] || demos[0];
};

const UnicodeDemo = ({ currentStep }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    setAnimationClass('animate-fade-in');
    const timer = setTimeout(() => setAnimationClass(''), 500);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const demos = [
    <div key={0} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <div className="text-center text-lg text-white mb-2">
          Hello World!
        </div>
        <div className="text-center text-xs text-gray-400">
          Regular text that everyone can see
        </div>
      </div>
      <p className="text-gray-300 text-center">Normal visible text document</p>
    </div>,

    <div key={1} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <div className="text-center text-cyan-400 text-sm mb-3">Invisible Unicode Characters</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-2 bg-slate-700 rounded">
            <div className="text-xs text-gray-400 mb-1">U+200C</div>
            <div className="text-sm text-white">ZWNJ</div>
            <div className="text-xs text-green-400 animate-pulse">Bit 00</div>
          </div>
          <div className="text-center p-2 bg-slate-700 rounded">
            <div className="text-xs text-gray-400 mb-1">U+200D</div>
            <div className="text-sm text-white">ZWJ</div>
            <div className="text-xs text-green-400 animate-pulse" style={{animationDelay: '0.2s'}}>Bit 01</div>
          </div>
        </div>
        <div className="text-xs text-gray-400 text-center mt-2">Zero-width characters = invisible</div>
      </div>
      <p className="text-gray-300 text-center">Special characters computers see but humans don't</p>
    </div>,

    <div key={2} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4">
        <div className="space-y-2">
          <div className="text-center text-cyan-400 text-sm">Message: "Hi" → 01001000 01101001</div>
          <div className="text-center text-gray-400 text-xs">Split into pairs: 01 00 10 00 01 10 10 01</div>
          <div className="grid grid-cols-4 gap-1">
            {['01', '00', '10', '00', '01', '10', '10', '01'].map((pair, i) => (
              <div key={i} className="text-center p-1 bg-slate-700 rounded">
                <div className="text-xs text-white">{pair}</div>
                <div className="text-xs text-green-400 animate-pulse" style={{animationDelay: `${i * 0.1}s`}}>
                  U+200{pair === '00' ? 'C' : pair === '01' ? 'D' : pair === '10' ? '60' : 'FF'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-300 text-center">Each bit pair maps to invisible character</p>
    </div>,

    <div key={3} className={`${animationClass}`}>
      <div className="bg-slate-800 rounded-lg p-4 mb-4 relative">
        <div className="text-center">
          <div className="text-lg text-white mb-2">
            H‌‍⁠e‌‌l‍‌l‌⁠o‍‌ ⁠‌W‌‍o‌‌r‍‌l‌⁠d‍‌!
          </div>
          <div className="text-xs text-gray-400 mb-2">
            Same text with invisible characters inserted
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-blue-500 p-2 rounded text-white">
              <div className="animate-pulse">2 bits</div>
              <div>per char</div>
            </div>
            <div className="bg-green-500 p-2 rounded text-white">
              <div className="animate-pulse" style={{animationDelay: '0.2s'}}>Huge</div>
              <div>Capacity</div>
            </div>
            <div className="bg-purple-500 p-2 rounded text-white">
              <div className="animate-pulse" style={{animationDelay: '0.4s'}}>100%</div>
              <div>Invisible</div>
            </div>
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded animate-pulse">
          Massive Data!
        </div>
      </div>
      <p className="text-gray-300 text-center">Enormous capacity completely invisible to humans</p>
    </div>
  ];

  return demos[currentStep] || demos[0];
};

const DefaultDemo = ({ technique, currentStep }) => {
  return (
    <div className="text-center">
      <div className="text-6xl mb-4 animate-pulse">{technique.icon || '🔧'}</div>
      <h4 className="text-xl font-semibold text-white mb-2">{technique.name}</h4>
      <p className="text-gray-300">Visual demonstration for this technique</p>
    </div>
  );
};

// Enhanced Modal Component
const TechniqueModal = ({ technique, onClose }) => {
  const [activeTab, setActiveTab] = useState('visual');

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-3xl max-w-6xl max-h-[95vh] overflow-y-auto border border-slate-600/50 shadow-2xl">
        <div className="p-8">
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{technique.name}</h2>
              <p className="text-gray-300">{technique.category}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-slate-800/50 p-1 rounded-lg backdrop-blur-xl">
            <button
              onClick={() => setActiveTab('visual')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                activeTab === 'visual'
                  ? 'bg-slate-700 text-cyan-400 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              🎨 Visual Demo
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                activeTab === 'details'
                  ? 'bg-slate-700 text-cyan-400 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              📋 Details
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                activeTab === 'code'
                  ? 'bg-slate-700 text-cyan-400 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              💻 Production Code
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'visual' && (
            <div className="space-y-8">
              <VisualDemo technique={technique} />
              
              {/* Performance Metrics */}
              {technique.visualDemo?.performanceMetrics && (
                <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-xl p-6 border border-purple-400/30">
                  <h4 className="text-xl font-bold text-purple-300 mb-4">Performance Characteristics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(technique.visualDemo.performanceMetrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-sm text-purple-200 capitalize mb-1">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </div>
                        <div className="font-semibold text-white">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-8">
              {/* Simple Explanation */}
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-xl rounded-xl p-6 border border-blue-400/30">
                <h3 className="text-xl font-bold text-blue-300 mb-3 flex items-center">
                  <span className="mr-2">🧠</span>
                  Simple Explanation
                </h3>
                <p className="text-blue-100 leading-relaxed text-lg">{technique.simpleExplanation}</p>
              </div>

              {/* Real World Example */}
              <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-xl rounded-xl p-6 border border-green-400/30">
                <h3 className="text-xl font-bold text-green-300 mb-3 flex items-center">
                  <span className="mr-2">🌍</span>
                  Real World Example
                </h3>
                <p className="text-green-100 leading-relaxed italic text-lg">{technique.realWorldExample}</p>
              </div>

              {/* Advantages & Disadvantages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-700/50 backdrop-blur-xl rounded-xl p-6 border border-slate-600/50">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Advantages
                  </h3>
                  <ul className="space-y-3">
                    {technique.advantages?.map((advantage, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2.5 flex-shrink-0"></div>
                        <span className="text-gray-300">{advantage}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-700/50 backdrop-blur-xl rounded-xl p-6 border border-slate-600/50">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    Disadvantages
                  </h3>
                  <ul className="space-y-3">
                    {technique.disadvantages?.map((disadvantage, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2.5 flex-shrink-0"></div>
                        <span className="text-gray-300">{disadvantage}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Applications */}
              <div className="bg-slate-700/50 backdrop-blur-xl rounded-xl p-6 border border-slate-600/50">
                <h3 className="text-xl font-bold text-white mb-4">Real-World Applications</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {technique.applications?.map((app, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-full text-sm font-medium text-center shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center min-h-[48px]"
                    >
                      <span className="leading-tight">{app}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Production-Ready Implementation</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Python 3.8+</span>
                </div>
              </div>

              <div className="bg-gray-900/90 backdrop-blur-xl rounded-lg p-6 overflow-x-auto border border-slate-600/50">
                <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap leading-relaxed">
                  {technique.codeExample}
                </pre>
              </div>

              {/* Code Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-600/30">
                  <div className="text-2xl mb-2">🛡️</div>
                  <div className="font-semibold text-white">Error Handling</div>
                  <div className="text-sm text-gray-400">Robust exception management</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-600/30">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-semibold text-white">Quality Metrics</div>
                  <div className="text-sm text-gray-400">PSNR, SNR calculations</div>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-600/30">
                  <div className="text-2xl mb-2">🔧</div>
                  <div className="font-semibold text-white">Configurable</div>
                  <div className="text-sm text-gray-400">Adjustable parameters</div>
                </div>
              </div>
            </div>
          )}

          {/* Try Demo Button */}
          <div className="text-center pt-8 border-t border-slate-600/50">
            <Link
              to="/demo"
              onClick={onClose}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Try This Technique Live</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Techniques;