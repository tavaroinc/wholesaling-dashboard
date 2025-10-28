import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Buyers from './pages/Buyers';
import ContractsPage from './pages/Contracts';
import Outreach from './pages/Outreach';
import Properties from './pages/Properties';
import Analytics from './pages/Analytics';
import ReviewPage from './pages/ReviewPage';
import { WebSocketProvider } from './services/websocket';
import { NotificationProvider } from './components/ui/Notification';

function App() {
  const [contracts, setContracts] = useState([]);

  // This logic is lifted from Contracts.jsx to be shared across routes
  useEffect(() => {
    const mockContracts = [
      {
        id: 'PSA001',
        type: 'purchase',
        propertyAddress: '123 Main St, Phoenix, AZ',
        purchasePrice: 200000,
        assignmentFee: 0,
        assignorName: 'Property Owner',
        assigneeName: 'AI Wholesaling Platform',
        earnestMoney: 2000,
        closingDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        status: 'Pending',
        titleCompany: ''
      },
      {
        id: 'ASN001',
        type: 'assignment',
        propertyAddress: '456 Oak Ave, Miami, FL',
        purchasePrice: 350000,
        assignmentFee: 25000,
        assignorName: 'AI Wholesaling Platform',
        assigneeName: 'Blackstone Group',
        earnestMoney: 5000,
        closingDate: new Date(new Date().setDate(new Date().getDate() + 45)),
        status: 'Pending',
        titleCompany: ''
      },
    ];
    setContracts(mockContracts);
  }, []);

  return (
    <WebSocketProvider>
      <NotificationProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/buyers" element={<Buyers />} />
              <Route path="/contracts" element={<ContractsPage contracts={contracts} setContracts={setContracts} />} />
              <Route path="/outreach" element={<Outreach />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/review/:contractId" element={<ReviewPage contracts={contracts} setContracts={setContracts} />} />
            </Routes>
          </Layout>
        </Router>
      </NotificationProvider>
    </WebSocketProvider>
  );
}

export default App;