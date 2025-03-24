'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
  order: number;
  isActive: boolean;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      const servicesSnap = await getDocs(collection(db, 'services'));
      const servicesData = servicesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
      
      // Sort services by order
      servicesData.sort((a, b) => a.order - b.order);
      setServices(servicesData);
    } catch (err) {
      setError('Failed to fetch services');
      console.error('Error fetching services:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleServiceActive(id: string, currentStatus: boolean) {
    try {
      const serviceRef = doc(db, 'services', id);
      
      console.log(`Toggling service ${id} from ${currentStatus} to ${!currentStatus}`);
      
      // Always ensure we're setting a proper boolean value, not a string or number
      const newActiveStatus = !currentStatus;
      
      await updateDoc(serviceRef, { 
        isActive: newActiveStatus,
        updatedAt: new Date()
      });
      
      console.log(`Service ${id} active status updated to ${newActiveStatus}`);
      
      // Update local state to reflect the change
      setServices(prevServices => 
        prevServices.map(service => 
          service.id === id ? { ...service, isActive: newActiveStatus } : service
        )
      );
    } catch (err) {
      setError('Failed to update service');
      console.error('Error updating service:', err);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await deleteDoc(doc(db, 'services', id));
      setServices(services.filter(service => service.id !== id));
    } catch (err) {
      setError('Failed to delete service');
      console.error('Error deleting service:', err);
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-medium">Services</h1>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Services</h1>
      <div className="flex space-x-4 mb-8">
        <Link href="/admin/services/new" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Create New Service
        </Link>
        <Link href="/admin/services/icon-helper" className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
          Icon Helper
        </Link>
        <Link href="/admin/services/fix-icons" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Fix Icons
        </Link>
        <Link href="/admin/services/fix-active-status" className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
          Fix Active Status
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="text-2xl" dangerouslySetInnerHTML={{ __html: service.icon }} />
                  <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                    {service.title}
                  </h2>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    service.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleServiceActive(service.id, service.isActive)}
                  className={`p-2 ${
                    service.isActive 
                      ? 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
                      : 'text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  } transition-colors`}
                  title={service.isActive ? 'Deactivate service' : 'Activate service'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={service.isActive 
                        ? "M5 13l4 4L19 7" 
                        : "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636"} 
                    />
                  </svg>
                </button>
                <Link
                  href={`/admin/services/${service.id}`}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </Link>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">No services found. Add your first service to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
} 