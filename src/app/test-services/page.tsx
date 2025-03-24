'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Service {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  // Add other fields as needed
}

export default function TestServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggleStatus, setToggleStatus] = useState<{id: string, success: boolean, message: string} | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      console.log('TEST PAGE: Fetching all services directly without filters');
      setLoading(true);
      
      // Fetch all services without filtering
      const querySnapshot = await getDocs(collection(db, 'services'));
      const allServices = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data
        };
      }) as Service[];
      
      setServices(allServices);
      
      // Also fetch filtered services to compare
      const filteredQuery = query(
        collection(db, 'services'),
        where('isActive', '==', true),
        orderBy('order', 'asc')
      );
      
      const filteredSnap = await getDocs(filteredQuery);
      const filteredData = filteredSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
      
      setFilteredServices(filteredData);
      
      console.log('TEST PAGE: All services:', allServices.length);
      console.log('TEST PAGE: Filtered services:', filteredData.length);
    } catch (err) {
      console.error('TEST PAGE: Error fetching services:', err);
      setError('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }
  
  async function toggleActiveStatus(id: string, currentStatus: boolean) {
    try {
      setToggleStatus(null);
      
      const serviceRef = doc(db, 'services', id);
      const newStatus = !currentStatus;
      
      await updateDoc(serviceRef, {
        isActive: newStatus,
        updatedAt: new Date()
      });
      
      // Update local state
      setServices(prev => 
        prev.map(service => 
          service.id === id ? { ...service, isActive: newStatus } : service
        )
      );
      
      setToggleStatus({
        id,
        success: true,
        message: `Service active status changed to ${newStatus}`
      });
      
      // Refetch to see if filtering is working
      fetchServices();
    } catch (err) {
      console.error('Error toggling service:', err);
      setToggleStatus({
        id,
        success: false,
        message: 'Failed to update service'
      });
    }
  }

  if (loading) {
    return <div className="p-8">Loading services...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Test Services Page</h1>
      
      {toggleStatus && (
        <div className={`p-4 mb-4 rounded-md ${toggleStatus.success ? 'bg-green-100' : 'bg-red-100'}`}>
          {toggleStatus.message}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">All Services ({services.length})</h2>
          <div className="space-y-4">
            {services.map(service => (
              <div key={service.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{service.title}</h3>
                    <div className="mt-2">
                      <span className={`inline-block px-2 py-1 text-sm rounded ${
                        service.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="mt-2 text-sm">
                      <div><strong>ID:</strong> {service.id}</div>
                      <div><strong>isActive:</strong> {String(service.isActive)} (type: {typeof service.isActive})</div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleActiveStatus(service.id, Boolean(service.isActive))}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Toggle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Filtered Active Services ({filteredServices.length})</h2>
          <div className="space-y-4">
            {filteredServices.length === 0 ? (
              <div className="p-4 bg-yellow-100 rounded">
                No active services found with direct Firestore query filter.
              </div>
            ) : (
              filteredServices.map(service => (
                <div key={service.id} className="p-4 border rounded-lg border-green-300 bg-green-50">
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                  <div className="mt-2 text-sm">
                    <div><strong>ID:</strong> {service.id}</div>
                    <div><strong>isActive:</strong> {String(service.isActive)} (type: {typeof service.isActive})</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      <button
        onClick={fetchServices}
        className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
      >
        Refresh Data
      </button>
    </div>
  );
} 