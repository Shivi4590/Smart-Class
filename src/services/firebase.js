import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBVug25HT8pCXapqdILN7IKZlsbbHgJTqU",
  authDomain: "smart-classroom-management.firebaseapp.com",
  projectId: "smart-classroom-management",
  storageBucket: "smart-classroom-management.appspot.com",
  messagingSenderId: "993855790173",
  appId: "1:993855790173:web:caad53d53d23627b3041b4"
};

// Debug Firebase config
console.log('Firebase Config Status:', {
  apiKeyExists: !!firebaseConfig.apiKey,
  authDomainExists: !!firebaseConfig.authDomain,
  projectIdExists: !!firebaseConfig.projectId
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);
auth.useDeviceLanguage(); // Use device language for better UX

// Initialize Firestore
const db = getFirestore(app);

// Enable offline persistence for Firestore
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence enabled in first tab only');
  } else if (err.code === 'unimplemented') {
    console.warn('Browser doesn\'t support persistence');
  }
});

// Initialize Storage
const storage = getStorage(app);

// Development environment check for emulators
if (process.env.NODE_ENV === 'development') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (error) {
    console.warn('Emulator connection failed:', error);
  }
}

export { auth, db, storage };

// Lazy load analytics
let analyticsInstance = null;
export const getAnalytics = async () => {
  if (!analyticsInstance) {
    const { getAnalytics } = await import('firebase/analytics');
    analyticsInstance = getAnalytics(app);
  }
  return analyticsInstance;
};

export default app; 