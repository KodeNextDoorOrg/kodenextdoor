import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getAuth, connectAuthEmulator, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getStorage, connectStorageEmulator, FirebaseStorage } from 'firebase/storage';
import { Analytics, getAnalytics } from 'firebase/analytics';

/**
 * Firebase configuration object
 * All values are loaded from environment variables
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Check if Firebase config is properly set up
const isFirebaseConfigured = 
  !!firebaseConfig.apiKey && 
  !!firebaseConfig.authDomain && 
  !!firebaseConfig.projectId;

if (!isFirebaseConfigured) {
  throw new Error('Firebase configuration is incomplete');
}

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;

// Initialize Firebase only if it hasn't been initialized yet
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase services
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);

  // Set persistence to LOCAL by default
  if (typeof window !== 'undefined') {
    setPersistence(auth, browserLocalPersistence)
      .catch(() => {
        // Error setting auth persistence
      });
  }

  // Initialize Analytics only on client side
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }

  // Use Firebase Local Emulator if we're in development and it's configured
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
    const EMULATOR_HOST = 'localhost';
    // Connect to emulators
    connectFirestoreEmulator(db, EMULATOR_HOST, 8080);
    connectAuthEmulator(auth, `http://${EMULATOR_HOST}:9099`);
    connectStorageEmulator(storage, EMULATOR_HOST, 9199);
  }
} else {
  app = getApp();
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
}

export { 
  app, 
  db,
  auth, 
  storage, 
  analytics,
  isFirebaseConfigured
}; 