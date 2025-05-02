'use client';

import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  socialMedia: {
    linkedin: string;
    instagram: string;
    twitter: string;
  };
  businessHours: {
    weekdays: string;
    weekends: string;
  };
}

export default function ContactPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '',
    phone: '',
    address: '',
    socialMedia: {
      linkedin: '',
      instagram: '',
      twitter: '',
    },
    businessHours: {
      weekdays: '',
      weekends: '',
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

      // If authenticated, fetch contact info
      fetchContactInfo();
    });

    return () => unsubscribe();
  }, [router]);

  async function fetchContactInfo() {
    try {
      if (!db) throw new Error('Database not initialized');

      const docRef = doc(db, 'contact', 'info');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setContactInfo(docSnap.data() as ContactInfo);
      }
    } catch (err) {
      console.error('Error fetching contact info:', err);
      setError('Failed to fetch contact information');
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

      await setDoc(doc(db, 'contact', 'info'), contactInfo);
      setSuccessMessage('Contact information updated successfully');
    } catch (err) {
      console.error('Error saving contact info:', err);
      setError('Failed to save contact information');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-white mb-6">Contact Information</h1>

      {error && (
        <div className="bg-red-900/30 text-red-300 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-900/30 text-green-300 p-4 rounded-lg mb-6">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={contactInfo.email}
            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-gray-700 text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={contactInfo.phone}
            onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-gray-700 text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
            Address
          </label>
          <textarea
            id="address"
            value={contactInfo.address}
            onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-gray-700 text-white"
            required
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium text-white">Social Media Links</h2>

          <div>
            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-300 mb-1">
              LinkedIn
            </label>
            <input
              type="url"
              id="linkedin"
              value={contactInfo.socialMedia.linkedin}
              onChange={(e) => setContactInfo({
                ...contactInfo,
                socialMedia: { ...contactInfo.socialMedia, linkedin: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-gray-700 text-white"
            />
          </div>

          <div>
            <label htmlFor="github" className="block text-sm font-medium text-gray-300 mb-1">
              Instragram
            </label>
            <input
              type="url"
              id="instagram"
              value={contactInfo.socialMedia.instagram}
              onChange={(e) => setContactInfo({
                ...contactInfo,
                socialMedia: { ...contactInfo.socialMedia, instagram: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-gray-700 text-white"
            />
          </div>

          <div>
            <label htmlFor="twitter" className="block text-sm font-medium text-gray-300 mb-1">
              Twitter
            </label>
            <input
              type="url"
              id="twitter"
              value={contactInfo.socialMedia.twitter}
              onChange={(e) => setContactInfo({
                ...contactInfo,
                socialMedia: { ...contactInfo.socialMedia, twitter: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-gray-700 text-white"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium text-white">Business Hours</h2>

          <div>
            <label htmlFor="weekdays" className="block text-sm font-medium text-gray-300 mb-1">
              Weekdays
            </label>
            <input
              type="text"
              id="weekdays"
              value={contactInfo.businessHours.weekdays}
              onChange={(e) => setContactInfo({
                ...contactInfo,
                businessHours: { ...contactInfo.businessHours, weekdays: e.target.value }
              })}
              placeholder="e.g., Monday-Friday: 9:00 AM - 5:00 PM"
              className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-gray-700 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="weekends" className="block text-sm font-medium text-gray-300 mb-1">
              Weekends
            </label>
            <input
              type="text"
              id="weekends"
              value={contactInfo.businessHours.weekends}
              onChange={(e) => setContactInfo({
                ...contactInfo,
                businessHours: { ...contactInfo.businessHours, weekends: e.target.value }
              })}
              placeholder="e.g., Saturday-Sunday: Closed"
              className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-gray-700 text-white"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
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