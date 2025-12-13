'use client';

import { useState } from 'react';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const [selectedWeek, setSelectedWeek] = useState('This Week');

  const chartData = {
    labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Users',
        data: [504, 42, 178, 524, 474, 287, 151],
        backgroundColor: '#8B5CF6',
      },
      {
        label: 'Analytics',
        data: [250, 11, 192, 178, 30, 88, 14],
        backgroundColor: '#F97316',
      },
      {
        label: 'Support',
        data: [145, 277, 134, 184, 12, 69, 123],
        backgroundColor: '#06B6D4',
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
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 600,
        ticks: {
          stepSize: 100,
        },
      },
    },
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-green-500 text-sm font-medium flex items-center gap-1">
                +3% <span className="text-xs">📈</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              👥
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded inline-block mb-2">Last week</p>
            <p className="text-3xl font-bold">23,506</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Analytics</p>
              <p className="text-red-500 text-sm font-medium flex items-center gap-1">
                - 5% <span className="text-xs">📉</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              📊
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded inline-block mb-2">Last week</p>
            <p className="text-3xl font-bold">500</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Score</p>
              <p className="text-green-500 text-sm font-medium flex items-center gap-1">
                +3% <span className="text-xs">📈</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              ⭐
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded inline-block mb-2">Last week</p>
            <p className="text-3xl font-bold">82/100</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Support Ticket</p>
              <p className="text-green-500 text-sm font-medium flex items-center gap-1">
                +7% <span className="text-xs">📈</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              🎫
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded inline-block mb-2">Last week</p>
            <p className="text-3xl font-bold">1200</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Weekly Analytics</h2>
          <select 
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option>This Week</option>
            <option>Last Week</option>
            <option>Last Month</option>
          </select>
        </div>
        <div className="h-96">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}