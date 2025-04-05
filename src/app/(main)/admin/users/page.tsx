'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AdminUser {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check authentication status
    if (!auth) return;
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Redirect to login if not authenticated
        router.push('/admin/login');
        return;
      }

      // If authenticated, fetch admin users
      fetchAdminUsers();
    });

    return () => unsubscribe();
  }, [router]);

  async function fetchAdminUsers() {
    try {
      if (!db) throw new Error('Database not initialized');

      // Query admin users
      const adminQuery = query(collection(db, 'users'), where('role', '==', 'admin'));
      const adminSnapshot = await getDocs(adminQuery);
      
      const admins: AdminUser[] = [];
      adminSnapshot.forEach((doc) => {
        const data = doc.data();
        admins.push({
          id: doc.id,
          email: data.email || 'No email',
          createdAt: data.createdAt || 'Unknown',
          updatedAt: data.updatedAt || 'Unknown',
          lastLogin: data.lastLogin || 'Never',
        });
      });

      setAdminUsers(admins);
    } catch (err) {
      console.error('Error fetching admin users:', err);
      setError('Failed to fetch admin users');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateAdmin(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');
    setIsCreatingUser(true);

    try {
      // Basic validation
      if (newUserPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (newUserPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, newUserEmail, newUserPassword);
      const { user } = userCredential;

      // Create user document with admin role
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      setSuccessMessage(`Admin account for ${newUserEmail} created successfully!`);
      
      // Reset form
      setNewUserEmail('');
      setNewUserPassword('');
      setConfirmPassword('');
      setShowNewUserForm(false);
      
      // Refresh list
      fetchAdminUsers();
    } catch (error) {
      const firebaseError = error as { code?: string, message: string };
      
      const errorMap: Record<string, string> = {
        'auth/email-already-in-use': 'This email is already registered.',
        'auth/invalid-email': 'Please provide a valid email address.',
        'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
        'auth/operation-not-allowed': 'Account creation is disabled.',
      };
      
      setFormError(
        firebaseError.code && errorMap[firebaseError.code]
          ? errorMap[firebaseError.code]
          : firebaseError.message || 'Failed to create account. Please try again.'
      );
    } finally {
      setIsCreatingUser(false);
    }
  }

  // Format date from ISO string
  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'Unknown') return 'Unknown';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading admin users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-800 dark:text-red-300">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Users</h1>
        <button 
          onClick={() => setShowNewUserForm(prev => !prev)} 
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
        >
          {showNewUserForm ? 'Cancel' : 'Add New Admin'}
        </button>
      </div>

      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-green-800 dark:text-green-300">
          <p>{successMessage}</p>
        </div>
      )}

      {showNewUserForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Create New Admin User</h2>
          
          {formError && (
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-red-800 dark:text-red-300 mb-4">
              <p>{formError}</p>
            </div>
          )}
          
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isCreatingUser}
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
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isCreatingUser}
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
                disabled={isCreatingUser}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isCreatingUser}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingUser ? 'Creating...' : 'Create Admin User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {adminUsers.length === 0 ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-yellow-800 dark:text-yellow-300">
          <p>No admin users found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 text-sm font-medium">Email</th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 text-sm font-medium">Created At</th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 text-sm font-medium">Last Updated</th>
                <th className="py-3 px-4 text-left text-gray-700 dark:text-gray-300 text-sm font-medium">Last Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {adminUsers.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{admin.email}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{formatDate(admin.createdAt)}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{formatDate(admin.updatedAt)}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{formatDate(admin.lastLogin || 'Never')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-2">Admin Access Information</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          Each admin user has full access to the admin portal and can:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
          <li>Manage projects and services</li>
          <li>Update company information</li>
          <li>View contact form submissions</li>
          <li>Create additional admin accounts</li>
        </ul>
      </div>
    </div>
  );
} 