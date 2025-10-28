import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Calendar, Target } from 'lucide-react';
import { useNotifications } from '../components/ui/Notification';
import { api } from '../services/api';

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics?range=${timeRange}`);
      setAnalytics(response.data);
    } catch (error) {
      addNotification('error', 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data</h3>
        <p className="text-gray-500">Analytics data will appear as you use the system</p>
      </div>
    );
  }

  const kpiCards = [
    {
      title: 'Total Profit',
      value: `$${analytics.totalProfit?.toLocaleString()}`,
      change: analytics.profitChange,
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Deals Closed',
      value: analytics.dealsClosed,
      change: analytics.dealsChange,
      icon: Target,
      color: 'blue'
    },
    {
      title: 'Response Rate',
      value: `${analytics.responseRate}%`,
      change: analytics.responseChange,
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Avg Deal Size',
      value: `$${analytics.avgDealSize?.toLocaleString()}`,
      change: analytics.dealSizeChange,
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-gray-600">AI-powered performance metrics and insights</p>
        </div>
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="mt-4 lg:mt-0 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="quarter">Last 90 Days</option>
          <option value="year">Last 12 Months</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          const isPositive = card.change >= 0;
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                  <p className={`text-sm mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '↗' : '↘'} {Math.abs(card.change)}% from previous period
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${
                  card.color === 'green' ? 'bg-green-100' :
                  card.color === 'blue' ? 'bg-blue-100' :
                  card.color === 'purple' ? 'bg-purple-100' : 'bg-orange-100'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    card.color === 'green' ? 'text-green-600' :
                    card.color === 'blue' ? 'text-blue-600' :
                    card.color === 'purple' ? 'text-purple-600' : 'text-orange-600'
                  }`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deal Pipeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Pipeline</h3>
          <div className="space-y-4">
            {analytics.pipeline?.map((stage, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(stage.count / analytics.pipeline.reduce((sum, s) => sum + s.count, 0)) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{stage.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Channels */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Performance</h3>
          <div className="space-y-4">
            {analytics.channelPerformance?.map((channel, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    channel.channel === 'email' ? 'bg-blue-500' : 'bg-green-500'
                  }`}/>
                  <span className="text-sm font-medium text-gray-700">
                    {channel.channel.toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{channel.responseRate}%</p>
                  <p className="text-xs text-gray-500">{channel.count} sent</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights & Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.insights?.map((insight, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">{insight.title}</h4>
                    <p className="text-sm text-blue-700 mt-1">{insight.description}</p>
                    {insight.action && (
                      <button className="mt-2 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
                        {insight.action}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {analytics.recentActivity?.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'deal' ? 'bg-green-100' :
                  activity.type === 'outreach' ? 'bg-blue-100' :
                  activity.type === 'research' ? 'bg-purple-100' : 'bg-orange-100'
                }`}>
                  {activity.type === 'deal' && <DollarSign className="h-4 w-4 text-green-600" />}
                  {activity.type === 'outreach' && <Users className="h-4 w-4 text-blue-600" />}
                  {activity.type === 'research' && <Target className="h-4 w-4 text-purple-600" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{activity.description}</p>
                  <p className="text-sm text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
              {activity.amount && (
                <span className="font-medium text-green-600">+${activity.amount.toLocaleString()}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}