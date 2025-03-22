'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Stats {
  projects: number;
  services: number;
  companyInfo: {
    yearsExperience: number;
    projectsCompleted: number;
    clientSatisfaction: number;
  };
}

interface CompanyInfo extends DocumentData {
  yearsExperience: number;
  projectsCompleted: number;
  clientSatisfaction: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    services: 0,
    companyInfo: {
      yearsExperience: 0,
      projectsCompleted: 0,
      clientSatisfaction: 0,
    },
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

      // If authenticated, fetch stats
      fetchStats();
    });

    return () => unsubscribe();
  }, [router]);

  async function fetchStats() {
    try {
      if (!db) throw new Error('Database not initialized');

      const [projectsSnap, servicesSnap, companyInfoSnap] = await Promise.all([
        getDocs(collection(db, 'projects')),
        getDocs(collection(db, 'services')),
        getDocs(collection(db, 'companyInfo')),
      ]);

      const companyInfo = companyInfoSnap.docs[0]?.data() as CompanyInfo || {
        yearsExperience: 0,
        projectsCompleted: 0,
        clientSatisfaction: 0,
      };

      setStats({
        projects: projectsSnap.size,
        services: servicesSnap.size,
        companyInfo,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to fetch dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Projects Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">Projects</h2>
            <Link
              href="/admin/projects"
              className="text-primary hover:text-primary-dark transition-colors"
            >
              View All
            </Link>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.projects}</p>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Total Projects</p>
        </div>

        {/* Services Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">Services</h2>
            <Link
              href="/admin/services"
              className="text-primary hover:text-primary-dark transition-colors"
            >
              View All
            </Link>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.services}</p>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Active Services</p>
        </div>

        {/* Client Satisfaction Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">Client Satisfaction</h2>
            <Link
              href="/admin/company"
              className="text-primary hover:text-primary-dark transition-colors"
            >
              Update
            </Link>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.companyInfo.clientSatisfaction}%
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Average Rating</p>
        </div>

        {/* Years Experience Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">Experience</h2>
            <Link
              href="/admin/company"
              className="text-primary hover:text-primary-dark transition-colors"
            >
              Update
            </Link>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.companyInfo.yearsExperience}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Years of Experience</p>
        </div>

        {/* Projects Completed Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">Completed</h2>
            <Link
              href="/admin/company"
              className="text-primary hover:text-primary-dark transition-colors"
            >
              Update
            </Link>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.companyInfo.projectsCompleted}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Projects Completed</p>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/admin/projects/new"
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Project
            </Link>
            <Link
              href="/admin/services/new"
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Service
            </Link>
            <Link
              href="/admin/messages"
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              View Contact Messages
            </Link>
            <Link
              href="/admin/contact"
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Update Contact Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 