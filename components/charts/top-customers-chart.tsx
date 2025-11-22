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
import { Sale, Customer } from '@/lib/types/database.types';
import { useBreakpoint } from '@/lib/hooks/use-breakpoint';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TopCustomersChartProps {
  sales: Sale[];
  customers: Customer[];
}

export function TopCustomersChart({ sales, customers }: TopCustomersChartProps) {
  const { isMobile } = useBreakpoint();

  // Group sales by customer
  const salesByCustomer: Record<number, { revenue: number; orders: number }> = {};

  sales.forEach((sale) => {
    if (!salesByCustomer[sale.customerId]) {
      salesByCustomer[sale.customerId] = { revenue: 0, orders: 0 };
    }
    salesByCustomer[sale.customerId].revenue += sale.totalAmount;
    salesByCustomer[sale.customerId].orders += 1;
  });

  // Get top 8 customers by revenue
  const topCustomers = Object.entries(salesByCustomer)
    .sort(([, a], [, b]) => b.revenue - a.revenue)
    .slice(0, 8);

  const labels = topCustomers.map(([customerId]) => {
    const customer = customers.find((c) => c.id === parseInt(customerId));
    return customer?.name || 'Unknown';
  });

  const revenueData = topCustomers.map(([, data]) => data.revenue);
  const orderData = topCustomers.map(([, data]) => data.orders);

  const data = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: revenueData,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        label: 'Orders',
        data: orderData,
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
        borderColor: 'rgb(168, 85, 247)',
        borderWidth: 1,
        yAxisID: 'y1',
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
        text: 'Top 8 Customers by Revenue',
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
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Revenue',
          font: {
            size: isMobile ? 10 : 12,
          },
        },
        ticks: {
          font: {
            size: isMobile ? 9 : 11,
          },
        },
        beginAtZero: true,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Orders',
          font: {
            size: isMobile ? 10 : 12,
          },
        },
        ticks: {
          font: {
            size: isMobile ? 9 : 11,
          },
        },
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
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
