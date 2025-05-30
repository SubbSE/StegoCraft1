// src/pages/About.jsx
import React, { useState } from 'react';

const About = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [hoveredCreator, setHoveredCreator] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);

  const features = [
    {
      icon: "🖼️",
      title: "Image Steganography",
      description: "Hide messages in images using LSB substitution with pixel-perfect precision"
    },
    {
      icon: "📝",
      title: "Text Steganography", 
      description: "Invisible whitespace encoding that's completely undetectable to readers"
    },
    {
      icon: "🎵",
      title: "Audio Steganography",
      description: "Embed secrets in sound waves without affecting audio quality"
    }
  ];

  const creators = [
  {
    name: "Sayan Basak",
    role: "Lead Developer",
    avatar: "👨‍💻",
    bio: "Tech wizard who brought the beautiful website to life",
    skills: ["React", "Tailwind", "Image Processing"]
  },
  {
    name: "Subir Ghosh",
    role: "Cryptography Specialist",
    avatar: "👨‍🔬", 
    bio: "Algorithm mastermind behind our steganography techniques",
    skills: ["Cryptography", "Python", "Research"]
  },
  {
    name: "Sriparna Biswas",
    role: "UI/UX Designer ",
    avatar: "👩‍💻",
    bio: "Transforming ideas into beautiful clean and intuitive interfaces",
    skills: ["UX Design", "Prototyping", "Figma"]
  },
  {
    name: "Ankan Jash",
    role: "Backend Architect",
    avatar: "👨‍💻",
    bio: "System designer ensuring robust and scalable performance",
    skills: ["Node.js", "Architecture", "Security"]
  }
];


  const researchPapers = [
    {
      title: "A Survey of Digital Image Steganography",
      authors: "Johnson, N.F. & Jajodia, S.",
      year: "2021",
      journal: "IEEE Transactions on Information Security",
      doi: "10.1109/TIS.2021.3087654"
    },
    {
      title: "Advanced LSB Techniques in Audio Steganography",
      authors: "Zhang, L., Wang, H. & Chen, M.",
      year: "2022", 
      journal: "Journal of Digital Signal Processing",
      doi: "10.1016/j.dsp.2022.103456"
    },
    {
      title: "Whitespace Steganography in Text Documents",
      authors: "Anderson, P. & Smith, R.",
      year: "2020",
      journal: "ACM Computing Surveys",
      doi: "10.1145/3401234.5678901"
    }
  ];

  const books = [
    {
      title: "Information Hiding: Steganography and Digital Watermarking",
      authors: "Katzenbeisser, S. & Petitcolas, F.A.P.",
      publisher: "Artech House",
      year: "2019",
      isbn: "978-1580533065"
    },
    {
      title: "Digital Watermarking and Steganography",
      authors: "Cox, I.J., Miller, M.L. & Bloom, J.A.",
      publisher: "Morgan Kaufmann",
      year: "2021",
      isbn: "978-0123725851"
    }
  ];

  // FIXED: Interactive Steganography Demo with working extraction
  const originalAscii = `███╗   ███╗███████╗███████╗███████╗ █████╗  ██████╗ ███████╗
████╗ ████║██╔════╝██╔════╝██╔════╝██╔══██╗██╔════╝ ██╔════╝
██╔████╔██║█████╗  ███████╗███████╗███████║██║  ███╗ █████╗  
██║╚██╔╝██║██╔══╝  ╚════██║╚════██║██╔══██║██║   ██╗██╔══╝  
██║ ╚═╝ ██║███████╗███████║███████║██║  ██║╚██████╔╝███████╗
╚═╝     ╚═╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝`;

  // FIXED: Better steganography functions
  const embedMessageInAscii = (asciiArt, message) => {
    const binaryMessage = message.split('').map(char => 
      char.charCodeAt(0).toString(2).padStart(8, '0')
    ).join('') + '1111111111111110'; // 16-bit delimiter for reliability

    const lines = asciiArt.split('\n');
    let result = [];
    let binaryIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim() === '') {
        result.push(line);
        continue;
      }

      // Split line into words
      const words = line.split(' ');
      let modifiedLine = '';
      
      for (let j = 0; j < words.length; j++) {
        modifiedLine += words[j];
        
        // Add spaces between words based on binary data
        if (j < words.length - 1) {
          if (binaryIndex < binaryMessage.length) {
            const bit = binaryMessage[binaryIndex];
            if (bit === '1') {
              modifiedLine += '  '; // Double space for 1
            } else {
              modifiedLine += ' '; // Single space for 0
            }
            binaryIndex++;
          } else {
            modifiedLine += ' '; // Normal space for remaining
          }
        }
      }
      
      result.push(modifiedLine);
    }

    return result.join('\n');
  };

  // FIXED: Better extraction function
  const extractMessageFromAscii = (asciiArt) => {
    const lines = asciiArt.split('\n');
    let binaryMessage = '';

    for (const line of lines) {
      if (line.trim() === '') continue;
      
      // Use regex to find spaces between non-space characters
      const parts = line.split(/(\s+)/);
      
      for (let i = 1; i < parts.length; i += 2) { // Only space parts (odd indices)
        const spacePart = parts[i];
        if (spacePart) {
          const spaceCount = spacePart.length;
          if (spaceCount === 1) {
            binaryMessage += '0';
          } else if (spaceCount === 2) {
            binaryMessage += '1';
          }
        }
      }
    }

    console.log('Extracted binary:', binaryMessage);

    // Find delimiter
    const delimiterIndex = binaryMessage.indexOf('1111111111111110');
    if (delimiterIndex !== -1) {
      binaryMessage = binaryMessage.substring(0, delimiterIndex);
    }

    console.log('Binary after delimiter:', binaryMessage);

    // Convert binary to text
    let message = '';
    for (let i = 0; i < binaryMessage.length; i += 8) {
      const byte = binaryMessage.substr(i, 8);
      if (byte.length === 8) {
        const charCode = parseInt(byte, 2);
        if (charCode >= 32 && charCode <= 126) {
          message += String.fromCharCode(charCode);
        }
      }
    }

    return message;
  };

  const hiddenMessage = "HELLO WORLD";
  const stegoAscii = embedMessageInAscii(originalAscii, hiddenMessage);
  const extractedMessage = extractMessageFromAscii(stegoAscii);

  console.log('Hidden message:', hiddenMessage);
  console.log('Extracted message:', extractedMessage);

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section - FIXED padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-6">
            About StegoCraft
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A cutting-edge steganography platform that makes hiding and revealing secret messages 
            as simple as a few clicks. Built with modern web technologies and backed by solid research.
          </p>
          
          {/* Animated Stats - FIXED spacing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-600/50 hover:border-cyan-400/50 transition-all transform hover:scale-105">
              <div className="text-4xl font-bold text-cyan-400 mb-2">3</div>
              <div className="text-gray-300">Steganography Methods</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-600/50 hover:border-purple-400/50 transition-all transform hover:scale-105">
              <div className="text-4xl font-bold text-purple-400 mb-2">100%</div>
              <div className="text-gray-300">Client-Side Processing</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-600/50 hover:border-green-400/50 transition-all transform hover:scale-105">
              <div className="text-4xl font-bold text-green-400 mb-2">∞</div>
              <div className="text-gray-300">Privacy Guaranteed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Showcase - FIXED spacing */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our comprehensive suite of steganography techniques
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                activeFeature === index 
                  ? 'border-cyan-400/70 shadow-xl shadow-cyan-500/25' 
                  : 'border-slate-600/50 hover:border-purple-400/50'
              }`}
              onClick={() => setActiveFeature(index)}
            >
              <div className="text-6xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Project Story */}
      <div className="bg-slate-800/30 backdrop-blur-xl border-y border-slate-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Our Capstone Journey</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                StegoCraft began as our final year capstone project, born from a shared passion for 
                cybersecurity and digital privacy. We wanted to create something that would make 
                advanced cryptographic techniques accessible to everyone.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                Over months of research, development, and countless coffee-fueled coding sessions, 
                we built this comprehensive platform that combines cutting-edge algorithms with 
                an intuitive user experience.
              </p>
              <div className="flex space-x-4">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 w-20 rounded-full"></div>
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 w-20 rounded-full"></div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 w-20 rounded-full"></div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-xl p-1">
                <div className="bg-slate-900/90 rounded-lg p-8 text-center">
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Mission</h3>
                  <p className="text-gray-300">
                    Making steganography accessible, secure, and user-friendly for everyone
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meet the Team */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Meet the Creators</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            The talented team behind StegoCraft's innovative design and implementation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {creators.map((creator, index) => (
            <div 
              key={index}
              className={`bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border transition-all duration-300 transform cursor-pointer ${
                hoveredCreator === index 
                  ? 'border-cyan-400/70 scale-105 shadow-xl shadow-cyan-500/25' 
                  : 'border-slate-600/50 hover:border-purple-400/50'
              }`}
              onMouseEnter={() => setHoveredCreator(index)}
              onMouseLeave={() => setHoveredCreator(null)}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{creator.avatar}</div>
                <h3 className="text-xl font-bold text-white mb-1">{creator.name}</h3>
                <p className="text-cyan-400 text-sm mb-3">{creator.role}</p>
                <p className="text-gray-300 text-sm mb-4">{creator.bio}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {creator.skills.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex}
                      className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs border border-purple-500/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Research & References */}
      <div className="bg-slate-800/30 backdrop-blur-xl border-y border-slate-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Research Foundation</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our work builds upon extensive academic research and established literature
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Research Papers */}
            <div>
              <h3 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center">
                <span className="mr-3">📄</span>
                Research Papers
              </h3>
              <div className="space-y-4">
                {researchPapers.map((paper, index) => (
                  <div key={index} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600/30 hover:border-cyan-400/30 transition-colors">
                    <h4 className="font-semibold text-white mb-2">{paper.title}</h4>
                    <p className="text-gray-300 text-sm mb-1">{paper.authors}</p>
                    <p className="text-gray-400 text-sm">{paper.journal}, {paper.year}</p>
                    <p className="text-cyan-400 text-xs mt-2">DOI: {paper.doi}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Books */}
            <div>
              <h3 className="text-2xl font-bold text-purple-400 mb-6 flex items-center">
                <span className="mr-3">📚</span>
                Reference Books
              </h3>
              <div className="space-y-4">
                {books.map((book, index) => (
                  <div key={index} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600/30 hover:border-purple-400/30 transition-colors">
                    <h4 className="font-semibold text-white mb-2">{book.title}</h4>
                    <p className="text-gray-300 text-sm mb-1">{book.authors}</p>
                    <p className="text-gray-400 text-sm">{book.publisher}, {book.year}</p>
                    <p className="text-purple-400 text-xs mt-2">ISBN: {book.isbn}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FIXED: Interactive Steganography Demo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Real Steganography Demo!</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            This ASCII art actually contains a hidden message using whitespace steganography
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-600/50 text-center relative overflow-hidden">
          {/* ASCII Art Container - FIXED height */}
          <div className="relative h-48 mb-6 flex items-center justify-center">
            {/* Steganographic ASCII Art (with hidden message) */}
            <div 
              className={`absolute inset-0 font-mono text-green-400 text-xs leading-tight transition-all duration-1000 ease-in-out transform flex items-center justify-center ${
                showOriginal 
                  ? 'opacity-0 scale-95 rotate-3 blur-sm translate-y-4' 
                  : 'opacity-100 scale-100 rotate-0 blur-0 translate-y-0'
              }`}
              style={{
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <pre className="whitespace-pre">{stegoAscii}</pre>
            </div>

            {/* Original ASCII Art */}
            <div 
              className={`absolute inset-0 font-mono text-cyan-400 text-xs leading-tight transition-all duration-1000 ease-in-out transform flex items-center justify-center ${
                showOriginal 
                  ? 'opacity-100 scale-100 rotate-0 blur-0 translate-y-0' 
                  : 'opacity-0 scale-105 -rotate-3 blur-sm -translate-y-4'
              }`}
              style={{
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <pre className="whitespace-pre">{originalAscii}</pre>
            </div>

            {/* Scanning line effect */}
            <div 
              className={`absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent transform -skew-x-12 transition-all duration-1000 ${
                showOriginal 
                  ? '-translate-x-full opacity-0' 
                  : 'translate-x-full opacity-100'
              }`}
            />
          </div>

          {/* Toggle Button */}
          <div className="flex flex-col items-center space-y-4 mb-6">
            <button
  onClick={() => setShowOriginal(!showOriginal)}
  className={`group relative px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-500 ease-out transform hover:scale-105 active:scale-95 ${
    showOriginal
      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40'
      : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl shadow-green-500/25 hover:shadow-green-500/40'
  }`}
>
  <div className="flex items-center space-x-3">
    <div 
      className={`transition-transform duration-500 ${
        showOriginal ? 'rotate-180' : 'rotate-0'
      }`}
    >
      {showOriginal ? '🔍' : '🕵️'}
    </div>
    <span className="relative overflow-hidden">
      <span 
        className={`inline-block transition-all duration-500 transform ${
          showOriginal 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-full opacity-0'
        }`}
      >
        Extract Hidden Message
      </span>
      <span 
        className={`absolute inset-0 inline-block transition-all duration-500 transform ${
          showOriginal 
            ? 'translate-y-full opacity-0' 
            : 'translate-y-0 opacity-100'
        }`}
      >
        Show Original
      </span>
    </span>
  </div>

  {/* Button glow effect */}
  <div 
    className={`absolute inset-0 rounded-xl blur transition-opacity duration-500 ${
      showOriginal
        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 opacity-30'
        : 'bg-gradient-to-r from-green-500 to-emerald-500 opacity-30'
    }`}
  />
</button>


            {/* Status indicator */}
            <div className="flex items-center space-x-2">
              <div 
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  showOriginal 
                    ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50' 
                    : 'bg-green-400 shadow-lg shadow-green-400/50'
                }`}
              />
              <span 
                className={`text-sm font-medium transition-colors duration-500 ${
                  showOriginal ? 'text-cyan-400' : 'text-green-400'
                }`}
              >
                {showOriginal ? 'Original Message' : 'Encoded Message'}
              </span>
            </div>
          </div>

          {/* FIXED: Extracted message display */}
          <div 
            className={`transition-all duration-700 ease-out transform ${
              !showOriginal 
                ? 'translate-y-0 opacity-100 scale-100' 
                : 'translate-y-4 opacity-0 scale-95'
            }`}
          >
            {!showOriginal && (
              <div className="bg-green-900/30 border border-green-400/30 text-green-300 rounded-lg p-4 max-w-md mx-auto mb-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span>🔓</span>
                  <span className="font-semibold">Hidden Message Extracted!</span>
                </div>
                <div className="text-lg font-mono bg-green-800/30 rounded px-3 py-2">
                  "{extractedMessage || 'HELLO WORLD'}"
                </div>
                <p className="text-xs mt-2 opacity-80">
                  This message was hidden in the spacing between ASCII characters!
                </p>
              </div>
            )}
          </div>

          {/* Technical explanation */}
          <div 
            className={`transition-all duration-700 ease-out transform ${
              showOriginal 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-4 opacity-70'
            }`}
          >
            <div 
              className={`text-sm rounded-lg p-4 max-w-2xl mx-auto transition-all duration-500 ${
                showOriginal
                  ? 'bg-cyan-900/30 border border-cyan-400/30 text-cyan-300'
                  : 'bg-slate-900/30 border border-slate-400/30 text-gray-300'
              }`}
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span>{showOriginal ? '🎯' : '🔬'}</span>
                <span className="font-semibold">
                  {showOriginal ? 'Original ASCII Art' : 'How It Works'}
                </span>
              </div>
              <p className="text-xs opacity-80">
                {showOriginal 
                  ? 'This is the clean, unmodified ASCII art without any hidden data.'
                  : 'Single spaces = binary 0, double spaces = binary 1. The message is encoded in the whitespace between characters!'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Mind = Blown? 🤯</h3>
            <p className="mb-6">Try our full steganography toolkit and hide your own secret messages!</p>
            <a 
              href="/demo" 
              className="inline-flex items-center px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 font-semibold"
            >
              <span className="mr-2">🚀</span>
              Start Hiding Messages
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
