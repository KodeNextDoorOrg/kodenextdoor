import { useState, useEffect } from 'react';
import { 
  saveService,
  getAllServices,
  updateService,
  deleteService
} from '@/lib/firebase/api/services';
import { Service } from '@/lib/firebase/models/types';

export default function ServicesPanel() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    color: '#3b82f6', // Default blue color
    features: '',
    isActive: true,
    order: 0
  });
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const fetchedServices = await getAllServices();
        setServices(fetchedServices);
      } catch (err) {
        setError('Failed to load services');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Reset form data when editingService changes
  useEffect(() => {
    if (editingService) {
      setFormData({
        title: editingService.title || '',
        description: editingService.description || '',
        icon: editingService.icon || '',
        color: editingService.color || '#3b82f6',
        features: editingService.features?.join(', ') || '',
        isActive: editingService.isActive ?? true,
        order: editingService.order || 0
      });
    } else {
      setFormData({
        title: '',
        description: '',
        icon: '',
        color: '#3b82f6',
        features: '',
        isActive: true,
        order: services.length // Set default order to the end of the list
      });
    }
  }, [editingService, services.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      // Handle checkbox input
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'order') {
      // Ensure order is a number
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      // Handle text/select inputs
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);
    
    try {
      const processedData = {
        ...formData,
        features: formData.features.split(',').map(item => item.trim()).filter(Boolean)
      };

      let result;
      if (editingService) {
        // Update existing service
        result = await updateService(editingService.id, processedData);
        if (result.success) {
          setSubmitStatus({ type: 'success', message: 'Service updated successfully!' });
          // Update local state
          setServices(prev => 
            prev.map(s => s.id === editingService.id ? { ...s, ...processedData, id: editingService.id } : s)
          );
        } else {
          throw new Error(result.error || 'Failed to update service');
        }
      } else {
        // Create new service
        result = await saveService(processedData);
        if (result.success && result.id) {
          setSubmitStatus({ type: 'success', message: 'Service created successfully!' });
          // Add to local state
          setServices(prev => [...prev, { ...processedData, id: result.id! }]);
        } else {
          throw new Error(result.error || 'Failed to create service');
        }
      }

      // Reset form if successful
      if (result.success) {
        setEditingService(null);
        setFormData({
          title: '',
          description: '',
          icon: '',
          color: '#3b82f6',
          features: '',
          isActive: true,
          order: services.length + (editingService ? 0 : 1)
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setSubmitStatus({ type: 'error', message: errorMessage });
      console.error(err);
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      const result = await deleteService(serviceId);
      if (result.success) {
        setServices(prev => prev.filter(s => s.id !== serviceId));
        setSubmitStatus({ type: 'success', message: 'Service deleted successfully!' });
        
        // If we're editing this service, clear the form
        if (editingService && editingService.id === serviceId) {
          setEditingService(null);
        }
      } else {
        throw new Error(result.error || 'Failed to delete service');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setSubmitStatus({ type: 'error', message: errorMessage });
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading services...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Services</h2>
      
      {/* Status message */}
      {submitStatus && (
        <div className={`p-4 mb-6 rounded ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {submitStatus.message}
        </div>
      )}

      {/* Services form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">
          {editingService ? 'Edit Service' : 'Add New Service'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Icon (FontAwesome class or SVG path)</label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="fa-solid fa-code or <svg>...</svg>"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              className="w-full p-1 border rounded h-10"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Features (comma separated)</label>
            <input
              type="text"
              name="features"
              value={formData.features}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Feature 1, Feature 2, Feature 3"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Order</label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="mr-2"
              id="isActive"
            />
            <label htmlFor="isActive" className="text-sm font-medium">Active</label>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editingService ? 'Update Service' : 'Add Service'}
          </button>
          
          {editingService && (
            <button
              type="button"
              onClick={() => setEditingService(null)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Services list */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Existing Services</h3>
        
        {services.length === 0 ? (
          <p className="text-gray-500">No services yet. Add your first service above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Title</th>
                  <th className="py-2 px-4 text-left">Description</th>
                  <th className="py-2 px-4 text-left">Order</th>
                  <th className="py-2 px-4 text-center">Status</th>
                  <th className="py-2 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.sort((a, b) => (a.order || 0) - (b.order || 0)).map(service => (
                  <tr key={service.id} className="border-t">
                    <td className="py-2 px-4">
                      <div className="flex items-center">
                        <div 
                          className="w-6 h-6 rounded-full mr-2" 
                          style={{ backgroundColor: service.color || '#3b82f6' }}
                        ></div>
                        {service.title}
                      </div>
                    </td>
                    <td className="py-2 px-4">{service.description?.substring(0, 50)}...</td>
                    <td className="py-2 px-4">{service.order}</td>
                    <td className="py-2 px-4 text-center">
                      <span className={`inline-block rounded-full px-2 py-1 text-xs ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-right">
                      <button
                        onClick={() => setEditingService(service)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
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
  );
} 