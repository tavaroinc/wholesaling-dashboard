import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Building, DollarSign, MapPin, Calendar } from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import { useNotifications } from '../components/ui/Notification';
import { triggerAIWorkflow } from '../services/ai-triggers';
import { api } from '../services/api';

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    minProfit: '',
    maxPrice: ''
  });
  const { addNotification } = useNotifications();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const response = await api.get('/properties');
      setProperties(response.data);
    } catch (error) {
      addNotification('error', 'Failed to load properties');
    }
  };

  const handleAIRresearch = async () => {
    setLoading(true);
    try {
      await triggerAIWorkflow('property_research', {
        criteria: {
          daysOnMarket: 100,
          priceDiscount: 30,
          counties: ['all']
        }
      });
      addNotification('success', 'AI property research started!');
    } catch (error) {
      addNotification('error', 'Failed to start AI research');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOffer = async (property) => {
    try {
      await api.post('/ai/outreach/send-offer', { property });
      addNotification('success', `Offer sent to ${property.address}`);
    } catch (error) {
      addNotification('error', 'Failed to send offer');
    }
  };

  const columns = [
    {
      key: 'address',
      header: 'Property',
      render: (property) => (
        <div className="flex items-center space-x-3">
          <Building className="h-8 w-8 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">{property.address}</p>
            <p className="text-sm text-gray-500">{property.city}, {property.state}</p>
          </div>
        </div>
      )
    },
    {
      key: 'price',
      header: 'Price & ARV',
      render: (property) => (
        <div>
          <p className="font-medium">${property.price?.toLocaleString()}</p>
          <p className="text-sm text-gray-500">ARV: ${property.arv?.toLocaleString()}</p>
        </div>
      )
    },
    {
      key: 'analysis',
      header: 'AI Analysis',
      render: (property) => (
        <div>
          <p className="font-medium text-green-600">
            Profit: ${property.profitPotential?.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            Offer: ${property.aiAnalysis?.maxOffer?.toLocaleString()}
          </p>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (property) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          property.status === 'new' ? 'bg-blue-100 text-blue-800' :
          property.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
          property.status === 'offer_sent' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {property.status?.replace('_', ' ').toUpperCase()}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (property) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleSendOffer(property)}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            Send Offer
          </button>
          <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors">
            View Details
          </button>
        </div>
      )
    }
  ];

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || property.status === filters.status;
    const matchesProfit = !filters.minProfit || (property.profitPotential >= parseInt(filters.minProfit));
    const matchesPrice = !filters.maxPrice || (property.price <= parseInt(filters.maxPrice));

    return matchesSearch && matchesStatus && matchesProfit && matchesPrice;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Research</h1>
          <p className="text-gray-600">AI-discovered wholesale opportunities</p>
        </div>
        
        <button
          onClick={handleAIRresearch}
          disabled={loading}
          className="mt-4 lg:mt-0 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>{loading ? 'Researching...' : 'AI Property Research'}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="offer_sent">Offer Sent</option>
            <option value="under_contract">Under Contract</option>
          </select>
          
          <input
            type="number"
            placeholder="Min Profit"
            value={filters.minProfit}
            onChange={(e) => setFilters(prev => ({ ...prev, minProfit: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          
          <input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
            </div>
            <Building className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Profit Potential</p>
              <p className="text-2xl font-bold text-green-600">
                ${Math.round(properties.reduce((sum, p) => sum + (p.profitPotential || 0), 0) / (properties.length || 1)).toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Offers Sent</p>
              <p className="text-2xl font-bold text-purple-600">
                {properties.filter(p => p.status === 'offer_sent').length}
              </p>
            </div>
            <MapPin className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Under Contract</p>
              <p className="text-2xl font-bold text-orange-600">
                {properties.filter(p => p.status === 'under_contract').length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <DataTable
          columns={columns}
          data={filteredProperties}
          emptyMessage="No properties found. Run AI research to discover opportunities."
        />
      </div>
    </div>
  );
}