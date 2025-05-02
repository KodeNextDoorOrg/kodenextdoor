'use client';

import IconSelector from '@/components/admin/IconSelector';
import { deleteService, getServiceById, updateService } from '@/lib/firebase/api/services';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// Service color options - same as new page
const colorOptions = [
  { name: 'Indigo to Blue', value: 'from-indigo-500 to-blue-500' },
  { name: 'Green to Teal', value: 'from-green-500 to-teal-500' },
  { name: 'Purple to Indigo', value: 'from-purple-500 to-indigo-500' },
  { name: 'Blue to Cyan', value: 'from-blue-500 to-cyan-500' },
  { name: 'Red to Orange', value: 'from-red-500 to-orange-500' },
  { name: 'Amber to Yellow', value: 'from-amber-500 to-yellow-500' },
  { name: 'Rose to Pink', value: 'from-rose-500 to-pink-500' },
  { name: 'Violet to Purple', value: 'from-violet-500 to-purple-500' }
];

interface ServiceFormData {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
  color: string;
  isActive: boolean;
  order: number;
}

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    id: '',
    title: '',
    description: '',
    features: [],
    icon: '',
    color: 'from-indigo-500 to-blue-500',
    isActive: true,
    order: 0
  });

  const [newFeature, setNewFeature] = useState('');

  // Fetch service data
  useEffect(() => {
    async function fetchService() {
      try {
        setIsLoading(true);
        const service = await getServiceById(id);

        if (service) {
          setFormData({
            id: service.id,
            title: service.title,
            description: service.description,
            features: service.features || [],
            icon: service.icon || '',
            color: service.color || 'from-indigo-500 to-blue-500',
            isActive: service.isActive !== false, // Default to true if not set
            order: service.order || 0
          });
        } else {
          setError('Service not found');
        }
      } catch (err) {
        console.error('Error fetching service:', err);
        setError('Failed to load service');
      } finally {
        setIsLoading(false);
      }
    }

    fetchService();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await updateService(id, {
        title: formData.title,
        description: formData.description,
        features: formData.features,
        icon: formData.icon,
        color: formData.color,
        isActive: formData.isActive
      });

      if (result.success) {
        router.push('/admin/services');
      } else {
        setError(result.error || 'Failed to update service');
      }
    } catch (err) {
      console.error('Error updating service:', err);
      setError('Failed to update service');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await deleteService(id);

      if (result.success) {
        router.push('/admin/services');
      } else {
        setError(result.error || 'Failed to delete service');
      }
    } catch (err) {
      console.error('Error deleting service:', err);
      setError('Failed to delete service');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleAddFeature(e: React.FormEvent) {
    e.preventDefault();
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  }

  function handleRemoveFeature(feature: string) {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/4 mb-8"></div>
        <div className="space-y-6">
          <div className="h-10 bg-gray-700 rounded w-full"></div>
          <div className="h-32 bg-gray-700 rounded w-full"></div>
          <div className="h-10 bg-gray-700 rounded w-full"></div>
          <div className="h-20 bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-medium mb-8 text-white">Edit Service</h1>

      {error && (
        <div className="bg-red-900/30 text-red-300 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Service Title
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Icon
          </label>
          <IconSelector 
            value={formData.icon}
            onChange={(iconValue) => setFormData(prev => ({ ...prev, icon: iconValue }))}
            className="mb-2"
          />
          <p className="mt-1 text-sm text-gray-400">
            Select an icon from the list or enter a custom SVG code
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Color Theme
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {colorOptions.map((color) => (
              <div 
                key={color.value}
                className={`
                  p-4 rounded-lg cursor-pointer border-2 
                  ${formData.color === color.value 
                    ? 'border-primary' 
                    : 'border-transparent'}
                  hover:scale-105 transition-transform
                `}
                onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
              >
                <div 
                  className={`h-12 rounded-md mb-2 bg-gradient-to-r ${color.value}`}
                ></div>
                <div className="text-xs text-center text-gray-300">
                  {color.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Features
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.features.map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-700 text-gray-300"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(feature)}
                  className="ml-2 text-gray-400 hover:text-gray-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add feature"
              className="flex-1 px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddFeature(e);
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-600 rounded bg-gray-700"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-300">
            Active
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 border border-red-600 rounded-md text-red-400 hover:bg-red-900/30 transition-colors"
          >
            Delete Service
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 