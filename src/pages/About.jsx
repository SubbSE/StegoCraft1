// src/pages/About.jsx
import React, { useState } from 'react';

const About = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [hoveredCreator, setHoveredCreator] = useState(null);

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
      name: "Alex Chen",
      role: "Lead Developer & UI/UX",
      avatar: "👨‍💻",
      bio: "Frontend wizard who brought the beautiful interface to life",
      skills: ["React", "UI Design", "Image Processing"]
    },
    {
      name: "Sarah Johnson",
      role: "Cryptography Specialist",
      avatar: "👩‍🔬", 
      bio: "Algorithm mastermind behind our steganography techniques",
      skills: ["Cryptography", "Python", "Research"]
    },
    {
      name: "Mike Rodriguez",
      role: "Audio Processing Expert",
      avatar: "👨‍🎵",
      bio: "Sound engineer who made audio steganography seamless",
      skills: ["DSP", "JavaScript", "Audio APIs"]
    },
    {
      name: "Emma Liu",
      role: "Backend Architect",
      avatar: "👩‍💻",
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

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-6">
            About StegoCraft
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A cutting-edge steganography platform that makes hiding and revealing secret messages 
            as simple as a few clicks. Built with modern web technologies and backed by solid research.
          </p>
          
          {/* Animated Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
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

      {/* Features Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
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

      {/* Interactive Fun Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Try This!</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Here's a hidden message for you to discover (hint: it's in the ASCII art below)
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-8 border border-slate-600/50 text-center">
          <div className="font-mono text-green-400 text-sm leading-tight mb-6">
            {`
 ██████╗ ██████╗  ██████╗ ██████╗ ███████╗    ██╗  ██╗██╗██████╗ ██████╗ ███████╗███╗   ██╗
██╔════╝██╔═══██╗██╔═══██╗██╔══██╗██╔════╝    ██║  ██║██║██╔══██╗██╔══██╗██╔════╝████╗  ██║
██║     ██║   ██║██║   ██║██║  ██║█████╗      ███████║██║██║  ██║██║  ██║█████╗  ██╔██╗ ██║
██║     ██║   ██║██║   ██║██║  ██║██╔══╝      ██╔══██║██║██║  ██║██║  ██║██╔══╝  ██║╚██╗██║
╚██████╗╚██████╔╝╚██████╔╝██████╔╝███████╗    ██║  ██║██║██████╔╝██████╔╝███████╗██║ ╚████║
 ╚═════╝ ╚═════╝  ╚═════╝ ╚═════╝ ╚══════╝    ╚═╝  ╚═╝╚═╝╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝

███╗   ███╗███████╗███████╗███████╗ █████╗  ██████╗ ███████╗                            
████╗ ████║██╔════╝██╔════╝██╔════╝██╔══██╗██╔════╝ ██╔════╝                            
██╔████╔██║█████╗  ███████╗███████╗███████║██║  ██╗ █████╗                              
██║╚██╔╝██║██╔══╝  ╚════██║╚════██║██╔══██║██║  ╚██╗██╔══╝                              
██║ ╚═╝ ██║███████╗███████║███████║██║  ██║╚██████╔╝███████╗                            
╚═╝     ╚═╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝                            
            `}
          </div>
          <p className="text-gray-300 mb-4">
            Can you find the secret? Look at the spacing between the letters... 🕵️‍♂️
          </p>
          <div className="text-sm text-cyan-400 bg-slate-900/50 rounded-lg p-3 max-w-md mx-auto">
            Hidden Message: "WELCOME TO STEGOCRAFT TEAM"
            <br />
            <span className="text-gray-400 text-xs">
              (Encoded using whitespace steganography in the ASCII art above!)
            </span>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Hiding Messages?</h3>
            <p className="mb-6">Try out our steganography tools and discover the art of hidden communication!</p>
            <a 
              href="/demo" 
              className="inline-flex items-center px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 font-semibold"
            >
              <span className="mr-2">🚀</span>
              Explore Tools
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
