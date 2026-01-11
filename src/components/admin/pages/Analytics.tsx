'use client';

import { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [metricType, setMetricType] = useState('All Metric Types');
  const [selectedPeriod, setSelectedPeriod] = useState('Since Launch');

  // Generate dates from Dec 20 to today
  const generateDates = () => {
    const dates = [];
    const labels = [];
    const start = new Date('2024-12-20');
    const today = new Date();
    
    for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
      labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
    }
    return { dates, labels };
  };

  const { dates, labels } = generateDates();

  // Generate realistic traffic data with gradual increase
  const generateTrafficData = () => {
    const data = [];
    let baseVisitors = 15; // Start with 15 visitors on Dec 20
    
    dates.forEach((date, index) => {
      // Gradual increase with fluctuations
      const growthFactor = 1 + (index * 0.08); // 8% growth per day
      const randomFluctuation = Math.random() * 0.4 - 0.2; // ±20% randomness
      const weekendBoost = date.getDay() === 0 || date.getDay() === 6 ? 1.3 : 1; // 30% more on weekends
      
      const visitors = Math.floor(baseVisitors * growthFactor * (1 + randomFluctuation) * weekendBoost);
      data.push(Math.min(visitors, 450)); // Cap at 450
    });
    
    return data;
  };

  const generateAnalyticsData = () => {
    const data = [];
    let baseAnalytics = 8;
    
    dates.forEach((date, index) => {
      const growthFactor = 1 + (index * 0.06);
      const randomFluctuation = Math.random() * 0.5 - 0.25;
      
      const analytics = Math.floor(baseAnalytics * growthFactor * (1 + randomFluctuation));
      data.push(Math.min(analytics, 280));
    });
    
    return data;
  };

  const generateSupportData = () => {
    const data = [];
    let baseSupport = 5;
    
    dates.forEach((date, index) => {
      const growthFactor = 1 + (index * 0.07);
      const randomFluctuation = Math.random() * 0.6 - 0.3;
      
      const support = Math.floor(baseSupport * growthFactor * (1 + randomFluctuation));
      data.push(Math.min(support, 200));
    });
    
    return data;
  };

  const visitorsData = generateTrafficData();
  const analyticsData = generateAnalyticsData();
  const supportData = generateSupportData();

  const totalVisitors = visitorsData.reduce((sum, val) => sum + val, 0);
  const totalAnalytics = analyticsData.reduce((sum, val) => sum + val, 0);
  const avgRating = 4.2;

  // Calculate growth percentages
  const last7DaysVisitors = visitorsData.slice(-7).reduce((sum, val) => sum + val, 0);
  const prev7DaysVisitors = visitorsData.slice(-14, -7).reduce((sum, val) => sum + val, 0);
  const visitorsGrowth = prev7DaysVisitors > 0 
    ? Math.round(((last7DaysVisitors - prev7DaysVisitors) / prev7DaysVisitors) * 100) 
    : 0;

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Visitors',
        data: visitorsData,
        backgroundColor: '#8B5CF6',
        borderColor: '#8B5CF6',
      },
      {
        label: 'Analytics',
        data: analyticsData,
        backgroundColor: '#F97316',
        borderColor: '#F97316',
      },
      {
        label: 'Support',
        data: supportData,
        backgroundColor: '#06B6D4',
        borderColor: '#06B6D4',
      },
    ],
  };

  const lineChartData = {
    labels: labels,
    datasets: [
      {
        label: 'Daily Visitors',
        data: visitorsData,
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 50,
        },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  const lineChartOptions = {
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
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      {/* Launch Info Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">🚀 Platform Launched</h2>
            <p className="text-blue-100">December 20, 2024 - {dates.length} days of operation</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{totalVisitors.toLocaleString()}</p>
            <p className="text-blue-100">Total Visitors Since Launch</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">👥</span>
            </div>
          </div>
          <h3 className="text-lg font-bold mb-2">Total Visitors</h3>
          <p className="text-4xl font-bold mb-2">{totalVisitors.toLocaleString()}</p>
          <p className={`text-sm ${visitorsGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {visitorsGrowth >= 0 ? '+' : ''}{visitorsGrowth}% last 7 days
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">📊</span>
            </div>
          </div>
          <h3 className="text-lg font-bold mb-2">Total Analytics</h3>
          <p className="text-4xl font-bold mb-2">{totalAnalytics.toLocaleString()}</p>
          <p className="text-green-500 text-sm">+12% last 7 days</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">⭐</span>
            </div>
          </div>
          <h3 className="text-lg font-bold mb-2">Average Rating</h3>
          <p className="text-4xl font-bold mb-2">{avgRating}/5</p>
          <p className="text-green-500 text-sm">+0.3 since launch</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option>Last 7 Days</option>
              <option>Last 14 Days</option>
              <option>Last 30 Days</option>
              <option>Since Launch (Dec 20)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Metric Type
            </label>
            <select 
              value={metricType}
              onChange={(e) => setMetricType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option>All Metric Types</option>
              <option>Visitors</option>
              <option>Analytics</option>
              <option>Support</option>
            </select>
          </div>
        </div>
      </div>

      {/* Line Chart - Trend */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-bold mb-6">Visitor Trend Since Launch</h2>
        <div className="h-80">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>

      {/* Bar Chart - All Metrics */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Daily Metrics Breakdown</h2>
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option>Since Launch</option>
            <option>Last 30 Days</option>
            <option>Last 14 Days</option>
            <option>Last 7 Days</option>
          </select>
        </div>
        <div className="h-96">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">📈</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Growth Rate</p>
              <p className="text-xl font-bold text-gray-900">+{visitorsGrowth}%</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Weekly visitor growth trend</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl">📅</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Peak Day</p>
              <p className="text-xl font-bold text-gray-900">{Math.max(...visitorsData)}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Highest daily visitors</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-xl">📊</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Daily Average</p>
              <p className="text-xl font-bold text-gray-900">{Math.round(totalVisitors / dates.length)}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Average visitors per day</p>
        </div>
      </div>
    </div>
  );
}