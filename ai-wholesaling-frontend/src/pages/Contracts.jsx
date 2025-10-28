import React, { useState, useEffect } from 'react';
import DataTable from '../components/ui/DataTable';
import { useNotifications } from '../components/ui/Notification';
import { db } from '../../services/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const ContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const fetchContracts = async () => {
      const querySnapshot = await getDocs(collection(db, "contracts"));
      const contractsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setContracts(contractsData);
    };
    fetchContracts();
  }, []);

  const handleStatusChange = async (contractId, newStatus) => {
    const contractRef = doc(db, "contracts", contractId);
    try {
      await updateDoc(contractRef, { status: newStatus });
      setContracts(contracts.map(c => c.id === contractId ? { ...c, status: newStatus } : c));
      addNotification('success', `Contract status updated to ${newStatus}`)
    } catch (error) {
      addNotification('error', 'Failed to update contract status.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Generated': return 'bg-gray-200 text-gray-800';
      case 'Sent': return 'bg-blue-200 text-blue-800';
      case 'Signed': return 'bg-green-200 text-green-800';
      case 'Rejected': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    {
      key: 'propertyAddress',
      header: 'Property',
      render: (contract) => <span>{contract.propertyAddress}</span>
    },
    {
      key: 'purchasePrice',
      header: 'Price',
      render: (contract) => <span>${contract.purchasePrice}</span>
    },
    {
      key: 'assigneeName',
      header: 'Assignee',
      render: (contract) => <span>{contract.assigneeName}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: (contract) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(contract.status)}`}>
          {contract.status}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (contract) => (
        <select 
          value={contract.status}
          onChange={(e) => handleStatusChange(contract.id, e.target.value)}
          className="w-full px-2 py-1 border border-gray-300 rounded-md bg-white focus:border-blue-500"
        >
          <option value="Generated">Generated</option>
          <option value="Sent">Sent</option>
          <option value="Signed">Signed</option>
          <option value="Rejected">Rejected</option>
        </select>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
          <p className="text-gray-600">Manage all contracts.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={contracts}
        emptyMessage="No contracts to display."
      />
    </div>
  );
};

export default ContractsPage;
