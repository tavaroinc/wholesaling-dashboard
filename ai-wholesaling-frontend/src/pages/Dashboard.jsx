import { useState, useEffect } from 'react';
import { Bot, Zap, Play, BarChart3, Users, FileText, MessageCircle, Building } from 'lucide-react';
import DashboardCard from '../components/ui/DashboardCard';
import StatsCard from '../components/ui/StatsCard';
import { useWebSocket } from '../services/websocket';
import { api } from '../services/api';
import { useNotifications } from '../components/ui/Notification';
import { triggerAIWorkflow } from '../services/ai-triggers';

export default function Dashboard() {
  const [stats, setStats] = useState({
    properties: 0,
    buyers: 0,
    contracts: 0,
    outreach: 0,
    dealsClosed: 0,
    totalProfit: 0
    totalProfit: 0,
    recentActivity: []
  });
  
  const [aiStatus, setAiStatus] = useState('idle');
  const { addNotification } = useNotifications();
  const { lastMessage } = useWebSocket();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Using the mocked analytics endpoint to get initial stats and activity
        const response = await api.get('/api/analytics');
        const data = response.data;
        setStats(prev => ({ ...prev, ...data }));
      } catch (error) {
        addNotification('error', 'Failed to load initial dashboard data.');
      }
    };
    fetchInitialData();
  }, [addNotification]);

  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage);
      switch (data.type) {
        case 'ai_research_complete':
          setStats(prev => ({ ...prev, properties: data.count }));
          addNotification('success', `AI found ${data.count} new properties!`);
          break;
        case 'contract_sent':
          setStats(prev => ({ ...prev, contracts: prev.contracts + 1 }));
          addNotification('info', `Contract sent for ${data.address}`);
          break;
        case 'deal_locked':
          setStats(prev => ({ 
            ...prev, 
            dealsClosed: prev.dealsClosed + 1,
            totalProfit: prev.totalProfit + data.profit
          }));
          addNotification('success', `Deal locked! Profit: $${data.profit}`);
          break;
        case 'legal_ai_activity':
          // Add new AI activity to the top of the list
          const newActivity = { type: 'research', description: data.activity, timestamp: new Date(data.timestamp).toLocaleTimeString() };
          setStats(prev => ({ ...prev, recentActivity: [newActivity, ...prev.recentActivity].slice(0, 5) }));
          break;
      }
    }
  }, [lastMessage, addNotification]);

  const handleStartAI = async () => {
    setAiStatus('running');
    addNotification('info', '🤖 Starting full AI automation workflow...');
    
    try {
      await triggerAIWorkflow('full_automation');
      addNotification('success', 'AI workflow started successfully!');
    } catch (error) {
      addNotification('error', 'Failed to start AI workflow');
    } finally {
      setAiStatus('idle');
    }
  };

  const quickActions = [
    {
      title: 'AI Property Research',
      description: 'Find new wholesale opportunities',
      icon: Bot,
      action: () => triggerAIWorkflow('property_research'),
      color: 'blue'
    },
    {
      title: 'Generate Contracts',
      description: 'Create and send purchase agreements',
      icon: FileText,
      action: () => triggerAIWorkflow('contract_generation'),
      color: 'green'
    },
    {
      title: 'Auto Outreach',
      description: 'Send emails and SMS to property owners',
      icon: MessageCircle,
      action: () => triggerAIWorkflow('owner_outreach'),
      color: 'purple'
    },
    {
      title: 'Buyer Matching',
      description: 'Match properties with cash buyers',
      icon: Users,
      action: () => triggerAIWorkflow('buyer_matching'),
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              AI Wholesaling Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Complete automation system for real estate wholesaling
            </p>
          </div>
          
          <button
            onClick={handleStartAI}
            disabled={aiStatus === 'running'}
            className="mt-4 lg:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
          >
            {aiStatus === 'running' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Play className="h-5 w-5" />
            )}
            <span>
              {aiStatus === 'running' ? 'AI Running...' : 'Start Full AI Automation'}
            </span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Properties Found"
          value={stats.properties}
          icon={Building}
          change="+12 today"
          color="blue"
        />
        <StatsCard
          title="Active Buyers"
          value={stats.buyers}
          icon={Users}
          change="+3 this week"
          color="green"
        />
        <StatsCard
          title="Contracts Sent"
          value={stats.contracts}
          icon={FileText}
          change="+5 pending"
          color="purple"
        />
        <StatsCard
          title="Total Profit"
          value={`$${stats.totalProfit.toLocaleString()}`}
          icon={BarChart3}
          change="+$8,400 this month"
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <DashboardCard
            key={index}
            title={action.title}
            description={action.description}
            icon={action.icon}
            onClick={action.action}
            color={action.color}
          />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent AI Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <Zap className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">AI Research Complete</p>
              <p className="text-sm text-green-600">Found 23 new properties with high profit potential</p>
            </div>
            <span className="text-xs text-green-500 ml-auto">2 min ago</span>
        {stats.recentActivity && stats.recentActivity.length > 0 ? (
          <div className="space-y-3">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'deal' ? 'bg-green-100' :
                    activity.type === 'outreach' ? 'bg-blue-100' :
                    activity.type === 'research' ? 'bg-purple-100' : 'bg-orange-100'
                  }`}>
                    {activity.type === 'deal' && <Bot className="h-4 w-4 text-green-600" />}
                    {activity.type === 'outreach' && <MessageCircle className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'research' && <Zap className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.description}</p>
                    <p className="text-sm text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">Outreach Sent</p>
              <p className="text-sm text-blue-600">12 emails sent to property owners</p>
            </div>
            <span className="text-xs text-blue-500 ml-auto">5 min ago</span>
          </div>
        </div>
        ) : (
          <p className="text-center text-gray-500 py-4">No recent activity to display.</p>
        )}
      </div>
    </div>
  );
}