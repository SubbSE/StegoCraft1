// src/pages/Techniques.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TechniqueVisual from '../components/TechniqueVisual';

const Techniques = () => {
  const [activeCategory, setActiveCategory] = useState('image');
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = {
    image: {
      title: 'Image Steganography',
      icon: '🖼️',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
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
            beforeImage: '/api/placeholder/300/200',
            afterImage: '/api/placeholder/300/200',
            steps: [
              {
                title: 'Original Image',
                description: 'Start with any digital image',
                visual: 'original-image'
              },
              {
                title: 'Convert Message to Binary',
                description: 'Turn your secret message into 1s and 0s',
                visual: 'binary-conversion'
              },
              {
                title: 'Modify Pixel Values',
                description: 'Change the last digit of each pixel number',
                visual: 'pixel-modification'
              },
              {
                title: 'Result',
                description: 'Image looks identical but contains hidden data',
                visual: 'result-comparison'
              }
            ]
          },
          realWorldExample: 'Like writing in invisible ink - the message is there, but you need to know the secret to see it.',
          detailedInfo: 'LSB (Least Significant Bit) substitution works by replacing the last bit of each color channel in image pixels. Since the human eye cannot detect small changes in color values, this method provides a simple way to hide data.',
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
          ]
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
            steps: [
              {
                title: 'Divide Image into Blocks',
                description: 'Split the image into small 8x8 pixel squares',
                visual: 'block-division'
              },
              {
                title: 'Convert to Frequency Domain',
                description: 'Transform each block to show patterns instead of colors',
                visual: 'dct-transform'
              },
              {
                title: 'Hide Data in Patterns',
                description: 'Modify specific pattern values to store secret bits',
                visual: 'frequency-modification'
              },
              {
                title: 'Convert Back to Image',
                description: 'Transform back to normal image with hidden data',
                visual: 'inverse-transform'
              }
            ]
          },
          realWorldExample: 'Like hiding a secret code in the background music of a video - it\'s there, but mixed into the natural patterns.',
          detailedInfo: 'DCT domain steganography transforms the image into frequency domain, embeds data in specific DCT coefficients, and converts back to spatial domain. This method is more robust than LSB.',
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
          ]
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
            steps: [
              {
                title: 'Generate Random Pattern',
                description: 'Create a unique random noise pattern using a secret key',
                visual: 'random-pattern'
              },
              {
                title: 'Spread Message Bits',
                description: 'Multiply each message bit by many random values',
                visual: 'bit-spreading'
              },
              {
                title: 'Add to Entire Image',
                description: 'Mix the spread signal very faintly across all pixels',
                visual: 'signal-addition'
              },
              {
                title: 'Extract with Key',
                description: 'Only someone with the key can recover the message',
                visual: 'key-extraction'
              }
            ]
          },
          realWorldExample: 'Like having a conversation in a noisy restaurant - without knowing what to listen for, the message is lost in the background noise.',
          detailedInfo: 'Spread spectrum techniques distribute the hidden message across multiple frequency components, making it extremely difficult to detect and remove without the proper key.',
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
            'Military and intelligence communications',
            'High-security corporate data',
            'Research and academic projects',
            'Advanced digital watermarking'
          ]
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
            steps: [
              {
                title: 'Audio Waveform',
                description: 'Start with any audio file as digital sound waves',
                visual: 'audio-waveform'
              },
              {
                title: 'Sample Values',
                description: 'Each point on the wave has a number value',
                visual: 'sample-values'
              },
              {
                title: 'Modify Last Bits',
                description: 'Change the last digit of each sample number',
                visual: 'lsb-modification'
              },
              {
                title: 'Hidden Audio',
                description: 'Audio sounds identical but contains secret data',
                visual: 'hidden-audio'
              }
            ]
          },
          realWorldExample: 'Like whispering so quietly in a crowded room that only someone listening very carefully with special equipment could hear you.',
          detailedInfo: 'Audio LSB works similarly to image LSB but operates on audio samples. The least significant bits of digital audio samples are replaced with the binary representation of the secret message.',
          advantages: [
            'Can hide lots of data',
            'Simple to understand',
            'Completely inaudible to human ears',
            'Works with uncompressed audio files'
          ],
          disadvantages: [
            'Lost if audio is compressed (MP3)',
            'Destroyed by audio editing',
            'Easy to detect with analysis tools',
            'Not robust against audio processing'
          ],
          applications: [
            'Hidden voice messages',
            'Audio watermarking',
            'Secret communication channels',
            'Digital rights management'
          ]
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
            steps: [
              {
                title: 'Original Audio',
                description: 'Start with clean audio signal',
                visual: 'clean-audio'
              },
              {
                title: 'Add Tiny Echoes',
                description: 'Create very quiet echoes at specific times',
                visual: 'echo-addition'
              },
              {
                title: 'Echo Timing = Data',
                description: 'Short delay = 0, Long delay = 1',
                visual: 'timing-encoding'
              },
              {
                title: 'Natural Sounding',
                description: 'Audio sounds normal with hidden message',
                visual: 'natural-result'
              }
            ]
          },
          realWorldExample: 'Like clapping your hands in a large room - the echo tells you about the room\'s size, but we use it to tell a secret message.',
          detailedInfo: 'Echo hiding embeds data by creating imperceptible echoes. Different delay times represent different binary values. The echo is too quiet and quick to be noticed by human ears.',
          advantages: [
            'Survives audio compression',
            'Very difficult to detect by ear',
            'Works with most audio formats',
            'Sounds completely natural'
          ],
          disadvantages: [
            'Can only hide small amounts of data',
            'Complex to implement correctly',
            'Sensitive to timing changes',
            'Requires precise audio processing'
          ],
          applications: [
            'Radio broadcast monitoring',
            'Audio content authentication',
            'Copyright protection for music',
            'Audio quality verification'
          ]
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
            steps: [
              {
                title: 'Break Audio into Frequencies',
                description: 'Separate audio into different frequency components',
                visual: 'frequency-separation'
              },
              {
                title: 'Keep Loudness, Change Timing',
                description: 'Modify phase while preserving amplitude',
                visual: 'phase-modification'
              },
              {
                title: 'Encode Data in Phase',
                description: 'Different phase shifts represent different bits',
                visual: 'phase-encoding'
              },
              {
                title: 'Reconstruct Audio',
                description: 'Combine frequencies back into natural audio',
                visual: 'audio-reconstruction'
              }
            ]
          },
          realWorldExample: 'Like changing when each musician starts playing in an orchestra while keeping the volume the same - the music sounds identical, but the timing carries a secret message.',
          detailedInfo: 'Phase coding operates in the frequency domain, modifying the phase of specific frequency components while preserving magnitude. This creates imperceptible changes that carry hidden information.',
          advantages: [
            'Completely invisible to human hearing',
            'Survives many types of audio processing',
            'Good for moderate amounts of data',
            'Very secure encoding method'
          ],
          disadvantages: [
            'Requires complex frequency analysis',
            'Sensitive to audio synchronization',
            'Needs advanced signal processing',
            'Limited by audio content type'
          ],
          applications: [
            'Professional audio watermarking',
            'Audio forensics and authentication',
            'Secure communications',
            'Content verification systems'
          ]
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
            steps: [
              {
                title: 'Normal Text',
                description: 'Start with any regular text document',
                visual: 'normal-text'
              },
              {
                title: 'Convert Message to Binary',
                description: 'Turn secret message into 1s and 0s',
                visual: 'binary-message'
              },
              {
                title: 'Replace Spaces',
                description: 'One space = 0, Two spaces = 1',
                visual: 'space-replacement'
              },
              {
                title: 'Hidden Message',
                description: 'Text looks normal but spacing contains data',
                visual: 'spaced-text'
              }
            ]
          },
          realWorldExample: 'Like writing a letter where the spacing between words secretly spells out another message - it looks normal but contains a hidden code.',
          detailedInfo: 'Whitespace steganography encodes data using invisible characters like spaces, tabs, and line breaks. Different combinations represent binary values, making the text appear normal to casual readers.',
          advantages: [
            'Extremely simple to understand',
            'Completely invisible when reading',
            'Works with any text document',
            'No special software needed to hide'
          ],
          disadvantages: [
            'Can only hide very small messages',
            'Lost when text is reformatted',
            'Easy to detect with analysis',
            'Destroyed by copy-paste operations'
          ],
          applications: [
            'Simple document authentication',
            'Hidden notes in documents',
            'Educational demonstrations',
            'Basic covert communication'
          ]
        },
        {
          id: 'synonym-substitution',
          name: 'Synonym Substitution',
          difficulty: 'Intermediate',
          capacity: 'Medium',
          detection: 'Medium',
          description: 'Replace words with synonyms based on hidden message bits',
          simpleExplanation: 'We secretly choose between different words that mean the same thing. For example, "big" vs "large" could represent 0 vs 1. The text reads normally but the word choices carry a hidden message!',
          visualDemo: {
            type: 'synonym-substitution',
            steps: [
              {
                title: 'Original Text',
                description: 'Start with text containing common words',
                visual: 'original-text'
              },
              {
                title: 'Find Synonym Pairs',
                description: 'Identify words with multiple meanings',
                visual: 'synonym-pairs'
              },
              {
                title: 'Choose Based on Data',
                description: 'Select synonyms to represent 0s and 1s',
                visual: 'word-selection'
              },
              {
                title: 'Natural Reading',
                description: 'Text reads normally with hidden message',
                visual: 'final-text'
              }
            ]
          },
          realWorldExample: 'Like choosing between "happy" and "joyful" in your writing - both mean the same thing, but your choice secretly carries part of a hidden message.',
          detailedInfo: 'This method maintains text meaning while hiding data by strategically choosing synonyms. Each word position can encode information based on which synonym variant is selected.',
          advantages: [
            'Text meaning stays exactly the same',
            'Reads like natural language',
            'Very difficult to detect casually',
            'Can hide moderate amounts of data'
          ],
          disadvantages: [
            'Requires large dictionary of synonyms',
            'Complex natural language processing needed',
            'May change the writing style slightly',
            'Context sometimes limits word choices'
          ],
          applications: [
            'Hidden messages in literature',
            'Academic paper steganography',
            'Natural language covert channels',
            'Automated content generation'
          ]
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
            steps: [
              {
                title: 'Regular Text',
                description: 'Start with normal visible text',
                visual: 'visible-text'
              },
              {
                title: 'Invisible Characters',
                description: 'Add special Unicode characters you can\'t see',
                visual: 'invisible-chars'
              },
              {
                title: 'Character Combinations',
                description: 'Different invisible characters = different data',
                visual: 'char-combinations'
              },
              {
                title: 'Hidden Payload',
                description: 'Text looks normal but contains massive hidden data',
                visual: 'hidden-payload'
              }
            ]
          },
          realWorldExample: 'Like having a secret invisible alphabet that only computers can see - you can write entire letters in invisible text mixed with normal text.',
          detailedInfo: 'Unicode steganography exploits the vast Unicode character set and invisible characters like zero-width spaces, joiners, and directional marks to embed substantial amounts of hidden data.',
          advantages: [
            'Can hide enormous amounts of data',
            'Completely invisible to human eyes',
            'Survives copy-paste operations',
            'Works in digital documents and websites'
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
            'Advanced covert communication channels'
          ]
        }
      ]
    }};

  const allTechniques = Object.values(categories).flatMap(cat => 
    cat.techniques.map(tech => ({ ...tech, category: cat.title }))
  );

  const filteredTechniques = allTechniques.filter(tech =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 text-blue-800 text-sm font-medium mb-6">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Comprehensive Guide
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Steganography 
            <span className="gradient-text"> Techniques </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Explore 16 detailed steganography techniques across 6 major categories. From beginner-friendly LSB methods 
            to advanced cryptographic integration - learn theory, implementation, and real-world applications.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search techniques..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className={`group flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeCategory === key
                  ? `bg-gradient-to-r ${categories[key].color} text-white shadow-lg transform scale-105`
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg hover:scale-105'
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
          <div className={`${categories[activeCategory].bgColor} rounded-3xl p-8 border border-gray-200`}>
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${categories[activeCategory].color} rounded-2xl text-3xl mb-4`}>
                {categories[activeCategory].icon}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {categories[activeCategory].title}
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
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
              className="group bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
              onClick={() => setSelectedTechnique(technique)}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {technique.name}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(technique.difficulty)}`}>
                    {technique.difficulty}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {technique.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-500 mb-1">Capacity</div>
                    <div className={`text-sm font-bold ${
                      technique.capacity === 'High' || technique.capacity === 'Very High' ? 'text-green-600' :
                      technique.capacity === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {technique.capacity}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-500 mb-1">Detection</div>
                    <div className={`text-sm font-bold ${
                      technique.detection === 'Easy' ? 'text-red-600' :
                      technique.detection === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {technique.detection}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-500 mb-1">Level</div>
                    <div className="text-sm font-bold text-blue-600">
                      {technique.difficulty}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2 group">
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
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="text-3xl font-bold gradient-text mb-2">6</div>
            <div className="text-gray-600 font-medium">Categories</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="text-3xl font-bold gradient-text mb-2">16</div>
            <div className="text-gray-600 font-medium">Techniques</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="text-3xl font-bold gradient-text mb-2">3</div>
            <div className="text-gray-600 font-medium">Live Demos</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="text-3xl font-bold gradient-text mb-2">100%</div>
            <div className="text-gray-600 font-medium">Detailed</div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Try These Techniques?</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Experience steganography hands-on with our interactive demos. Practice what you've learned with real algorithms.
          </p>
          <Link
            to="/demo"
            className="inline-flex items-center space-x-3 bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Try Interactive Demos</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* Detailed Modal */}
      {selectedTechnique && (
        <TechniqueModal 
          technique={selectedTechnique} 
          onClose={() => setSelectedTechnique(null)} 
        />
      )}
    </div>
  );
};

// Detailed Technique Modal Component
const TechniqueModal = ({ technique, onClose }) => {
  const [activeTab, setActiveTab] = useState('visual');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{technique.name}</h2>
              <p className="text-gray-600">{technique.category}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('visual')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                activeTab === 'visual'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🎨 Visual Guide
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                activeTab === 'details'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📋 Details
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                activeTab === 'code'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              💻 Code
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'visual' && (
            <div className="space-y-8">
              <TechniqueVisual technique={technique} />
              
              {/* Interactive Steps */}
              {technique.visualDemo?.steps && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Step-by-Step Process</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {technique.visualDemo.steps.map((step, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                            {index + 1}
                          </div>
                          <h4 className="font-semibold text-gray-800">{step.title}</h4>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
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
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-xl font-bold text-blue-900 mb-3 flex items-center">
                  <span className="mr-2">🧠</span>
                  Simple Explanation
                </h3>
                <p className="text-blue-800 leading-relaxed text-lg">{technique.simpleExplanation}</p>
              </div>

              {/* Real World Example */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-xl font-bold text-green-900 mb-3 flex items-center">
                  <span className="mr-2">🌍</span>
                  Real World Example
                </h3>
                <p className="text-green-800 leading-relaxed italic text-lg">{technique.realWorldExample}</p>
              </div>

              {/* Advantages & Disadvantages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Advantages
                  </h3>
                  <ul className="space-y-3">
                    {technique.advantages?.map((advantage, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></div>
                        <span className="text-gray-700">{advantage}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    Disadvantages
                  </h3>
                  <ul className="space-y-3">
                    {technique.disadvantages?.map((disadvantage, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2.5 flex-shrink-0"></div>
                        <span className="text-gray-700">{disadvantage}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Applications */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Real-World Applications</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {technique.applications?.map((app, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium text-center shadow-lg"
                    >
                      {app}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-6">
              <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
                <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                  {technique.codeExample || '// Code example coming soon...'}
                </pre>
              </div>
            </div>
          )}

          {/* Try Demo Button */}
          <div className="text-center pt-8 border-t border-gray-200">
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
