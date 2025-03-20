'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface CompanyInfo {
  yearsExperience: number;
  projectsCompleted: number;
  clientSatisfaction: number;
  aboutUs: string;
  mission: string;
  vision: string;
}

export default function CompanyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    yearsExperience: 0,
    projectsCompleted: 0,
    clientSatisfaction: 0,
    aboutUs: '',
    mission: '',
    vision: '',
  });

  useEffect(() => {
    // Check authentication status
    if (!auth) return;
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Redirect to login if not authenticated
        router.push('/admin/login');
        return;
      }

      // If authenticated, fetch company info
      fetchCompanyInfo();
    });

    return () => unsubscribe();
  }, [router]);

  async function fetchCompanyInfo() {
    try {
      if (!db) throw new Error('Database not initialized');

      const docRef = doc(db, 'companyInfo', 'main');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCompanyInfo(docSnap.data() as CompanyInfo);
      }
    } catch (err) {
      console.error('Error fetching company info:', err);
      setError('Failed to fetch company information');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSaving(true);

    try {
      if (!db) throw new Error('Database not initialized');

      await setDoc(doc(db, 'companyInfo', 'main'), companyInfo);
      setSuccessMessage('Company information updated successfully');
    } catch (err) {
      console.error('Error saving company info:', err);
      setError('Failed to save company information');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Company Information</h1>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-4 rounded-lg mb-6">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              id="yearsExperience"
              value={companyInfo.yearsExperience}
              onChange={(e) => setCompanyInfo({ ...companyInfo, yearsExperience: parseInt(e.target.value) || 0 })}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="projectsCompleted" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Projects Completed
            </label>
            <input
              type="number"
              id="projectsCompleted"
              value={companyInfo.projectsCompleted}
              onChange={(e) => setCompanyInfo({ ...companyInfo, projectsCompleted: parseInt(e.target.value) || 0 })}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="clientSatisfaction" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Client Satisfaction (%)
            </label>
            <input
              type="number"
              id="clientSatisfaction"
              value={companyInfo.clientSatisfaction}
              onChange={(e) => setCompanyInfo({ ...companyInfo, clientSatisfaction: parseInt(e.target.value) || 0 })}
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="aboutUs" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            About Us
          </label>
          <textarea
            id="aboutUs"
            value={companyInfo.aboutUs}
            onChange={(e) => setCompanyInfo({ ...companyInfo, aboutUs: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="mission" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Our Mission
          </label>
          <textarea
            id="mission"
            value={companyInfo.mission}
            onChange={(e) => setCompanyInfo({ ...companyInfo, mission: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="vision" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Our Vision
          </label>
          <textarea
            id="vision"
            value={companyInfo.vision}
            onChange={(e) => setCompanyInfo({ ...companyInfo, vision: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:bg-gray-400"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 