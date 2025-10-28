import { useState, useEffect } from 'react';
import { Search, Send, Mail, MessageSquare, Calendar, Users, Filter } from 'lucide-react';
import DataTable from '../components/ui/DataTable';
import OutreachForm from '../components/forms/OutreachForm';
import { useNotifications } from '../components/ui/Notification';
import { triggerAIWorkflow } from '../services/ai-triggers';
import { api } from '../services/api';

export default function Outreach() {
  const [outreach, setOutreach] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    dateRange: 'all'
  });
  const [loading, setLoading] = useState(false); // For AI Auto Outreach button
  const [tableLoading, setTableLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    loadOutreach();
  }, []);

  const loadOutreach = async () => {
    setTableLoading(true);
    try {
      const response = await api.get('/api/outreach');
      setOutreach(response.data);
    } catch (error) {
      addNotification('error', 'Failed to load outreach history');
    } finally {
      setTableLoading(false);
    }
  };

  const handleAIOutreach = async () => {
    setLoading(true);
    try {
      await triggerAIWorkflow('owner_outreach', {
        strategy: 'personalized',
        channels: ['email', 'sms'],
        followUp: true
      });
      addNotification('success', 'AI outreach automation started!');
    } catch (error) {
      addNotification('error', 'Failed to start AI outreach');
    } finally {
      setLoading(false);
    }
  };

  const handleSendManual = async (outreachData) => {
    try {
      await api.post('/api/legal/outreach', outreachData);
      addNotification('success', 'Outreach message sent successfully');
      setShowForm(false);
      loadOutreach();
    } catch (error) {
      addNotification('error', 'Failed to send outreach message');
    }
  };

  const handleResend = async (outreachId) => {
    try {
      await api.post('/api/legal/outreach', { outreachId, action: 'resend' });
      addNotification('success', 'Message resent successfully');
      loadOutreach();
    } catch (error) {
      addNotification('error', 'Failed to resend message');
    }
  };

  const columns = [
    {
      key: 'recipient',
      header: 'Recipient',
      render: (item) => (
        // Assuming item.id exists for DataTable key
        <div>
          <p className="font-medium text-gray-900">{item.recipientName}</p>
          <p className="text-sm text-gray-500">{item.recipientContact}</p>
          <p className="text-xs text-gray-400">{item.propertyAddress}</p>
        </div>
      )
    },
    sortable: true,
    {
      key: 'message',
      header: 'Message',
      render: (item) => (
        <div>
          <p className="font-medium text-sm">{item.subject}</p>
          <p className="text-sm text-gray-600 truncate max-w-xs">
            {item.messagePreview}...
          </p>
        </div>
      // sortable: true, // Sorting by message content might not be useful
      )
    },
    {
      key: 'type',
      header: 'Type',
      render: (item) => (
        <div className="flex items-center space-x-2">
          {item.channel === 'email' ? (
            <Mail className="h-4 w-4 text-blue-500" />
          ) : (
            <MessageSquare className="h-4 w-4 text-green-500" />
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.channel === 'email' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
          }`}>
            {item.channel?.toUpperCase()}
          </span>
        </div>
      // sortable: true,
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.status === 'sent' ? 'bg-green-100 text-green-800' :
          item.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
          item.status === 'opened' ? 'bg-purple-100 text-purple-800' :
          item.status === 'failed' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {item.status?.toUpperCase()}
        </span>
      )
      // sortable: true,
    },
    {
      key: 'dates',
      header: 'Dates',
      render: (item) => (
        <div>
          <p className="text-sm font-medium">{item.sentDate}</p>
          {item.followUpDate && (
            <p className="text-xs text-gray-500">Follow-up: {item.followUpDate}</p>
          )}
        </div>
      )
      // sortable: true, // Sorting by dates is useful
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleResend(item.id)}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            Resend
          </button>
          <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors">
            View
          </button>
        </div>
      )
    }
  ];

  const filteredOutreach = outreach.filter(item => {
    const matchesSearch = 
      item.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.propertyAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filters.type === 'all' || item.channel === filters.type;
    const matchesStatus = filters.status === 'all' || item.status === filters.status;

    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: outreach.length,
    emails: outreach.filter(item => item.channel === 'email').length,
    sms: outreach.filter(item => item.channel === 'sms').length,
    responded: outreach.filter(item => item.status === 'opened').length
  };

  const renderLoadingSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 items-center py-4 border-b border-gray-100 last:border-b-0">
            <div className="col-span-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="col-span-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
            <div className="col-span-1 h-6 w-20 bg-gray-200 rounded-full"></div>
            <div className="col-span-1 h-6 w-20 bg-gray-200 rounded-full"></div>
            <div className="col-span-1 h-8 w-24 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Outreach Center</h1>
          <p className="text-gray-600">AI-powered communication with property owners</p>
        </div>
        
        <div className="flex space-x-3 mt-4 lg:mt-0">
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Send className="h-5 w-5" />
            <span>Send Manual</span>
          </button>
          <button
            onClick={handleAIOutreach}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <Users className="h-5 w-5" />
            <span>{loading ? 'Starting AI...' : 'AI Auto Outreach'}</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Outreach</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Send className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Emails Sent</p>
              <p className="text-2xl font-bold text-blue-600">{stats.emails}</p>
            </div>
            <Mail className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">SMS Sent</p>
              <p className="text-2xl font-bold text-green-600">{stats.sms}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Response Rate</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.total > 0 ? Math.round((stats.responded / stats.total) * 100) : 0}%
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search outreach..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Channels</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
          </select>
          
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="sent">Sent</option>
            <option value="delivered">Delivered</option>
            <option value="opened">Opened</option>
            <option value="failed">Failed</option>
          </select>
          
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Outreach Table */}
      {tableLoading ? (
        renderLoadingSkeleton()
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <DataTable
            columns={columns}
            data={filteredOutreach}
            emptyMessage="No outreach history found. Start a compliant outreach campaign."
          />
        </div>
      )}

      {/* Outreach Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <OutreachForm
              onSend={handleSendManual}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}