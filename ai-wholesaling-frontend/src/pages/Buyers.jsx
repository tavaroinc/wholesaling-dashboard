import { useState, useEffect } from 'react';
import { Search, Plus, User, Phone, Mail, MapPin, Building } from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import BuyerForm from '../components/forms/BuyerForm';
import { useNotifications } from '../components/ui/Notification';
import { db } from '../../services/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';

export default function Buyers() {
  const [buyers, setBuyers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBuyer, setEditingBuyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    loadBuyers();
  }, []);

  const loadBuyers = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "investors"));
      const buyersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBuyers(buyersData);
    } catch (error) {
      addNotification('error', 'Failed to load buyers from Firestore');
      setBuyers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBuyer = async (buyerData) => {
    try {
      if (editingBuyer) {
        const buyerRef = doc(db, "investors", editingBuyer.id);
        await updateDoc(buyerRef, buyerData);
        addNotification('success', 'Buyer updated successfully');
      } else {
        await addDoc(collection(db, "investors"), buyerData);
        addNotification('success', 'Buyer added successfully');
      }
      setShowForm(false);
      setEditingBuyer(null);
      loadBuyers();
    } catch (error) {
      addNotification('error', 'Failed to save buyer to Firestore');
    }
  };

  const handleEdit = (buyer) => {
    setEditingBuyer(buyer);
    setShowForm(true);
  };

  const handleDelete = async (buyerId) => {
    if (window.confirm('Are you sure you want to delete this buyer?')) {
      try {
        await deleteDoc(doc(db, "investors", buyerId));
        addNotification('success', 'Buyer deleted successfully');
        loadBuyers();
      } catch (error) {
        addNotification('error', 'Failed to delete buyer from Firestore');
      }
    }
  };

  const columns = [
    {
      key: 'info',
      header: 'Buyer Information',
      render: (buyer) => (
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{buyer.name}</p>
            <p className="text-sm text-gray-500">{buyer.company}</p>
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (buyer) => (
        <div>
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="h-4 w-4 text-gray-400" />
            <span>{buyer.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{buyer.email}</span>
          </div>
        </div>
      )
    },
    {
      key: 'preferences',
      header: 'Investment Preferences',
      render: (buyer) => (
        <div>
          <p className="font-medium">{buyer.propertyTypes?.join(', ')}</p>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <MapPin className="h-3 w-3" />
            <span>{buyer.targetAreas?.join(', ')}</span>
          </div>
        </div>
      )
    },
    {
      key: 'budget',
      header: 'Budget',
      render: (buyer) => (
        <div>
          <p className="font-medium">${buyer.minBudget?.toLocaleString()} - ${buyer.maxBudget?.toLocaleString()}</p>
          <p className="text-sm text-gray-500">{buyer.fundingType}</p>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (buyer) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(buyer)}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(buyer.id)}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  const renderLoadingSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0">
            <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
            <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
            <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const filteredBuyers = buyers.filter(buyer =>
    buyer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buyer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buyer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cash Buyers</h1>
          <p className="text-gray-600">Manage your cash buyer network</p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 lg:mt-0 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Buyer</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search buyers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Buyers</p>
              <p className="text-2xl font-bold text-gray-900">{buyers.length}</p>
            </div>
            <User className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active This Month</p>
              <p className="text-2xl font-bold text-green-600">
                {buyers.filter(b => b.lastContact).length}
              </p>
            </div>
            <Building className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Deal Size</p>
              <p className="text-2xl font-bold text-purple-600">
                ${Math.round(buyers.reduce((sum, b) => sum + (b.avgDealSize || 0), 0) / (buyers.length || 1)).toLocaleString()}
              </p>
            </div>
            <MapPin className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Buyers Table */}
      {loading ? (
        renderLoadingSkeleton()
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <DataTable
            columns={columns}
            data={filteredBuyers}
            emptyMessage="No buyers found in Firestore. Add one to get started!"
          />
        </div>
      )}

      {/* Buyer Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <BuyerForm
              buyer={editingBuyer}
              onSave={handleSaveBuyer}
              onCancel={() => {
                setShowForm(false);
                setEditingBuyer(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
