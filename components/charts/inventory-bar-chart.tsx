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
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface InventoryBarChartProps {
  products: Product[];
}

export function InventoryBarChart({ products }: InventoryBarChartProps) {
  const { isMobile } = useBreakpoint();

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
        position: isMobile ? ('bottom' as const) : ('top' as const),
        labels: {
          boxWidth: isMobile ? 12 : 15,
          padding: isMobile ? 8 : 10,
          font: {
            size: isMobile ? 10 : 12,
          },
        },
      },
      title: {
        display: true,
        text: 'Top 10 Products by Stock Level',
        font: {
          size: isMobile ? 14 : 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        bodyFont: {
          size: isMobile ? 11 : 13,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: isMobile ? 9 : 11,
          },
          maxRotation: isMobile ? 45 : 0,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantity',
          font: {
            size: isMobile ? 10 : 12,
          },
        },
        ticks: {
          font: {
            size: isMobile ? 9 : 11,
          },
        },
      },
    },
  };

  return (
    <div className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
      <Bar data={data} options={options} />
    </div>
  );
}
