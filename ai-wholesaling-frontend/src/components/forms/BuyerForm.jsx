import { useState } from 'react';
import { X } from 'lucide-react';

export default function BuyerForm({ buyer, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: buyer?.name || '',
    company: buyer?.company || '',
    email: buyer?.email || '',
    phone: buyer?.phone || '',
    propertyTypes: buyer?.propertyTypes || [],
    targetAreas: buyer?.targetAreas || [],
    minBudget: buyer?.minBudget || '',
    maxBudget: buyer?.maxBudget || '',
    fundingType: buyer?.fundingType || 'cash',
    notes: buyer?.notes || ''
  });

  const propertyTypeOptions = ['Single Family', 'Multi Family', 'Commercial', 'Land', 'Fixer Upper'];
  const areaOptions = ['Urban', 'Suburban', 'Rural', 'Specific Counties'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {buyer ? 'Edit Buyer' : 'Add New Buyer'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Property Preferences */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Types Interested In
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {propertyTypeOptions.map(type => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.propertyTypes.includes(type)}
                  onChange={() => handleArrayToggle('propertyTypes', type)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Target Areas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Areas
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {areaOptions.map(area => (
              <label key={area} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.targetAreas.includes(area)}
                  onChange={() => handleArrayToggle('targetAreas', area)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{area}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Budget Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Budget
            </label>
            <input
              type="number"
              value={formData.minBudget}
              onChange={(e) => setFormData(prev => ({ ...prev, minBudget: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Budget
            </label>
            <input
              type="number"
              value={formData.maxBudget}
              onChange={(e) => setFormData(prev => ({ ...prev, maxBudget: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Funding Type
            </label>
            <select
              value={formData.fundingType}
              onChange={(e) => setFormData(prev => ({ ...prev, fundingType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="cash">Cash</option>
              <option value="finance">Financed</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            rows={4}
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {buyer ? 'Update Buyer' : 'Add Buyer'}
          </button>
        </div>
      </form>
    </div>
  );
}
