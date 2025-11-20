'use client';

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Sale, Customer } from '@/lib/types/database.types';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface RevenuePieChartProps {
  sales: Sale[];
  customers: Customer[];
}

export function RevenuePieChart({ sales, customers }: RevenuePieChartProps) {
  // Group revenue by customer
  const revenueByCustomer: Record<number, number> = {};

  sales.forEach((sale) => {
    if (!revenueByCustomer[sale.customerId]) {
      revenueByCustomer[sale.customerId] = 0;
    }
    revenueByCustomer[sale.customerId] += sale.totalAmount;
  });

  // Get top 5 customers by revenue
  const topCustomers = Object.entries(revenueByCustomer)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const labels = topCustomers.map(([customerId]) => {
    const customer = customers.find((c) => c.id === parseInt(customerId));
    return customer?.name || 'Unknown';
  });

  const dataValues = topCustomers.map(([, revenue]) => revenue);

  const data = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: dataValues,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(251, 146, 60)',
          'rgb(168, 85, 247)',
          'rgb(236, 72, 153)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Revenue Distribution - Top 5 Customers',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="h-[400px]">
      <Pie data={data} options={options} />
    </div>
  );
}
