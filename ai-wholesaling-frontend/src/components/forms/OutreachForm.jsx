import { useState } from 'react';
import { X, Mail, MessageSquare, Building, User } from 'lucide-react';

export default function OutreachForm({ onSend, onCancel }) {
  const [formData, setFormData] = useState({
    channel: 'email',
    recipientName: '',
    recipientContact: '',
    propertyAddress: '',
    subject: '',
    message: '',
    schedule: 'now',
    scheduledDate: '',
    followUp: false,
    followUpDays: 3
  });

  const [aiGenerating, setAiGenerating] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(formData);
  };

  const handleAIGenerate = async () => {
    setAiGenerating(true);
    // Simulate AI message generation
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        subject: `Cash Offer for ${prev.propertyAddress || 'Your Property'}`,
        message: `Dear ${prev.recipientName || 'Property Owner'},

I came across your property at ${prev.propertyAddress || 'your address'} and wanted to discuss a potential cash offer. We specialize in quick, hassle-free transactions and can close in as little as 7 days.

Key benefits of our offer:
• All-cash purchase
• No repairs needed
• Quick closing (7-14 days)
• No commissions or fees

Would you be open to discussing this opportunity? Please let me know what time works best for a quick call.

Best regards,
Your Wholesaling Team`
      }));
      setAiGenerating(false);
    }, 2000);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Send Outreach</h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Channel Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Communication Channel
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, channel: 'email' }))}
              className={`p-4 border-2 rounded-lg text-center transition-all ${
                formData.channel === 'email'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <Mail className="h-6 w-6 mx-auto mb-2" />
              <span className="font-medium">Email</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, channel: 'sms' }))}
              className={`p-4 border-2 rounded-lg text-center transition-all ${
                formData.channel === 'sms'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <MessageSquare className="h-6 w-6 mx-auto mb-2" />
              <span className="font-medium">SMS</span>
            </button>
          </div>
        </div>

        {/* Recipient Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Name *
            </label>
            <input
              type="text"
              required
              value={formData.recipientName}
              onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.channel === 'email' ? 'Email Address *' : 'Phone Number *'}
            </label>
            <input
              type={formData.channel === 'email' ? 'email' : 'tel'}
              required
              value={formData.recipientContact}
              onChange={(e) => setFormData(prev => ({ ...prev, recipientContact: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Property Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Address *
          </label>
          <input
            type="text"
            required
            value={formData.propertyAddress}
            onChange={(e) => setFormData(prev => ({ ...prev, propertyAddress: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Message Content */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Message Content
            </label>
            <button
              type="button"
              onClick={handleAIGenerate}
              disabled={aiGenerating}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-1"
            >
              <span>{aiGenerating ? 'AI Generating...' : 'AI Generate'}</span>
            </button>
          </div>
          
          {formData.channel === 'email' && (
            <div className="mb-3">
              <input
                type="text"
                placeholder="Subject line"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
          
          <textarea
            rows={formData.channel === 'sms' ? 4 : 8}
            placeholder={
              formData.channel === 'sms' 
                ? 'Enter your SMS message (160 character limit)...'
                : 'Enter your email message...'
            }
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            maxLength={formData.channel === 'sms' ? 160 : undefined}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {formData.channel === 'sms' && (
            <p className="text-sm text-gray-500 mt-1">
              {formData.message.length}/160 characters
            </p>
          )}
        </div>

        {/* Scheduling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule
            </label>
            <select
              value={formData.schedule}
              onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="now">Send Now</option>
              <option value="scheduled">Schedule for Later</option>
            </select>
          </div>
          
          {formData.schedule === 'scheduled' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scheduled Date & Time
              </label>
              <input
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>

        {/* Follow-up */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="followUp"
            checked={formData.followUp}
            onChange={(e) => setFormData(prev => ({ ...prev, followUp: e.target.checked }))}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="followUp" className="text-sm font-medium text-gray-700">
            Schedule automatic follow-up
          </label>
          
          {formData.followUp && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">in</span>
              <input
                type="number"
                min="1"
                max="30"
                value={formData.followUpDays}
                onChange={(e) => setFormData(prev => ({ ...prev, followUpDays: parseInt(e.target.value) }))}
                className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-sm text-gray-600">days</span>
            </div>
          )}
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>Send {formData.channel.toUpperCase()}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
