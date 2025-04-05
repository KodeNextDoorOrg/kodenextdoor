'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function FixActiveStatusPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fixing, setFixing] = useState(false);
  const [results, setResults] = useState<{fixed: string[], already: string[], errors: string[]}>({
    fixed: [],
    already: [],
    errors: []
  });

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      setLoading(true);
      const servicesSnap = await getDocs(collection(db, 'services'));
      const servicesData = servicesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        originalIsActive: doc.data().isActive, // Keep track of original value
        isActiveType: typeof doc.data().isActive
      }));
      
      setServices(servicesData);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fixAllServices() {
    try {
      setFixing(true);
      const fixed: string[] = [];
      const alreadyCorrect: string[] = [];
      const errors: string[] = [];

      for (const service of services) {
        try {
          // Check if isActive is already a boolean true
          if (typeof service.isActive === 'boolean') {
            alreadyCorrect.push(service.id);
            continue;
          }

          // Convert to a proper boolean
          let isActive: boolean;
          
          if (service.isActive === undefined || service.isActive === null) {
            isActive = false;
          } else if (typeof service.isActive === 'string') {
            isActive = service.isActive.toLowerCase() === 'true';
          } else if (typeof service.isActive === 'number') {
            isActive = service.isActive !== 0;
          } else {
            isActive = Boolean(service.isActive);
          }

          // Update the document in Firestore
          const serviceRef = doc(db, 'services', service.id);
          await updateDoc(serviceRef, { 
            isActive: isActive,
            updatedAt: new Date()
          });

          fixed.push(service.id);
        } catch (err) {
          console.error(`Error fixing service ${service.id}:`, err);
          errors.push(service.id);
        }
      }

      setResults({
        fixed,
        already: alreadyCorrect,
        errors
      });

      // Refresh the services
      await fetchServices();
    } catch (err) {
      console.error('Error fixing services:', err);
    } finally {
      setFixing(false);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Fix Service Active Status</h1>
      
      <div className="mb-8">
        <p className="mb-4">
          This utility fixes the <code>isActive</code> property for all services to ensure it's stored as a proper boolean value in Firestore.
        </p>
        
        <button
          onClick={fixAllServices}
          disabled={loading || fixing}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {fixing ? 'Fixing...' : 'Fix All Services'}
        </button>
      </div>
      
      {results.fixed.length > 0 && (
        <div className="mb-4 p-4 bg-green-50 rounded-md">
          <h2 className="font-semibold text-green-800">Fixed Services ({results.fixed.length})</h2>
          <ul className="list-disc ml-6 mt-2">
            {results.fixed.map(id => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        </div>
      )}
      
      {results.already.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-md">
          <h2 className="font-semibold text-blue-800">Already Correct ({results.already.length})</h2>
          <ul className="list-disc ml-6 mt-2">
            {results.already.map(id => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        </div>
      )}
      
      {results.errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 rounded-md">
          <h2 className="font-semibold text-red-800">Errors ({results.errors.length})</h2>
          <ul className="list-disc ml-6 mt-2">
            {results.errors.map(id => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="bg-gray-100 p-4 rounded-md overflow-auto">
        <h2 className="font-semibold mb-2">Current Services</h2>
        
        {loading ? (
          <p>Loading services...</p>
        ) : (
          <table className="w-full">
            <thead className="text-left">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Title</th>
                <th className="p-2">isActive</th>
                <th className="p-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service.id} className="border-t border-gray-200">
                  <td className="p-2 font-mono text-sm">{service.id}</td>
                  <td className="p-2">{service.title}</td>
                  <td className="p-2 font-mono">{String(service.isActive)}</td>
                  <td className="p-2 font-mono text-sm">{service.isActiveType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 