// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './config/firebase'; // Import Firebase auth
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Techniques from './pages/Techniques';
import Demo from './pages/Demo';
import About from './pages/About';
import Login from './pages/Login';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for Firebase authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setIsAuthenticated(true);
        setUser(user);
        console.log('User signed in:', user.email);
      } else {
        // User is signed out
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('stegoCraftCurrentUser');
        console.log('User signed out');
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    
    if (confirmLogout) {
      try {
        // Sign out from Firebase
        await signOut(auth);
        
        // Clear local storage
        localStorage.removeItem('stegoCraftCurrentUser');
        
        // State will be updated automatically by onAuthStateChanged
        setIsAuthenticated(false);
        setUser(null);
        
        setTimeout(() => {
          alert('You have been logged out successfully!');
        }, 100);
        
      } catch (error) {
        console.error('Error signing out:', error);
        alert('Error logging out. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-cyan-400 font-semibold">Loading StegoCraft...</div>
          <div className="text-gray-400 text-sm mt-2">Checking authentication...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Router>
        <Login setIsAuthenticated={setIsAuthenticated} />
      </Router>
    );
  }

  return (
    <Router>
      <div className="App min-h-screen w-full">
        <ScrollToTop />
        <Navbar onLogout={handleLogout} user={user} />
        <main className="w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/techniques" element={<Techniques />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
