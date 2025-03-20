import { useState, useEffect } from 'react';
import { 
  saveProject, 
  getAllProjects,
  deleteProject,
  updateProject
} from '@/lib/firebase/api/projects';
import { Project } from '@/lib/firebase/models/types';

export default function ProjectsPanel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    imageUrl: '',
    technologies: '',
    features: '',
    isActive: true,
    order: 0
  });
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const fetchedProjects = await getAllProjects();
        setProjects(fetchedProjects);
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Reset form data when editingProject changes
  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title || '',
        description: editingProject.description || '',
        category: editingProject.category || '',
        imageUrl: editingProject.imageUrl || '',
        technologies: editingProject.technologies?.join(', ') || '',
        features: editingProject.features?.join(', ') || '',
        isActive: editingProject.isActive ?? true,
        order: editingProject.order || 0
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        imageUrl: '',
        technologies: '',
        features: '',
        isActive: true,
        order: projects.length // Set default order to the end of the list
      });
    }
  }, [editingProject, projects.length]);

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
        technologies: formData.technologies.split(',').map(item => item.trim()).filter(Boolean),
        features: formData.features.split(',').map(item => item.trim()).filter(Boolean)
      };

      let result;
      if (editingProject) {
        // Update existing project
        result = await updateProject(editingProject.id, processedData);
        if (result.success) {
          setSubmitStatus({ type: 'success', message: 'Project updated successfully!' });
          // Update local state
          setProjects(prev => 
            prev.map(p => p.id === editingProject.id ? { ...p, ...processedData, id: editingProject.id } : p)
          );
        } else {
          throw new Error(result.error || 'Failed to update project');
        }
      } else {
        // Create new project
        result = await saveProject(processedData);
        if (result.success && result.id) {
          setSubmitStatus({ type: 'success', message: 'Project created successfully!' });
          // Add to local state
          setProjects(prev => [...prev, { ...processedData, id: result.id! }]);
        } else {
          throw new Error(result.error || 'Failed to create project');
        }
      }

      // Reset form if successful
      if (result.success) {
        setEditingProject(null);
        setFormData({
          title: '',
          description: '',
          category: '',
          imageUrl: '',
          technologies: '',
          features: '',
          isActive: true,
          order: projects.length + (editingProject ? 0 : 1)
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setSubmitStatus({ type: 'error', message: errorMessage });
      console.error(err);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const result = await deleteProject(projectId);
      if (result.success) {
        setProjects(prev => prev.filter(p => p.id !== projectId));
        setSubmitStatus({ type: 'success', message: 'Project deleted successfully!' });
        
        // If we're editing this project, clear the form
        if (editingProject && editingProject.id === projectId) {
          setEditingProject(null);
        }
      } else {
        throw new Error(result.error || 'Failed to delete project');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setSubmitStatus({ type: 'error', message: errorMessage });
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading projects...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Projects</h2>
      
      {/* Status message */}
      {submitStatus && (
        <div className={`p-4 mb-6 rounded ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {submitStatus.message}
        </div>
      )}

      {/* Projects form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">
          {editingProject ? 'Edit Project' : 'Add New Project'}
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
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
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
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Technologies (comma separated)</label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="React, Firebase, Tailwind CSS"
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
              placeholder="Responsive design, User authentication"
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
            {editingProject ? 'Update Project' : 'Add Project'}
          </button>
          
          {editingProject && (
            <button
              type="button"
              onClick={() => setEditingProject(null)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Projects list */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Existing Projects</h3>
        
        {projects.length === 0 ? (
          <p className="text-gray-500">No projects yet. Add your first project above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Title</th>
                  <th className="py-2 px-4 text-left">Category</th>
                  <th className="py-2 px-4 text-left">Order</th>
                  <th className="py-2 px-4 text-center">Status</th>
                  <th className="py-2 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.sort((a, b) => (a.order || 0) - (b.order || 0)).map(project => (
                  <tr key={project.id} className="border-t">
                    <td className="py-2 px-4">{project.title}</td>
                    <td className="py-2 px-4">{project.category}</td>
                    <td className="py-2 px-4">{project.order}</td>
                    <td className="py-2 px-4 text-center">
                      <span className={`inline-block rounded-full px-2 py-1 text-xs ${project.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {project.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-right">
                      <button
                        onClick={() => setEditingProject(project)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
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