'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import IconSelector from '@/components/admin/IconSelector';
import { saveService } from '@/lib/firebase/api/services';

interface ServiceFormData {
  title: string;
  description: string;
  features: string[];
  icon: string;
  color: string;
  isActive: boolean;
  order: number;
}

// Service color options
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

export default function NewServicePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    features: [],
    icon: '',
    color: 'from-indigo-500 to-blue-500', // Default color
    isActive: true,
    order: 0,
  });
  const [newFeature, setNewFeature] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await saveService({
        ...formData,
        isActive: true, // New services are active by default
      });

      if (result.success) {
        router.push('/admin/services');
      } else {
        setError(result.error || 'Failed to create service');
      }
    } catch (err) {
      setError('Failed to create service');
      console.error('Error creating service:', err);
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

  return (
    <div>
      <h1 className="text-3xl font-medium mb-8 text-white">New Service</h1>

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

        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/services"
            className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Service'}
          </button>
        </div>
      </form>
    </div>
  );
} 