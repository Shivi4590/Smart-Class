import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth,
  db
} from '../services/firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  async function signup(email, password, userData) {
    if (!isOnline) {
      throw new Error('Cannot register while offline. Please check your internet connection.');
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...userData,
        email,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
      
      return userCredential;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Load user role from localStorage first for immediate UI update
        const cachedRole = localStorage.getItem('userRole');
        if (cachedRole) {
          setUserRole(cachedRole);
        }
        
        // Then fetch fresh data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role);
            localStorage.setItem('userRole', userData.role);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserRole(null);
        localStorage.removeItem('userRole');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function login(email, password) {
    if (!isOnline) {
      throw new Error('Cannot login while offline. Please check your internet connection.');
    }
    
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch user data in parallel with login
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserRole(userData.role);
        localStorage.setItem('userRole', userData.role);
      }
      
      return userCredential;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const value = {
    currentUser,
    userRole,
    login,
    signup,
    logout: () => signOut(auth),
    loading,
    error: null
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}