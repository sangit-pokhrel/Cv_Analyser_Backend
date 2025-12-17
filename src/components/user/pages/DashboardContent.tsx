// src/components/admin/pages/DashboardContent.tsx
'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Link from 'next/link';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardContent() {
  const chartData = {
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    datasets: [
      {
        data: [25, 48, 32, 5, 28, 48, 5],
        borderColor: '#22D3EE',
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#22D3EE',
      },
      {
        data: [8, 38, 48, 40, 50, 30, 15],
        borderColor: '#FB7185',
        backgroundColor: 'rgba(251, 113, 133, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#FB7185',
      },
      {
        data: [18, 10, 32, 8, 18, 15, 5],
        borderColor: '#A78BFA',
        backgroundColor: 'rgba(167, 139, 250, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#A78BFA',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 50,
        ticks: {
          stepSize: 10,
          font: {
            family: '',
          },
        },
        grid: {
          color: '#F1F5F9',
        },
      },
      x: {
        ticks: {
          font: {
            family: '',
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome Back Sangit</h1>
        <svg width="350" height="12" className="mt-2">
          <path
            d="M 0 6 Q 20 2, 40 6 T 80 6 T 120 6 T 160 6 T 200 6 T 240 6 T 280 6 T 320 6 T 350 6"
            stroke="#000"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-4xl mb-3">📁</div>
          <h3 className="text-lg font-medium mb-1">Total Analyses</h3>
          <p className="text-4xl font-bold mb-2">20</p>
          <p className="text-sm text-green-500">+2% last month</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-4xl mb-3">🌈</div>
          <h3 className="text-lg font-medium mb-1">Average Score</h3>
          <p className="text-4xl font-bold mb-2">89</p>
          <p className="text-sm text-green-500">+5% improvement</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-4xl mb-3">💡</div>
          <h3 className="text-lg font-medium mb-1">Best Score</h3>
          <p className="text-4xl font-bold mb-2">98</p>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500">React Js</span>
            <span className="text-green-500">Next Js</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-medium mb-1">Pending Review</h3>
          <p className="text-4xl font-bold mb-2">3</p>
          <p className="text-sm text-red-500">2 urgent</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Job Applications</h2>
          <div className="h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full bg-[#FDF7F2] rounded-xl hover:-translate-y-0.5 hover:border-[#B8B8B8] p-4 text-left font-medium border border-[#E5E5E5] flex items-center gap-3">
              <span className="text-xl">➕</span>
              New Analysis
            </button>
        
            <Link href="/user/support" className="block">
            <button className="w-full bg-[#FDF7F2] rounded-xl p-4 text-left hover:-translate-y-0.5 hover:border-[#B8B8B8] font-medium border border-[#E5E5E5] transition-shadow flex items-center gap-3">
              <span className="text-xl">🙋</span>
              Get Help
            </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}