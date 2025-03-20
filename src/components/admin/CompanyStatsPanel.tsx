import { useState, useEffect } from 'react';
import { 
  saveCompanyStat,
  getAllCompanyStats,
  updateCompanyStat,
  deleteCompanyStat
} from '@/lib/firebase/api/companyStats';
import { CompanyStat } from '@/lib/firebase/models/types';

export default function CompanyStatsPanel() {
  const [stats, setStats] = useState<CompanyStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingStat, setEditingStat] = useState<CompanyStat | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    value: '',
    icon: '',
    prefix: '',
    suffix: '',
    isActive: true,
    order: 0
  });
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Fetch stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const fetchedStats = await getAllCompanyStats();
        setStats(fetchedStats);
      } catch (err) {
        setError('Failed to load company stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Reset form data when editingStat changes
  useEffect(() => {
    if (editingStat) {
      setFormData({
        label: editingStat.label || '',
        value: editingStat.value?.toString() || '',
        icon: editingStat.icon || '',
        prefix: editingStat.prefix || '',
        suffix: editingStat.suffix || '',
        isActive: editingStat.isActive ?? true,
        order: editingStat.order || 0
      });
    } else {
      setFormData({
        label: '',
        value: '',
        icon: '',
        prefix: '',
        suffix: '',
        isActive: true,
        order: stats.length // Set default order to the end of the list
      });
    }
  }, [editingStat, stats.length]);

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
      // Process the value to be numeric if possible
      const numericValue = !isNaN(Number(formData.value)) 
        ? Number(formData.value) 
        : formData.value;
      
      const processedData = {
        ...formData,
        value: numericValue
      };

      let result;
      if (editingStat) {
        // Update existing stat
        result = await updateCompanyStat(editingStat.id, processedData);
        if (result.success) {
          setSubmitStatus({ type: 'success', message: 'Stat updated successfully!' });
          // Update local state
          setStats(prev => 
            prev.map(s => s.id === editingStat.id ? { ...s, ...processedData, id: editingStat.id } : s)
          );
        } else {
          throw new Error(result.error || 'Failed to update stat');
        }
      } else {
        // Create new stat
        result = await saveCompanyStat(processedData);
        if (result.success && result.id) {
          setSubmitStatus({ type: 'success', message: 'Stat created successfully!' });
          // Add to local state
          setStats(prev => [...prev, { ...processedData, id: result.id! }]);
        } else {
          throw new Error(result.error || 'Failed to create stat');
        }
      }

      // Reset form if successful
      if (result.success) {
        setEditingStat(null);
        setFormData({
          label: '',
          value: '',
          icon: '',
          prefix: '',
          suffix: '',
          isActive: true,
          order: stats.length + (editingStat ? 0 : 1)
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setSubmitStatus({ type: 'error', message: errorMessage });
      console.error(err);
    }
  };

  const handleDelete = async (statId: string) => {
    if (!window.confirm('Are you sure you want to delete this stat?')) {
      return;
    }

    try {
      const result = await deleteCompanyStat(statId);
      if (result.success) {
        setStats(prev => prev.filter(s => s.id !== statId));
        setSubmitStatus({ type: 'success', message: 'Stat deleted successfully!' });
        
        // If we're editing this stat, clear the form
        if (editingStat && editingStat.id === statId) {
          setEditingStat(null);
        }
      } else {
        throw new Error(result.error || 'Failed to delete stat');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setSubmitStatus({ type: 'error', message: errorMessage });
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading company stats...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Company Stats</h2>
      
      {/* Status message */}
      {submitStatus && (
        <div className={`p-4 mb-6 rounded ${submitStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {submitStatus.message}
        </div>
      )}

      {/* Stats form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">
          {editingStat ? 'Edit Stat' : 'Add New Stat'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Label</label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
              placeholder="Years of Experience"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Value</label>
            <input
              type="text"
              name="value"
              value={formData.value}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
              placeholder="10"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Icon (FontAwesome class or SVG)</label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="fa-solid fa-chart-line"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Prefix</label>
            <input
              type="text"
              name="prefix"
              value={formData.prefix}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="$"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Suffix</label>
            <input
              type="text"
              name="suffix"
              value={formData.suffix}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="+"
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
            {editingStat ? 'Update Stat' : 'Add Stat'}
          </button>
          
          {editingStat && (
            <button
              type="button"
              onClick={() => setEditingStat(null)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Stats list */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Existing Stats</h3>
        
        {stats.length === 0 ? (
          <p className="text-gray-500">No stats yet. Add your first stat above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Label</th>
                  <th className="py-2 px-4 text-left">Value</th>
                  <th className="py-2 px-4 text-left">Format</th>
                  <th className="py-2 px-4 text-left">Order</th>
                  <th className="py-2 px-4 text-center">Status</th>
                  <th className="py-2 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.sort((a, b) => (a.order || 0) - (b.order || 0)).map(stat => (
                  <tr key={stat.id} className="border-t">
                    <td className="py-2 px-4">{stat.label}</td>
                    <td className="py-2 px-4">{stat.value}</td>
                    <td className="py-2 px-4">{stat.prefix || ''}{stat.value}{stat.suffix || ''}</td>
                    <td className="py-2 px-4">{stat.order}</td>
                    <td className="py-2 px-4 text-center">
                      <span className={`inline-block rounded-full px-2 py-1 text-xs ${stat.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {stat.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-right">
                      <button
                        onClick={() => setEditingStat(stat)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(stat.id)}
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