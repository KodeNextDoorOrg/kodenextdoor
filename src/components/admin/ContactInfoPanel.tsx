import { useState, useEffect } from 'react';
import { 
  getContactInfo,
  saveContactInfo,
  updateContactInfo,
  getAllBusinessHours,
  saveBusinessHours,
  updateBusinessHours
} from '@/lib/firebase/api/contactInfo';
import { ContactInfo, BusinessHour } from '@/lib/firebase/models/types';

export default function ContactInfoPanel() {
  // Contact Info state
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [contactFormData, setContactFormData] = useState({
    email: '',
    phone: '',
    address: '',
    googleMapsUrl: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: ''
  });

  // Business Hours state
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  const [editingHour, setEditingHour] = useState<BusinessHour | null>(null);
  const [hourFormData, setHourFormData] = useState({
    day: 'Monday',
    isOpen: true,
    openTime: '09:00',
    closeTime: '17:00'
  });

  // Common state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
    section?: 'contact' | 'hours';
  } | null>(null);

  // Fetch contact info and business hours on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch contact info
        const info = await getContactInfo();
        setContactInfo(info);
        
        if (info) {
          setContactFormData({
            email: info.email || '',
            phone: info.phone || '',
            address: info.address || '',
            googleMapsUrl: info.googleMapsUrl || '',
            facebook: info.facebook || '',
            twitter: info.twitter || '',
            instagram: info.instagram || '',
            linkedin: info.linkedin || ''
          });
        }
        
        // Fetch business hours
        const hours = await getAllBusinessHours();
        setBusinessHours(hours);
        
      } catch (err) {
        setError('Failed to load contact information');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset hour form data when editingHour changes
  useEffect(() => {
    if (editingHour) {
      setHourFormData({
        day: editingHour.day || 'Monday',
        isOpen: editingHour.isOpen ?? true,
        openTime: editingHour.openTime || '09:00',
        closeTime: editingHour.closeTime || '17:00'
      });
    } else {
      setHourFormData({
        day: 'Monday',
        isOpen: true,
        openTime: '09:00',
        closeTime: '17:00'
      });
    }
  }, [editingHour]);

  // Handle contact form input changes
  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle business hour form input changes
  const handleHourInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      // Handle checkbox input
      const checked = (e.target as HTMLInputElement).checked;
      setHourFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      // Handle text/select inputs
      setHourFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Save or update contact info
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);
    
    try {
      let result;
      if (contactInfo) {
        // Update existing contact info
        result = await updateContactInfo(contactInfo.id, contactFormData);
        if (result.success) {
          setSubmitStatus({ 
            type: 'success', 
            message: 'Contact information updated successfully!',
            section: 'contact'
          });
          // Update local state
          setContactInfo(prev => prev ? { ...prev, ...contactFormData } : null);
        } else {
          throw new Error(result.error || 'Failed to update contact information');
        }
      } else {
        // Create new contact info
        result = await saveContactInfo(contactFormData);
        if (result.success && result.id) {
          setSubmitStatus({ 
            type: 'success', 
            message: 'Contact information saved successfully!',
            section: 'contact'
          });
          // Add to local state
          setContactInfo({ id: result.id, ...contactFormData });
        } else {
          throw new Error(result.error || 'Failed to save contact information');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setSubmitStatus({ 
        type: 'error', 
        message: errorMessage,
        section: 'contact'
      });
      console.error(err);
    }
  };

  // Save or update business hours
  const handleHourSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);
    
    try {
      let result;
      if (editingHour) {
        // Update existing hour
        result = await updateBusinessHours(editingHour.id, hourFormData);
        if (result.success) {
          setSubmitStatus({ 
            type: 'success', 
            message: 'Business hours updated successfully!',
            section: 'hours'
          });
          // Update local state
          setBusinessHours(prev => 
            prev.map(h => h.id === editingHour.id ? { ...h, ...hourFormData, id: editingHour.id } : h)
          );
        } else {
          throw new Error(result.error || 'Failed to update business hours');
        }
      } else {
        // Create new hour
        result = await saveBusinessHours(hourFormData);
        if (result.success && result.id) {
          setSubmitStatus({ 
            type: 'success', 
            message: 'Business hours saved successfully!',
            section: 'hours'
          });
          // Find existing day or add new
          const existingIndex = businessHours.findIndex(h => h.day === hourFormData.day);
          if (existingIndex >= 0) {
            // Replace the existing day
            setBusinessHours(prev => [
              ...prev.slice(0, existingIndex),
              { ...hourFormData, id: result.id! },
              ...prev.slice(existingIndex + 1)
            ]);
          } else {
            // Add new day
            setBusinessHours(prev => [...prev, { ...hourFormData, id: result.id! }]);
          }
        } else {
          throw new Error(result.error || 'Failed to save business hours');
        }
      }
      
      // Reset form
      setEditingHour(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setSubmitStatus({ 
        type: 'error', 
        message: errorMessage,
        section: 'hours'
      });
      console.error(err);
    }
  };

  // Edit a business hour
  const handleEditHour = (hour: BusinessHour) => {
    setEditingHour(hour);
  };

  if (loading) {
    return <div className="p-6 text-center">Loading contact information...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Contact Information</h2>
      
      {/* Contact Info Section */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4">Contact Details</h3>
        
        {submitStatus && submitStatus.section === 'contact' && (
          <div className={`p-4 mb-6 rounded ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {submitStatus.message}
          </div>
        )}
        
        <form onSubmit={handleContactSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={contactFormData.email}
                onChange={handleContactInputChange}
                className="w-full p-2 border rounded"
                placeholder="contact@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={contactFormData.phone}
                onChange={handleContactInputChange}
                className="w-full p-2 border rounded"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              name="address"
              value={contactFormData.address}
              onChange={handleContactInputChange}
              className="w-full p-2 border rounded"
              rows={2}
              placeholder="123 Main St, City, State, ZIP"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Google Maps URL</label>
            <input
              type="text"
              name="googleMapsUrl"
              value={contactFormData.googleMapsUrl}
              onChange={handleContactInputChange}
              className="w-full p-2 border rounded"
              placeholder="https://maps.google.com/?q=..."
            />
          </div>
          
          <h4 className="font-medium mb-2 mt-4">Social Media Links</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Facebook</label>
              <input
                type="text"
                name="facebook"
                value={contactFormData.facebook}
                onChange={handleContactInputChange}
                className="w-full p-2 border rounded"
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Twitter</label>
              <input
                type="text"
                name="twitter"
                value={contactFormData.twitter}
                onChange={handleContactInputChange}
                className="w-full p-2 border rounded"
                placeholder="https://twitter.com/yourhandle"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Instagram</label>
              <input
                type="text"
                name="instagram"
                value={contactFormData.instagram}
                onChange={handleContactInputChange}
                className="w-full p-2 border rounded"
                placeholder="https://instagram.com/yourhandle"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">LinkedIn</label>
              <input
                type="text"
                name="linkedin"
                value={contactFormData.linkedin}
                onChange={handleContactInputChange}
                className="w-full p-2 border rounded"
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Contact Information
          </button>
        </form>
      </div>
      
      {/* Business Hours Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
        
        {submitStatus && submitStatus.section === 'hours' && (
          <div className={`p-4 mb-6 rounded ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {submitStatus.message}
          </div>
        )}
        
        <form onSubmit={handleHourSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h4 className="text-lg font-medium mb-4">
            {editingHour ? `Edit Hours for ${editingHour.day}` : 'Add Business Hours'}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Day</label>
              <select
                name="day"
                value={hourFormData.day}
                onChange={handleHourInputChange}
                className="w-full p-2 border rounded"
                disabled={!!editingHour} // Disable if editing existing day
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isOpen"
                checked={hourFormData.isOpen}
                onChange={handleHourInputChange}
                className="mr-2"
                id="isOpen"
              />
              <label htmlFor="isOpen" className="text-sm font-medium">Open on this day</label>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Opening Time</label>
              <input
                type="time"
                name="openTime"
                value={hourFormData.openTime}
                onChange={handleHourInputChange}
                className="w-full p-2 border rounded"
                disabled={!hourFormData.isOpen}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Closing Time</label>
              <input
                type="time"
                name="closeTime"
                value={hourFormData.closeTime}
                onChange={handleHourInputChange}
                className="w-full p-2 border rounded"
                disabled={!hourFormData.isOpen}
              />
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingHour ? 'Update Hours' : 'Save Hours'}
            </button>
            
            {editingHour && (
              <button
                type="button"
                onClick={() => setEditingHour(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        
        {/* Business Hours List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium mb-4">Current Business Hours</h4>
          
          {businessHours.length === 0 ? (
            <p className="text-gray-500">No business hours set. Add hours above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left">Day</th>
                    <th className="py-2 px-4 text-left">Status</th>
                    <th className="py-2 px-4 text-left">Hours</th>
                    <th className="py-2 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {businessHours.map(hour => (
                    <tr key={hour.id} className="border-t">
                      <td className="py-2 px-4">{hour.day}</td>
                      <td className="py-2 px-4">
                        <span className={`inline-block rounded-full px-2 py-1 text-xs ${hour.isOpen ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {hour.isOpen ? 'Open' : 'Closed'}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        {hour.isOpen ? `${hour.openTime} - ${hour.closeTime}` : 'Closed'}
                      </td>
                      <td className="py-2 px-4 text-right">
                        <button
                          onClick={() => handleEditHour(hour)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 