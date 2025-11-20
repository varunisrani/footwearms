'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Product } from '@/lib/types/database.types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface InventoryBarChartProps {
  products: Product[];
}

export function InventoryBarChart({ products }: InventoryBarChartProps) {
  // Sort by current stock and take top 10 products
  const sortedProducts = [...products]
    .sort((a, b) => b.currentStock - a.currentStock)
    .slice(0, 10);

  const labels = sortedProducts.map((p) => p.name);
  const currentStockData = sortedProducts.map((p) => p.currentStock);
  const minStockData = sortedProducts.map((p) => p.minStockLevel);

  const data = {
    labels,
    datasets: [
      {
        label: 'Current Stock',
        data: currentStockData,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Min Stock Level',
        data: minStockData,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Top 10 Products by Stock Level',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantity',
        },
      },
    },
  };

  return (
    <div className="h-[400px]">
      <Bar data={data} options={options} />
    </div>
  );
}
