import { useState } from 'react';
import { Mic, MessageSquare } from 'lucide-react';
import ContractForm from '../components/forms/ContractForm';
import { useNotifications } from '../components/ui/Notification';
import { api } from '../services/api';

export default function Welcome() {
  const [showForm, setShowForm] = useState(false);
  const { addNotification } = useNotifications();

  const handleGenerateContract = async (contractData) => {
    try {
      await api.post('/api/legal/outreach', contractData);
      addNotification('success', 'AI analysis started for your property!');
      // The form will show the next steps, so we can just leave it open
      // or close it after a delay.
    } catch (error) {
      addNotification('error', 'Failed to start analysis');
    }
  };

  return (
    <div className="text-center py-20 lg:py-32">
      {/* Floating action buttons for chat and voice */}
      <div className="absolute top-20 right-6 space-x-2">
        <button className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
          <MessageSquare className="h-6 w-6 text-gray-700" />
        </button>
        <button className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
          <Mic className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      <h1 className="text-4xl lg:text-6xl font-bold text-gray-900">
        Find Your Property Buyer or Investor in Seconds!
      </h1>
      <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
        AI-powered property analysis, client finding, and investor matching—all in one platform.
      </p>
      <button
        onClick={() => setShowForm(true)}
        className="mt-8 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all"
      >
        Start Your Property Search
      </button>

      {/* Contract Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <ContractForm
              onGenerate={handleGenerateContract}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
