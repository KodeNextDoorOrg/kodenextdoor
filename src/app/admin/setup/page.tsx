'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  writeBatch,
  collection,
  query,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Admin setup key from environment variables
const ADMIN_SETUP_KEY = process.env.NEXT_PUBLIC_ADMIN_SETUP_KEY || '';

export default function SetupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [setupKey, setSetupKey] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize Firebase Auth persistence
  useEffect(() => {
    const initAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (err) {
        console.error('Error setting auth persistence:', err);
      }
    };
    initAuth();
  }, []);

  // Check if setup is allowed and handle auth state
  useEffect(() => {
    let unsubscribe: () => void;

    const checkSetupStatus = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Check if any admin users exist
        const usersRef = collection(db, 'users');
        const q = query(usersRef);
        const querySnapshot = await getDocs(q);
        const hasAdmins = querySnapshot.docs.some(doc => doc.data().role === 'admin');

        if (hasAdmins) {
          console.log('Admin already exists, redirecting to login');
          setIsRedirecting(true);
          router.push('/admin/login');
          return;
        }

        // Set up auth state listener
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            // If user is logged in during setup, sign them out
            await signOut(auth);
          }
          setIsLoading(false);
        });

      } catch (err: any) {
        console.error('Error checking setup status:', err);
        if (err.code !== 'permission-denied') {
          setError('Error checking setup status. Please try again.');
        }
        setIsLoading(false);
      }
    };

    checkSetupStatus();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [router]);

  // Handle admin setup
  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (setupKey !== ADMIN_SETUP_KEY) {
      setError('Invalid setup key');
      return;
    }

    try {
      setIsLoading(true);

      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      // Use a batch write for better atomicity
      const batch = writeBatch(db);

      // Add user data
      batch.set(doc(db, 'users', user.uid), {
        email: user.email,
        role: 'admin',
        createdAt: new Date().toISOString(),
      });

      // Record admin setup
      batch.set(doc(db, 'settings', 'adminSetup'), {
        isSetUp: true,
        setupDate: new Date().toISOString(),
        setupBy: user.email
      });

      await batch.commit();

      setSuccessMessage('Admin account created successfully!');
      setIsRedirecting(true);
      
      // Give time for the success message to be seen
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    } catch (err: any) {
      console.error('Error creating admin account:', err);
      
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please try logging in instead.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format. Please check your email address.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else if (err.code === 'permission-denied') {
        setError('Permission denied. Please check your Firebase security rules.');
      } else {
        setError(err.message || 'Failed to create admin account');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            {isRedirecting ? 'Redirecting...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          Admin Setup
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Create your admin account to manage your website content
        </p>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSetup} className="space-y-4">
          <div>
            <label htmlFor="setupKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Setup Key
            </label>
            <input
              type="text"
              id="setupKey"
              required
              value={setupKey}
              onChange={(e) => setSetupKey(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create Admin Account'}
          </button>

          <div className="text-center mt-4">
            <Link
              href="/admin/login"
              className="text-primary hover:underline text-sm font-medium"
            >
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 