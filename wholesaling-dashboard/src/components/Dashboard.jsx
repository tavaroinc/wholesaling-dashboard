import React from 'react';
import SalesChart from './SalesChart';
import OrdersTable from './OrdersTable';

export default function Dashboard() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Wholesaling Dashboard</h1>

      <div style={{ marginBottom: '30px' }}>
        <h2>Live Sales Overview</h2>
        <SalesChart />
      </div>

      <div>
        <h2>Live Orders</h2>
        <OrdersTable />
      </div>
    </div>
  );
}
