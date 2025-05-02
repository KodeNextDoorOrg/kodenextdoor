'use client';

import { db } from '@/lib/firebase';
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleServiceActive(id: string, currentStatus: boolean) {
    try {
      const serviceRef = doc(db, 'services', id);

      // Always ensure we're setting a proper boolean value, not a string or number
      const newActiveStatus = !currentStatus;

      await updateDoc(serviceRef, {
        isActive: newActiveStatus,
        updatedAt: new Date()
      });

      // Update local state to reflect the change
      setServices(prevServices =>
        prevServices.map(service =>
          service.id === id ? { ...service, isActive: newActiveStatus } : service
        )
      );
    } catch (err) {
      setError('Failed to update service');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await deleteDoc(doc(db, 'services', id));
      setServices(services.filter(service => service.id !== id));
    } catch (err) {
      setError('Failed to delete service');
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-medium text-white">Services</h1>
          <div className="h-10 bg-gray-700 rounded w-32"></div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="h-6 bg-gray-700 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 lg:p-8 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-medium text-white">Services</h1>
        <Link
          href="/admin/services/new"
          className="flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors w-full sm:w-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Service</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-900/30 text-red-300 p-4 rounded-lg mb-6">
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
            className="bg-gray-800 p-3 sm:p-4 lg:p-6 rounded-lg shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                  <div className="text-xl sm:text-2xl" dangerouslySetInnerHTML={{ __html: service.icon }} />
                  <h2 className="text-lg sm:text-xl font-medium text-white break-words">
                    {service.title}
                  </h2>
                  <span className={`px-2 py-1 text-xs rounded-full ${service.isActive
                    ? 'bg-green-900 text-green-200'
                    : 'bg-red-900 text-red-200'
                    }`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-300 mb-4 break-words">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs sm:text-sm break-words"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end sm:justify-start gap-2">
                <button
                  onClick={() => toggleServiceActive(service.id, service.isActive)}
                  className={`p-2 ${service.isActive
                    ? 'text-green-400 hover:text-green-300'
                    : 'text-gray-400 hover:text-gray-300'
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
                  className="p-2 text-gray-300 hover:text-primary transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </Link>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 text-red-400 hover:text-red-300 transition-colors"
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
            <p className="text-sm sm:text-base text-gray-300">No services found. Add your first service to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
} 