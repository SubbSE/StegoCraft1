// src/pages/Login.jsx
import React, { useState, useRef } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase'; // Make sure this path is correct

const Login = ({ setIsAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [formMousePos, setFormMousePos] = useState({ x: 0, y: 0 });
  const mainRef = useRef(null);
  const formRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (message) {
      setMessage('');
      setMessageType('');
    }
  };

  const validateForm = () => {
    if (!isLogin) {
      if (!formData.username.trim()) {
        setMessage('Username is required');
        setMessageType('error');
        return false;
      }
      if (formData.username.length < 3) {
        setMessage('Username must be at least 3 characters');
        setMessageType('error');
        return false;
      }
    }

    if (!formData.email.trim()) {
      setMessage('Email is required');
      setMessageType('error');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return false;
    }

    if (!formData.password.trim()) {
      setMessage('Password is required');
      setMessageType('error');
      return false;
    }

    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters');
      setMessageType('error');
      return false;
    }

    if (!isLogin) {
      if (!formData.confirmPassword.trim()) {
        setMessage('Please confirm your password');
        setMessageType('error');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setMessage('Passwords do not match');
        setMessageType('error');
        return false;
      }
    }

    return true;
  };

  const checkUsernameExists = async (username) => {
    try {
      const usernameDoc = doc(db, 'usernames', username.toLowerCase());
      const usernameSnap = await getDoc(usernameDoc);
      return usernameSnap.exists();
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        // LOGIN WITH FIREBASE
        const userCredential = await signInWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );

        // Get user data from Firestore
        const userDoc = doc(db, 'users', userCredential.user.uid);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          
          // Update last login
          await setDoc(userDoc, {
            ...userData,
            lastLogin: new Date()
          }, { merge: true });

          setMessage(`Welcome back, ${userData.username}!`);
          setMessageType('success');

          // Store user info
          localStorage.setItem('stegoCraftCurrentUser', JSON.stringify({
            uid: userCredential.user.uid,
            username: userData.username,
            email: userData.email
          }));

          setTimeout(() => {
            setIsAuthenticated(true);
          }, 1500);
        } else {
          setMessage('User data not found. Please contact support.');
          setMessageType('error');
        }

      } else {
        // REGISTER WITH FIREBASE
        
        // Check username availability
        const usernameExists = await checkUsernameExists(formData.username);
        if (usernameExists) {
          setMessage('Username already taken. Please choose another.');
          setMessageType('error');
          setIsLoading(false);
          return;
        }

        // Create user with Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        );

        // Store user data in Firestore
        const userData = {
          username: formData.username,
          email: formData.email,
          createdAt: new Date(),
          lastLogin: new Date()
        };

        await setDoc(doc(db, 'users', userCredential.user.uid), userData);

        // Reserve username
        await setDoc(doc(db, 'usernames', formData.username.toLowerCase()), {
          uid: userCredential.user.uid,
          username: formData.username
        });

        setMessage('Account created successfully! Welcome to StegoCraft!');
        setMessageType('success');

        localStorage.setItem('stegoCraftCurrentUser', JSON.stringify({
          uid: userCredential.user.uid,
          username: userData.username,
          email: userData.email
        }));

        setTimeout(() => {
          setIsAuthenticated(true);
        }, 2000);
      }

    } catch (error) {
      console.error('Authentication error:', error);
      
      // Handle Firebase errors
      switch (error.code) {
        case 'auth/user-not-found':
          setMessage('No account found with this email address.');
          break;
        case 'auth/wrong-password':
          setMessage('Incorrect password. Please try again.');
          break;
        case 'auth/email-already-in-use':
          setMessage('An account with this email already exists.');
          break;
        case 'auth/weak-password':
          setMessage('Password is too weak. Please use at least 6 characters.');
          break;
        case 'auth/invalid-email':
          setMessage('Please enter a valid email address.');
          break;
        case 'auth/too-many-requests':
          setMessage('Too many failed attempts. Please try again later.');
          break;
        default:
          setMessage(error.message || 'An error occurred. Please try again.');
      }
      setMessageType('error');
    }

    setIsLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!formData.email.trim()) {
      setMessage('Please enter your email address first');
      setMessageType('error');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, formData.email);
      setMessage('Password reset email sent! Check your inbox.');
      setMessageType('success');
    } catch (error) {
      setMessage('Error sending reset email. Please check your email address.');
      setMessageType('error');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setMessage('');
    setMessageType('');
  };

  // Mouse tracking functions
  const handleMainMouseMove = (e) => {
    if (mainRef.current) {
      const rect = mainRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePos({ x, y });
    }
  };

  const handleFormMouseMove = (e) => {
    if (formRef.current) {
      const rect = formRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setFormMousePos({ x, y });
    }
  };

  return (
    <div>
      {/* Keep your existing CSS */}
      <style jsx global>{`
        .animated-bg {
          background: 
            radial-gradient(circle 200px at ${mousePos.x * 100}% ${mousePos.y * 100}%, 
              rgba(34, 211, 238, 0.06) 0%, 
              transparent 70%
            ),
            linear-gradient(45deg, 
              #0f172a 0%, 
              #1e1b4b 25%, 
              #581c87 50%, 
              #1e1b4b 75%, 
              #0f172a 100%
            );
          background-size: 100% 100%, 400% 400%;
          animation: mainGradientShift 20s ease infinite;
        }
        
        .animated-form {
          background: 
            radial-gradient(circle 150px at ${formMousePos.x * 100}% ${formMousePos.y * 100}%, 
              rgba(239, 68, 68, 0.08) 0%, 
              transparent 70%
            ),
            linear-gradient(135deg, 
              rgba(220, 38, 127, 0.15) 0%, 
              rgba(239, 68, 68, 0.1) 25%, 
              rgba(168, 85, 247, 0.15) 50%, 
              rgba(239, 68, 68, 0.1) 75%, 
              rgba(220, 38, 127, 0.15) 100%
            );
          background-size: 100% 100%, 300% 300%;
          animation: formGradientShift 15s ease infinite;
        }
        
        @keyframes mainGradientShift {
          0%, 100% { 
            background-position: 0% 50%, 0% 50%; 
          }
          50% { 
            background-position: 0% 50%, 100% 50%; 
          }
        }
        
        @keyframes formGradientShift {
          0%, 100% { 
            background-position: 0% 50%, 0% 50%; 
          }
          50% { 
            background-position: 0% 50%, 100% 50%; 
          }
        }
      `}</style>

      <div 
        ref={mainRef}
        className="animated-bg min-h-screen flex items-center justify-center px-4 relative overflow-hidden transition-all duration-500 ease-out"
        onMouseMove={handleMainMouseMove}
      >
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
          
          {/* Left Side */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-green-400 bg-clip-text text-transparent mb-6">
              🕵️ StegoCraft
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed mb-8">
              Where secrets hide behind pixels, words, and waves
            </p>
            
           
          </div>

          {/* Right Side - Form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md relative">
              <div 
                ref={formRef}
                className="animated-form relative rounded-2xl p-8 border border-slate-600/50 shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-500 ease-out"
                onMouseMove={handleFormMouseMove}
              >
                <div className="relative z-10">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="text-6xl mb-4">{isLogin ? '🔐' : '👤'}</div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {isLogin ? 'Welcome Back' : 'Join StegoCraft'}
                    </h2>
                    <p className="text-gray-300 text-sm">
                      {isLogin 
                        ? 'Sign in to access your secure account' 
                        : 'Create your account with Firebase security'
                      }
                    </p>
                  </div>

                  {/* Message Display */}
                  {message && (
                    <div className={`mb-6 p-4 rounded-lg border transition-all duration-300 ${
                      messageType === 'success' 
                        ? 'bg-green-500/10 border-green-500/30 text-green-300' 
                        : 'bg-red-500/10 border-red-500/30 text-red-300'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <span>{messageType === 'success' ? '✅' : '❌'}</span>
                        <span className="text-sm">{message}</span>
                      </div>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username (Register only) */}
                    {!isLogin && (
                      <div>
                        <label className="block text-gray-200 text-sm font-medium mb-2">
                          <span className="flex items-center">
                            <span className="mr-2">👤</span>
                            Username
                          </span>
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          required={!isLogin}
                          className="w-full px-4 py-3 bg-slate-900/60 border border-slate-500/50 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all backdrop-blur-sm"
                          placeholder="Choose a username"
                        />
                      </div>
                    )}

                    {/* Email */}
                    <div>
                      <label className="block text-gray-200 text-sm font-medium mb-2">
                        <span className="flex items-center">
                          <span className="mr-2">📧</span>
                          Email
                        </span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-900/60 border border-slate-500/50 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all backdrop-blur-sm"
                        placeholder="Enter your email"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-gray-200 text-sm font-medium mb-2">
                        <span className="flex items-center justify-between">
                          <span className="flex items-center">
                            <span className="mr-2">🔑</span>
                            Password
                          </span>
                          {isLogin && (
                            <button
                              type="button"
                              onClick={handleForgotPassword}
                              className="text-cyan-400 hover:text-cyan-300 text-xs transition-colors"
                            >
                              Forgot?
                            </button>
                          )}
                        </span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-900/60 border border-slate-500/50 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all backdrop-blur-sm"
                        placeholder="Enter your password"
                      />
                    </div>

                    {/* Confirm Password (Register only) */}
                    {!isLogin && (
                      <div>
                        <label className="block text-gray-200 text-sm font-medium mb-2">
                          <span className="flex items-center">
                            <span className="mr-2">🔒</span>
                            Confirm Password
                          </span>
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required={!isLogin}
                          className="w-full px-4 py-3 bg-slate-900/60 border border-slate-500/50 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all backdrop-blur-sm"
                          placeholder="Confirm your password"
                        />
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-3 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 active:scale-95 ${
                        isLoading
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-cyan-600 via-purple-600 to-green-600 hover:from-cyan-700 hover:via-purple-700 hover:to-green-700 text-white shadow-xl shadow-cyan-500/25'
                      }`}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          {isLogin ? 'Signing In...' : 'Creating Account...'}
                        </div>
                      ) : (
                        <span className="flex items-center justify-center">
                          <span className="mr-2">{isLogin ? '🚀' : '✨'}</span>
                          {isLogin ? 'Sign In' : 'Create Account'}
                        </span>
                      )}
                    </button>

                    {/* Toggle Mode */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={toggleMode}
                        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors duration-300"
                      >
                        {isLogin 
                          ? "Don't have an account? Sign up here" 
                          : "Already have an account? Sign in here"
                        }
                      </button>
                    </div>
                  </form>

                  {/* Security Notice */}
                  <div className="mt-6 text-center text-xs text-gray-300">
                    🔒 Secured by Firebase Authentication
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated bottom border */}
        <div className="absolute bottom-0 left-0 w-full h-1">
          <div className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-green-400 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
