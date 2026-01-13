// 'use client';

// import { useState } from 'react';
// import { Bar, Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// export default function Analytics() {
//   const [dateRange, setDateRange] = useState('Last 30 Days');
//   const [metricType, setMetricType] = useState('All Metric Types');
//   const [selectedPeriod, setSelectedPeriod] = useState('Since Launch');

//   // Generate dates from Dec 20 to today
//   const generateDates = () => {
//     const dates = [];
//     const labels = [];
//     const start = new Date('2024-12-20');
//     const today = new Date();
    
//     for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
//       dates.push(new Date(d));
//       labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
//     }
//     return { dates, labels };
//   };

//   const { dates, labels } = generateDates();

//   // Generate realistic traffic data with gradual increase
//   const generateTrafficData = () => {
//     const data = [];
//     let baseVisitors = 15; // Start with 15 visitors on Dec 20
    
//     dates.forEach((date, index) => {
//       // Gradual increase with fluctuations
//       const growthFactor = 1 + (index * 0.08); // 8% growth per day
//       const randomFluctuation = Math.random() * 0.4 - 0.2; // ±20% randomness
//       const weekendBoost = date.getDay() === 0 || date.getDay() === 6 ? 1.3 : 1; // 30% more on weekends
      
//       const visitors = Math.floor(baseVisitors * growthFactor * (1 + randomFluctuation) * weekendBoost);
//       data.push(Math.min(visitors, 450)); // Cap at 450
//     });
    
//     return data;
//   };

//   const generateAnalyticsData = () => {
//     const data = [];
//     let baseAnalytics = 8;
    
//     dates.forEach((date, index) => {
//       const growthFactor = 1 + (index * 0.06);
//       const randomFluctuation = Math.random() * 0.5 - 0.25;
      
//       const analytics = Math.floor(baseAnalytics * growthFactor * (1 + randomFluctuation));
//       data.push(Math.min(analytics, 280));
//     });
    
//     return data;
//   };

//   const generateSupportData = () => {
//     const data = [];
//     let baseSupport = 5;
    
//     dates.forEach((date, index) => {
//       const growthFactor = 1 + (index * 0.07);
//       const randomFluctuation = Math.random() * 0.6 - 0.3;
      
//       const support = Math.floor(baseSupport * growthFactor * (1 + randomFluctuation));
//       data.push(Math.min(support, 200));
//     });
    
//     return data;
//   };

//   const visitorsData = generateTrafficData();
//   const analyticsData = generateAnalyticsData();
//   const supportData = generateSupportData();

//   const totalVisitors = visitorsData.reduce((sum, val) => sum + val, 0);
//   const totalAnalytics = analyticsData.reduce((sum, val) => sum + val, 0);
//   const avgRating = 4.2;

//   // Calculate growth percentages
//   const last7DaysVisitors = visitorsData.slice(-7).reduce((sum, val) => sum + val, 0);
//   const prev7DaysVisitors = visitorsData.slice(-14, -7).reduce((sum, val) => sum + val, 0);
//   const visitorsGrowth = prev7DaysVisitors > 0 
//     ? Math.round(((last7DaysVisitors - prev7DaysVisitors) / prev7DaysVisitors) * 100) 
//     : 0;

//   const chartData = {
//     labels: labels,
//     datasets: [
//       {
//         label: 'Visitors',
//         data: visitorsData,
//         backgroundColor: '#8B5CF6',
//         borderColor: '#8B5CF6',
//       },
//       {
//         label: 'Analytics',
//         data: analyticsData,
//         backgroundColor: '#F97316',
//         borderColor: '#F97316',
//       },
//       {
//         label: 'Support',
//         data: supportData,
//         backgroundColor: '#06B6D4',
//         borderColor: '#06B6D4',
//       },
//     ],
//   };

