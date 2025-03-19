'use client';

import { createContext, useContext, ReactNode } from 'react';
import { auth, db, storage } from '@/lib/firebase';
import { User } from 'firebase/auth';

interface FirebaseContextType {
  auth: typeof auth;
  db: typeof db;
  storage: typeof storage;
  user: User | null;
}

// Create context with default values
const FirebaseContext = createContext<FirebaseContextType>({
  auth,
  db,
  storage,
  user: null
});

interface FirebaseProviderProps {
  children: ReactNode;
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  // For now, we are just passing the services
  // In a real app, you might want to add authentication state here

  return (
    <FirebaseContext.Provider value={{ auth, db, storage, user: null }}>
      {children}
    </FirebaseContext.Provider>
  );
}

// Custom hook to use the Firebase context
export const useFirebase = () => useContext(FirebaseContext); 