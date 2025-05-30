// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Techniques from './pages/Techniques';
import Demo from './pages/Demo';
import About from './pages/About';
import './App.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <div className="App min-h-screen w-full">
        <ScrollToTop />
        <Navbar />
        <main className="w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/techniques" element={<Techniques />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
