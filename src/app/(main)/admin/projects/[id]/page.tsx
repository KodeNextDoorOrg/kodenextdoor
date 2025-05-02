'use client';

import { db } from '@/lib/firebase';
import { updateProject } from '@/lib/firebase/api/projects';
import { Project } from '@/lib/firebase/models/types';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    imageUrl: '',
    technologies: '',
    features: '',
    isActive: true,
    order: 0,
    liveUrl: ''
  });

  useEffect(() => {
    if (!id) {
      setError('Project ID is missing.');
      setIsLoading(false);
      return;
    }

    async function fetchProject() {
      try {
        setIsLoading(true);
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const projectData = { id: docSnap.id, ...docSnap.data() } as Project;
          setProject(projectData);
          
          setFormData({
            title: projectData.title || '',
            description: projectData.description || '',
            category: projectData.category || '',
            imageUrl: projectData.imageUrl || '',
            technologies: projectData.technologies?.join(', ') || '',
            features: projectData.features?.join(', ') || '',
            isActive: projectData.isActive ?? true,
            order: projectData.order || 0,
            liveUrl: projectData.liveUrl || ''
          });
        } else {
          setError('Project not found');
        }
      } catch {
        setError('Failed to load project');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'order') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
        setError('Cannot save project without an ID.');
        return;
    }
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const processedData = {
        ...formData,
        technologies: formData.technologies.split(',').map(item => item.trim()).filter(Boolean),
        features: formData.features.split(',').map(item => item.trim()).filter(Boolean)
      };

      const result = await updateProject(id, processedData);

      if (result.success) {
        setSuccessMessage('Project updated successfully!');
        setProject({
          ...project!,
          ...processedData
        });
      } else {
        throw new Error(result.error || 'Failed to update project');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="p-6">
        <div className="bg-red-900/30 text-red-300 p-4 rounded-lg mb-6">
          {error}
        </div>
        <Link
          href="/admin/projects"
          className="inline-flex items-center text-primary hover:underline"
        >
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-medium text-white">Edit Project</h1>
        <Link
          href="/admin/projects"
          className="flex items-center space-x-2 text-gray-300 hover:text-primary transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Projects</span>
        </Link>
      </div>

      {successMessage && (
        <div className="bg-green-900/30 text-green-300 p-4 rounded-lg mb-6">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 text-red-300 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1 text-gray-300">
              Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-gray-700 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1 text-gray-300">
              Category
            </label>
            <input
              id="category"
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-gray-700 text-white"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-gray-700 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium mb-1 text-gray-300">
              Image URL
            </label>
            <input
              id="imageUrl"
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-gray-700 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="liveUrl" className="block text-sm font-medium mb-1 text-gray-300">
              Live URL
            </label>
            <input
              id="liveUrl"
              type="text"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-gray-700 text-white"
            />
          </div>

          <div>
            <label htmlFor="technologies" className="block text-sm font-medium mb-1 text-gray-300">
              Technologies (comma-separated)
            </label>
            <input
              id="technologies"
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-gray-700 text-white"
            />
          </div>

          <div>
            <label htmlFor="features" className="block text-sm font-medium mb-1 text-gray-300">
              Features (comma-separated)
            </label>
            <input
              id="features"
              type="text"
              name="features"
              value={formData.features}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-gray-700 text-white"
            />
          </div>

          <div>
            <label htmlFor="order" className="block text-sm font-medium mb-1 text-gray-300">
              Order
            </label>
            <input
              id="order"
              type="number"
              name="order"
              value={formData.order}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-gray-700 text-white"
            />
          </div>

          <div className="flex items-center">
            <input
              id="isActive"
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-600 rounded bg-gray-700"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-300">
              Active
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/projects"
            className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 