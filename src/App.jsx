// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './config/firebase';
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('🔍 Setting up Firebase auth listener...');
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔍 Auth state changed. User:', user ? user.email : 'none');
      
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
        localStorage.setItem('stegoCraftCurrentUser', JSON.stringify({
          uid: user.uid,
          email: user.email,
          username: user.displayName || user.email.split('@')[0]
        }));
      } else {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('stegoCraftCurrentUser');
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Define handleLogout function - THIS IS THE KEY FIX
  const handleLogout = React.useCallback(async () => {
    console.log('🚨 App.jsx handleLogout called!');
    console.log('🚨 Current Firebase user:', auth.currentUser);
    
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    
    if (confirmLogout) {
      try {
        console.log('🚨 Attempting Firebase signOut...');
        
        if (auth.currentUser) {
          await signOut(auth);
          console.log('✅ Firebase signOut successful');
        } else {
          console.log('⚠️ No Firebase user, clearing local state');
        }
        
        // Clear everything
        setIsAuthenticated(false);
        setUser(null);
        localStorage.clear();
        
        console.log('✅ Logout complete');
        alert('Logged out successfully!');
        
      } catch (error) {
        console.error('🚨 Logout error:', error);
        
        // Force logout anyway
        setIsAuthenticated(false);
        setUser(null);
        localStorage.clear();
        
        alert('Logged out (with error): ' + error.message);
      }
    }
  }, []); // Empty dependency array

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-cyan-400 font-semibold">Loading StegoCraft...</div>
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
        {/* FIXED: Make sure onLogout prop is properly passed */}
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
