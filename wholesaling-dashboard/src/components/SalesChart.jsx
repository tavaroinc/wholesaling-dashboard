import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { generateSalesData } from '../data/liveSalesData';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateSalesData();
      setChartData({
        labels: newData.map((item) => item.product),
        datasets: [
          {
            label: 'Live Sales',
            data: newData.map((item) => item.sales),
            backgroundColor: '#3498db',
          },
        ],
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <Bar data={chartData} options={{ maintainAspectRatio: false }} />
    </div>
  );
};

export default SalesChart;