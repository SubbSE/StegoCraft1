// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Remove analytics for now - we'll add it later if needed

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEaOA8iQwHDqnlL55q_ilVNkr2y2FnAbc",
  authDomain: "stegocraft-a8597.firebaseapp.com",
  projectId: "stegocraft-a8597",
  storageBucket: "stegocraft-a8597.firebasestorage.app",
  messagingSenderId: "142183003115",
  appId: "1:142183003115:web:89af9f3829d66992eddfae",
  measurementId: "G-EB5RPC2K3B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Optional: Initialize Analytics later if needed
// export const analytics = getAnalytics(app);

export default app;
