'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface Service {
  id: string;
  title: string;
  icon: string;
}

// Common SVG icons that can be used as replacements
const commonIcons = {
  webDev: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>',
  mobile: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>',
  uiux: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>',
  cloud: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>'
};

export default function FixIconsPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [iconInput, setIconInput] = useState('');
  const [updateStatus, setUpdateStatus] = useState<{id: string, success: boolean} | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'services'));
      const servicesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
      
      setServices(servicesData);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  }

  function startEditing(service: Service) {
    setEditing(service.id);
    setIconInput(service.icon || '');
  }

  async function updateIcon(id: string) {
    try {
      const serviceRef = doc(db, 'services', id);
      await updateDoc(serviceRef, {
        icon: iconInput,
        updatedAt: new Date()
      });
      
      // Update local state
      setServices(services.map(service => 
        service.id === id ? { ...service, icon: iconInput } : service
      ));
      
      setUpdateStatus({ id, success: true });
      setEditing(null);
      
      // Clear status after a delay
      setTimeout(() => setUpdateStatus(null), 3000);
    } catch (err) {
      console.error('Error updating icon:', err);
      setUpdateStatus({ id, success: false });
    }
  }

  function setIconToSample(sampleIcon: string) {
    setIconInput(sampleIcon);
  }

  function isValidSvg(icon: string): boolean {
    return icon.trim().startsWith('<svg') && icon.trim().endsWith('</svg>');
  }

  if (loading) {
    return <div className="p-8">Loading services...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Fix Service Icons</h1>
      
      <div className="mb-8">
        <p className="mb-4">
          This utility helps you fix service icons that aren't displaying correctly.
        </p>
        
        <div className="flex space-x-4">
          <Link
            href="/admin/services/icon-helper"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Icon Helper
          </Link>
          
          <Link
            href="/admin/services"
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Back to Services
          </Link>
        </div>
      </div>
      
      <div className="space-y-6">
        {services.map(service => (
          <div key={service.id} className="bg-white border rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-medium">{service.title}</h2>
                <div className="mt-2 flex space-x-4 items-center">
                  <div 
                    className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center"
                  >
                    {isValidSvg(service.icon) ? (
                      <div dangerouslySetInnerHTML={{ __html: service.icon }} />
                    ) : (
                      <span className="text-xs">Invalid Icon</span>
                    )}
                  </div>
                  
                  <div className="text-sm">
                    <div className={`font-medium ${isValidSvg(service.icon) ? 'text-green-600' : 'text-red-600'}`}>
                      {isValidSvg(service.icon) ? 'Valid SVG' : 'Invalid SVG'}
                    </div>
                    <div className="text-gray-500">
                      SVG Length: {service.icon ? service.icon.length : 0} characters
                    </div>
                  </div>
                </div>
              </div>
              
              {updateStatus && updateStatus.id === service.id && (
                <div className={`px-3 py-1 rounded text-sm ${updateStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {updateStatus.success ? 'Updated!' : 'Failed to update'}
                </div>
              )}
              
              {editing !== service.id ? (
                <button
                  onClick={() => startEditing(service)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit Icon
                </button>
              ) : (
                <button
                  onClick={() => setEditing(null)}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
            
            {editing === service.id && (
              <div className="mt-4">
                <label className="block font-medium mb-2">Edit Icon SVG:</label>
                <textarea
                  value={iconInput}
                  onChange={(e) => setIconInput(e.target.value)}
                  className="w-full h-32 p-2 border rounded-md font-mono text-sm"
                  placeholder="Paste SVG code here..."
                />
                
                <div className="mt-4">
                  <div className="font-medium mb-2">Quick Fixes:</div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setIconToSample(commonIcons.webDev)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Web Development
                    </button>
                    <button
                      onClick={() => setIconToSample(commonIcons.mobile)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Mobile App
                    </button>
                    <button
                      onClick={() => setIconToSample(commonIcons.uiux)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      UI/UX Design
                    </button>
                    <button
                      onClick={() => setIconToSample(commonIcons.cloud)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Cloud
                    </button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button
                    onClick={() => updateIcon(service.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    disabled={!isValidSvg(iconInput)}
                  >
                    Update Icon
                  </button>
                  <div className={`mt-2 text-sm ${isValidSvg(iconInput) ? 'text-green-600' : 'text-red-600'}`}>
                    {isValidSvg(iconInput) ? 'Valid SVG' : 'Not a valid SVG - must start with <svg and end with </svg>'}
                  </div>
                </div>
                
                {isValidSvg(iconInput) && (
                  <div className="mt-4">
                    <div className="font-medium mb-2">Preview:</div>
                    <div className="w-16 h-16 bg-primary text-white rounded-lg flex items-center justify-center">
                      <div dangerouslySetInnerHTML={{ __html: iconInput }} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 