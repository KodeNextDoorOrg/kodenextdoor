'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { 
  doc, 
  setDoc,
  getDoc,
  collection,
  query,
  getDocs,
  where
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Admin setup key from environment variables
const ADMIN_SETUP_KEY = process.env.NEXT_PUBLIC_ADMIN_SETUP_KEY || '';

export default function SetupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [adminExists, setAdminExists] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [setupKey, setSetupKey] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Check if admin already exists when page loads
  useState(() => {
    const checkAdminExists = async () => {
      try {
        // First check settings document
        const settingsDoc = await getDoc(doc(db, 'settings', 'adminSetup'));
        if (settingsDoc.exists()) {
          setAdminExists(true);
          setIsChecking(false);
          return;
        }

        // Then check if any admin users exist
        const q = query(collection(db, 'users'), where('role', '==', 'admin'));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setAdminExists(true);
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        // Continue anyway, as the user might still be able to set up an admin
      } finally {
        setIsChecking(false);
      }
    };

    checkAdminExists();
  }, []);

  // Handle admin setup
  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      // Basic validation
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      if (setupKey !== ADMIN_SETUP_KEY) {
        throw new Error('Invalid setup key');
      }

      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      // Sign in again to ensure token is fresh
      await signInWithEmailAndPassword(auth, email, password);

      // Create user document first
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Then create the admin setup document
      await setDoc(doc(db, 'settings', 'adminSetup'), {
        isSetUp: true,
        setupDate: new Date().toISOString(),
        setupBy: user.email
      });

      setSuccessMessage('Admin account created successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin');
      }, 2000);

    } catch (err: any) {
      console.error('Error in setup:', err);
      
      // Handle specific error messages
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else {
        setError(err.message || 'Failed to create admin account');
      }

      // Try to clean up if there was an error
      try {
        if (auth.currentUser) {
          await auth.currentUser.delete();
        }
      } catch (deleteErr) {
        console.error('Error cleaning up after setup failure:', deleteErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Checking admin status...</p>
        </div>
      </div>
    );
  }

  if (adminExists) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Admin Already Set Up
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            An admin account already exists. Please use the login page instead.
          </p>
          <Link
            href="/admin/login"
            className="block w-full text-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Go to Login
          </Link>
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

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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