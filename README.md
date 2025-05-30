# 🕵️ StegoCraft - Advanced Steganography Platform

<div align="center">

![StegoCraft Banner](https://img.shields.io/badge/StegoCraft-Steganography%20Platform-blueviolet?style=for-the-badge&logo=react)

[![React](https://img.shields.io/badge/React-18.2+-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1+-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Node.js](https://img.shields.io/badge/Node.js-20.0+-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

*Hide messages in plain sight with cutting-edge steganography techniques*

[🚀 Live Demo](https://stegocraft-demo.netlify.app) • [📖 Documentation](https://github.com/sayanbasak/stegocraft/wiki) • [🐛 Report Bug](https://github.com/sayanbasak/stegocraft/issues) • [💡 Request Feature](https://github.com/sayanbasak/stegocraft/issues)

</div>

---

## 🎯 What is StegoCraft?

StegoCraft is a modern web-based steganography platform that makes hiding and revealing secret messages as simple as a few clicks. Built as a capstone project, it combines cutting-edge algorithms with an intuitive user interface to make advanced cryptographic techniques accessible to everyone.

### ✨ Key Features

- 🖼️ **Image Steganography** - Hide messages in images using LSB substitution with pixel-perfect precision
- 📝 **Text Steganography** - Invisible whitespace encoding that's completely undetectable to readers  
- 🎵 **Audio Steganography** - Embed secrets in sound waves without affecting audio quality
- 🔒 **100% Client-Side** - Your data never leaves your device
- 🎨 **Beautiful UI/UX** - Modern glass-morphism design with smooth animations
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js (v20.0 or higher)
- npm (v10.0+) or yarn (v4.0+)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sayanbasak/stegocraft.git
   cd stegocraft
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

## 🛠️ Tech Stack

<div align="center">

| Frontend | Styling | Build Tool | Runtime | Deployment |
|----------|---------|------------|---------|------------|
| ![React](https://img.shields.io/badge/React%2018.2-61DAFB?style=flat&logo=react&logoColor=white) | ![Tailwind](https://img.shields.io/badge/Tailwind%204.1-06B6D4?style=flat&logo=tailwindcss&logoColor=white) | ![Vite](https://img.shields.io/badge/Vite%205.0-646CFF?style=flat&logo=vite&logoColor=white) | ![Node.js](https://img.shields.io/badge/Node.js%2020-339933?style=flat&logo=nodedotjs&logoColor=white) | ![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat&logo=netlify&logoColor=white) |

</div>

### Additional Technologies
- **React Router** v6.8+ - Client-side routing
- **Framer Motion** v10.0+ - Smooth animations
- **React Icons** v4.8+ - Beautiful iconography
- **Canvas API** - Image manipulation
- **Web Audio API** - Audio processing
- **File API** - File handling

## 📸 Screenshots

<details>
<summary>🖼️ Click to view screenshots</summary>

### Homepage
![Homepage](./screenshots/homepage.png)

### Image Steganography Demo
![Image Demo](./screenshots/image-demo.png)

### Text Steganography Demo
![Text Demo](./screenshots/text-demo.png)

### About Page
![About Page](./screenshots/about-page.png)

</details>

## 🎮 How to Use

### 1. **Image Steganography**
```
1. Upload an image (PNG, JPG, JPEG)
2. Enter your secret message
3. Click "Hide Message" to encode
4. Download the steganographic image
5. To decode: Upload encoded image and click "Extract Message"
```

### 2. **Text Steganography**
```
1. Enter your cover text
2. Type your secret message
3. Click "Encode" to hide message using whitespace
4. Copy the encoded text
5. To decode: Paste encoded text and click "Decode"
```

### 3. **Audio Steganography**
```
1. Upload an audio file (WAV, MP3)
2. Enter your secret message
3. Click "Hide in Audio" to encode
4. Download the steganographic audio
5. To decode: Upload encoded audio and extract message
```

## 🔬 How It Works

### LSB (Least Significant Bit) Technique
- Modifies the least significant bits of pixel values in images
- Imperceptible to human eye but carries binary message data
- Supports RGB and RGBA image formats

### Whitespace Steganography
- Uses invisible Unicode characters between words
- Single space = binary 0, double space = binary 1
- Completely undetectable in normal text viewing

### Audio Steganography
- Embeds data in inaudible frequency ranges
- Uses phase coding and LSB modification
- Maintains original audio quality

## 👥 Team

<div align="center">

| **Sayan Basak**<br/>*Lead Developer*<br/>👨‍💻 | **Subir Ghosh**<br/>*Cryptography Specialist*<br/>👨‍🔬 | **Sriparna Biswas**<br/>*UI/UX Designer*<br/>👩‍💻 | **Ankan Jash**<br/>*Backend Architect*<br/>👨‍💻 |
|:---:|:---:|:---:|:---:|
| Tech wizard who brought the beautiful website to life | Algorithm mastermind behind our steganography techniques | Transforming ideas into beautiful clean and intuitive interfaces | System designer ensuring robust and scalable performance |
| React • Tailwind • Image Processing | Cryptography • Python • Research | UX Design • Prototyping • Figma | Node.js • Architecture • Security |

</div>

## 📁 Project Structure

```
stegocraft/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ui/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── ImageDemo.jsx
│   │   ├── TextDemo.jsx
│   │   └── AudioDemo.jsx
│   ├── utils/
│   │   ├── imageStego.js
│   │   ├── textStego.js
│   │   └── audioStego.js
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🤝 Contributing

We love contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
```

## 🔐 Security & Privacy

- **100% Client-Side Processing**: All steganography operations happen in your browser
- **No Data Collection**: We don't store or transmit your files or messages
- **Open Source**: Full transparency - inspect our code anytime
- **Secure Algorithms**: Industry-standard steganography techniques

## 📚 Research & References

Our implementation is based on established academic research:

- **Image Steganography**: LSB substitution techniques from IEEE papers
- **Text Steganography**: Whitespace encoding methods
- **Audio Steganography**: Phase coding and frequency domain techniques

### Academic Papers Referenced

- Johnson, N.F. & Jajodia, S. (2021). "A Survey of Digital Image Steganography." IEEE Transactions on Information Security
- Zhang, L., Wang, H. & Chen, M. (2022). "Advanced LSB Techniques in Audio Steganography." Journal of Digital Signal Processing
- Anderson, P. & Smith, R. (2020). "Whitespace Steganography in Text Documents." ACM Computing Surveys

### Books Referenced

- Katzenbeisser, S. & Petitcolas, F.A.P. (2019). "Information Hiding: Steganography and Digital Watermarking." Artech House
- Cox, I.J., Miller, M.L. & Bloom, J.A. (2021). "Digital Watermarking and Steganography." Morgan Kaufmann

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to our professors for guidance on this capstone project
- Inspired by classical steganography research papers
- Built with modern web technologies for optimal performance
- Special thanks to the open-source community

---

<div align="center">

**[⬆ Back to Top](#-stegocraft---advanced-steganography-platform)**

Made with ❤️ by the StegoCraft Team

![Visitor Count](https://visitor-badge.laobi.icu/badge?page_id=sayanbasak.stegocraft)

</div>