//   const lineChartData = {
//     labels: labels,
//     datasets: [
//       {
//         label: 'Daily Visitors',
//         data: visitorsData,
//         borderColor: '#8B5CF6',
//         backgroundColor: 'rgba(139, 92, 246, 0.1)',
//         fill: true,
//         tension: 0.4,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: true,
//         position: 'top' as const,
//       },
//       tooltip: {
//         mode: 'index' as const,
//         intersect: false,
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: {
//           stepSize: 50,
//         },
//       },
//       x: {
//         ticks: {
//           maxRotation: 45,
//           minRotation: 45,
//         },
//       },
//     },
//   };

//   const lineChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//       x: {
//         ticks: {
//           maxRotation: 45,
//           minRotation: 45,
//         },
//       },
//     },
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

//       {/* Launch Info Banner */}
//       <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-6 text-white">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-xl font-semibold mb-2">🚀 Platform Launched</h2>
//             <p className="text-blue-100">December 20, 2024 - {dates.length} days of operation</p>
//           </div>
//           <div className="text-right">
//             <p className="text-3xl font-bold">{totalVisitors.toLocaleString()}</p>
//             <p className="text-blue-100">Total Visitors Since Launch</p>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-start justify-between mb-4">
//             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
//               <span className="text-3xl">👥</span>
//             </div>
//           </div>
//           <h3 className="text-lg font-bold mb-2">Total Visitors</h3>
//           <p className="text-4xl font-bold mb-2">{totalVisitors.toLocaleString()}</p>
//           <p className={`text-sm ${visitorsGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//             {visitorsGrowth >= 0 ? '+' : ''}{visitorsGrowth}% last 7 days
//           </p>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-start justify-between mb-4">
//             <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
//               <span className="text-3xl">📊</span>
//             </div>
//           </div>
//           <h3 className="text-lg font-bold mb-2">Total Analytics</h3>
//           <p className="text-4xl font-bold mb-2">{totalAnalytics.toLocaleString()}</p>
//           <p className="text-green-500 text-sm">+12% last 7 days</p>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-start justify-between mb-4">
//             <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
//               <span className="text-3xl">⭐</span>
//             </div>
//           </div>
//           <h3 className="text-lg font-bold mb-2">Average Rating</h3>
//           <p className="text-4xl font-bold mb-2">{avgRating}/5</p>
//           <p className="text-green-500 text-sm">+0.3 since launch</p>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Date Range
//             </label>
//             <select 
//               value={dateRange}
//               onChange={(e) => setDateRange(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//             >
//               <option>Last 7 Days</option>
//               <option>Last 14 Days</option>
//               <option>Last 30 Days</option>
//               <option>Since Launch (Dec 20)</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Metric Type
//             </label>
//             <select 
//               value={metricType}
//               onChange={(e) => setMetricType(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//             >
//               <option>All Metric Types</option>
//               <option>Visitors</option>
//               <option>Analytics</option>
//               <option>Support</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Line Chart - Trend */}
//       <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
//         <h2 className="text-xl font-bold mb-6">Visitor Trend Since Launch</h2>
//         <div className="h-80">
//           <Line data={lineChartData} options={lineChartOptions} />
//         </div>
//       </div>

//       {/* Bar Chart - All Metrics */}
//       <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-bold">Daily Metrics Breakdown</h2>
//           <select 
//             value={selectedPeriod}
//             onChange={(e) => setSelectedPeriod(e.target.value)}
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//           >
//             <option>Since Launch</option>
//             <option>Last 30 Days</option>
//             <option>Last 14 Days</option>
//             <option>Last 7 Days</option>
//           </select>
//         </div>
//         <div className="h-96">
//           <Bar data={chartData} options={chartOptions} />
//         </div>
//       </div>

//       {/* Key Insights */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center gap-3 mb-3">
//             <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//               <span className="text-green-600 text-xl">📈</span>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Growth Rate</p>
//               <p className="text-xl font-bold text-gray-900">+{visitorsGrowth}%</p>
//             </div>
//           </div>
//           <p className="text-sm text-gray-600">Weekly visitor growth trend</p>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center gap-3 mb-3">
//             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//               <span className="text-blue-600 text-xl">📅</span>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Peak Day</p>
//               <p className="text-xl font-bold text-gray-900">{Math.max(...visitorsData)}</p>
//             </div>
//           </div>
//           <p className="text-sm text-gray-600">Highest daily visitors</p>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center gap-3 mb-3">
//             <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
//               <span className="text-purple-600 text-xl">📊</span>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Daily Average</p>
//               <p className="text-xl font-bold text-gray-900">{Math.round(totalVisitors / dates.length)}</p>
//             </div>
//           </div>
//           <p className="text-sm text-gray-600">Average visitors per day</p>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/baseapi';
import Link from 'next/link';

interface CVAnalysis {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  fileName: string;
  analysisDate: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: number;
  appliedJobs: number;
}

export default function AnalyticsManagement() {
  const [analyses, setAnalyses] = useState<CVAnalysis[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<CVAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof CVAnalysis>('analysisDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [scoreFilter, setScoreFilter] = useState('all');
  
  const itemsPerPage = 20;

  useEffect(() => {
    fetchAnalyses();
  }, []);

  useEffect(() => {
    filterAndSortAnalyses();
  }, [searchQuery, analyses, sortField, sortOrder, scoreFilter]);

  // const fetchAnalyses = async () => {
  //   try {
  //     setLoading(true);
  //     const { data } = await api.get('/cv/admin/analyses');
  //     setAnalyses(data.analyses);
  //   } catch (error) {
  //     console.error('Error fetching analyses:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const fetchAnalyses = async () => {
  try {
    setLoading(true);
    const { data } = await api.get('/cv/admin/analyses');

    setAnalyses(Array.isArray(data?.analyses) ? data.analyses : []);

    
  } catch (error) {
    console.error('Error fetching analyses:', error);
    setAnalyses([]);
  } finally {
    setLoading(false);
  }
};


  const filterAndSortAnalyses = () => {
    let filtered = [...analyses];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(analysis => 
        analysis.id.toString().includes(query) ||
        analysis.userName.toLowerCase().includes(query) ||
        analysis.userEmail.toLowerCase().includes(query) ||
        analysis.fileName.toLowerCase().includes(query)
      );
    }

    // Score filter
    if (scoreFilter !== 'all') {
      if (scoreFilter === 'excellent') {
        filtered = filtered.filter(a => a.score >= 85);
      } else if (scoreFilter === 'good') {
        filtered = filtered.filter(a => a.score >= 75 && a.score < 85);
      } else if (scoreFilter === 'fair') {
        filtered = filtered.filter(a => a.score >= 65 && a.score < 75);
      } else if (scoreFilter === 'poor') {
        filtered = filtered.filter(a => a.score < 65);
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle date sorting
      if (sortField === 'analysisDate') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredAnalyses(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSort = (field: keyof CVAnalysis) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 75) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (score >= 65) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return { label: 'Excellent', icon: '🌟' };
    if (score >= 75) return { label: 'Good', icon: '✅' };
    if (score >= 65) return { label: 'Fair', icon: '📝' };
    return { label: 'Needs Work', icon: '⚠️' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    const headers = ['ID', 'User Name', 'Email', 'File Name', 'Date', 'Score', 'Recommendations', 'Applied Jobs'];
    const rows = filteredAnalyses.map(a => [
      a.id,
      a.userName,
      a.userEmail,
      a.fileName,
      formatDate(a.analysisDate),
      a.score,
      a.recommendations,
      a.appliedJobs
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cv_analyses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Pagination
  const totalPages = Math.ceil(filteredAnalyses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnalyses = filteredAnalyses.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">CV Analytics Management</h1>
          <p className="text-gray-600">
            Total: <span className="font-bold">{analyses.length}</span> analyses | 
            Showing: <span className="font-bold">{filteredAnalyses.length}</span> results
          </p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin/analytics/overview"
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all font-medium"
          >
            📊 View Dashboard
          </Link>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-medium"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Total Analyses</span>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-3xl font-bold">{analyses.length}</p>
          <p className="text-sm text-gray-500 mt-1">All time</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Avg Score</span>
            <span className="text-2xl">⭐</span>
          </div>
          <p className="text-3xl font-bold">
            {analyses.length > 0 
              ? (analyses.reduce((sum, a) => sum + a.score, 0) / analyses.length).toFixed(1)
              : '0'}
          </p>
          <p className="text-sm text-gray-500 mt-1">Out of 100</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Total Jobs</span>
            <span className="text-2xl">💼</span>
          </div>
          <p className="text-3xl font-bold">
            {(analyses ?? []).reduce((sum, a) => sum + a.recommendations, 0)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Recommended</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Applications</span>
            <span className="text-2xl">📝</span>
          </div>
          <p className="text-3xl font-bold">
            {(analyses ?? []).reduce((sum, a) => sum + a.appliedJobs, 0)}

          </p>
          <p className="text-sm text-gray-500 mt-1">Submitted</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by ID, Name, or Email
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search analyses..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Score Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Score
            </label>
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Scores</option>
              <option value="excellent">Excellent (85+)</option>
              <option value="good">Good (75-84)</option>
              <option value="fair">Fair (65-74)</option>
              <option value="poor">Needs Work (&lt;65)</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(searchQuery || scoreFilter !== 'all') && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active filters:</span>
            {searchQuery && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-blue-900">✕</button>
              </span>
            )}
            {scoreFilter !== 'all' && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2">
                Score: {scoreFilter}
                <button onClick={() => setScoreFilter('all')} className="hover:text-purple-900">✕</button>
              </span>
            )}
            <button
              onClick={() => { setSearchQuery(''); setScoreFilter('all'); }}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Analytics Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th 
                  onClick={() => handleSort('id')}
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    ID {sortField === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('userName')}
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    User {sortField === 'userName' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  File Name
                </th>
                <th 
                  onClick={() => handleSort('analysisDate')}
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    Date {sortField === 'analysisDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('score')}
                  className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center justify-center gap-2">
                    Score {sortField === 'score' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Jobs
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentAnalyses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-gray-400">
                      <p className="text-4xl mb-2">🔍</p>
                      <p className="text-lg font-medium">No analyses found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentAnalyses.map((analysis) => {
                  const badge = getScoreBadge(analysis.score);
                  return (
                    <tr key={analysis.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900">#{analysis.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{analysis.userName}</p>
                          <p className="text-xs text-gray-500">{analysis.userEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900 max-w-xs truncate" title={analysis.fileName}>
                          📄 {analysis.fileName}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">{formatDate(analysis.analysisDate)}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${getScoreColor(analysis.score)}`}>
                            {analysis.score}
                          </span>
                          <span className="text-xs text-gray-500">{badge.icon} {badge.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{analysis.recommendations} rec.</p>
                          <p className="text-xs text-gray-500">{analysis.appliedJobs} applied</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => {/* View details modal */}}
                          className="text-blue-600 hover:text-blue-900 font-medium text-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(endIndex, filteredAnalyses.length)}</span> of{' '}
                <span className="font-medium">{filteredAnalyses.length}</span> results
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  First
                </button>
                
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                          currentPage === pageNum
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                </button>

                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}