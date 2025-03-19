import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVug25HT8pCXapqdILN7IKZlsbbHgJTqU",
  authDomain: "smart-classroom-management.firebaseapp.com",
  projectId: "smart-classroom-management",
  storageBucket: "smart-classroom-management.appspot.com",
  messagingSenderId: "993855790173",
  appId: "1:993855790173:web:caad53d53d23627b3041b4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Initialize Firestore with optimized settings
const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: true,
  useFetchStreams: false
});

// Enable offline persistence
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support offline persistence.');
    } else {
      console.error('Error enabling persistence:', err);
    }
  });
} catch (err) {
  console.warn('Error enabling persistence:', err);
}

// Initialize Storage
const storage = getStorage(app);

// Export Firebase services
export { app, auth, db, storage };