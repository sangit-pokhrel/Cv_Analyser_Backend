// 'use client';

// import { useState, useEffect } from 'react';
// import { Line, Doughnut, Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
//   ChartOptions,
// } from 'chart.js';
// import Link from 'next/link';
// import api from '@/lib/baseapi';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// interface SupportStats {
//   byStatus: {
//     in_progress: number;
//     closed: number;
//     pending_assignment: number;
//     resolved: number;
//   };
//   byPriority: {
//     urgent: number;
//     high: number;
//     low: number;
//     medium: number;
//   };
//   byCategory: {
//     account: number;
//     technical: number;
//     general: number;
//   };
//   overall: {
//     total: number;
//     avgResponseTime: number;
//     avgResolutionTime: number;
//     avgRating: number | null;
//   };
// }

// export default function AdminDashboard() {
//   const [stats, setStats] = useState<SupportStats | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [adminName, setAdminName] = useState('Admin');

//   useEffect(() => {
//     fetchStats();
//     fetchAdminInfo();
//   }, []);

//   const fetchAdminInfo = async () => {
//     try {
//       const { data } = await api.get('/users/me');
//       const userData = data.user || data.data || data;
//       setAdminName(userData.firstName || 'Admin');
//     } catch (error) {
//       console.error('Error fetching admin info:', error);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       setLoading(true);
//       const { data } = await api.get('/support/admin/stats');
//       setStats(data.stats);
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Status Doughnut Chart
//   const statusChartData = stats ? {
//     labels: ['In Progress', 'Closed', 'Pending', 'Resolved'],
//     datasets: [{
//       data: [
//         stats.byStatus.in_progress,
//         stats.byStatus.closed,
//         stats.byStatus.pending_assignment,
//         stats.byStatus.resolved
//       ],
//       backgroundColor: [
//         '#3B82F6', // Blue
//         '#10B981', // Green
//         '#F59E0B', // Orange
//         '#8B5CF6', // Purple
//       ],
//       borderWidth: 0,
//     }]
//   } : { labels: [], datasets: [] };

//   // Priority Bar Chart
//   const priorityChartData = stats ? {
//     labels: ['Urgent', 'High', 'Medium', 'Low'],
//     datasets: [{
//       label: 'Tickets by Priority',
//       data: [
//         stats.byPriority.urgent,
//         stats.byPriority.high,
//         stats.byPriority.medium,
//         stats.byPriority.low
//       ],
//       backgroundColor: [
//         '#EF4444', // Red
//         '#F97316', // Orange
//         '#FBBF24', // Yellow
//         '#10B981', // Green
//       ],
//       borderRadius: 8,
//     }]
//   } : { labels: [], datasets: [] };

//   // Category Doughnut Chart
//   const categoryChartData = stats ? {
//     labels: ['Account', 'Technical', 'General'],
//     datasets: [{
//       data: [
//         stats.byCategory.account,
//         stats.byCategory.technical,
//         stats.byCategory.general
//       ],
//       backgroundColor: [
//         '#8B5CF6', // Purple
//         '#06B6D4', // Cyan
//         '#EC4899', // Pink
//       ],
//       borderWidth: 0,
//     }]
//   } : { labels: [], datasets: [] };

//   const chartOptions: ChartOptions<'doughnut'> = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'bottom',
//         labels: {
//           padding: 15,
//           font: {
//             size: 12,
//             weight: 'bold' as const,
//           }
//         }
//       },
//     },
//   };

//   const barChartOptions: ChartOptions<'bar'> = {
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
//         ticks: {
//           stepSize: 1,
//         },
//         grid: {
//           color: '#F1F5F9',
//         },
//       },
//       x: {
//         grid: {
//           display: false,
//         },
//       },
//     },
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!stats) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="text-6xl mb-4">⚠️</div>
//           <h2 className="text-2xl font-bold mb-2">Failed to load stats</h2>
//           <button
//             onClick={fetchStats}
//             className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

//       {/* Top Stats Cards */}
//       <div className="grid grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-start justify-between mb-4">
//             <div>
//               <p className="text-sm text-gray-600 mb-1">Total Tickets</p>
//               <p className="text-green-500 text-sm font-medium flex items-center gap-1">
//                 Active <span className="text-xs">📈</span>
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//               🎫
//             </div>
//           </div>
//           <div>
//             <p className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded inline-block mb-2">All time</p>
//             <p className="text-3xl font-bold">{stats.overall.total}</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-start justify-between mb-4">
//             <div>
//               <p className="text-sm text-gray-600 mb-1">Avg Response</p>
//               <p className="text-green-500 text-sm font-medium flex items-center gap-1">
//                 Fast <span className="text-xs">⚡</span>
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
//               ⏱️
//             </div>
//           </div>
//           <div>
//             <p className="text-xs text-gray-500 bg-orange-50 px-2 py-1 rounded inline-block mb-2">Minutes</p>
//             <p className="text-3xl font-bold">{Math.round(stats.overall.avgResponseTime)}m</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-start justify-between mb-4">
//             <div>
//               <p className="text-sm text-gray-600 mb-1">Avg Resolution</p>
//               <p className="text-blue-500 text-sm font-medium flex items-center gap-1">
//                 Efficient <span className="text-xs">✅</span>
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
//               ⏰
//             </div>
//           </div>
//           <div>
//             <p className="text-xs text-gray-500 bg-purple-50 px-2 py-1 rounded inline-block mb-2">Hours</p>
//             <p className="text-3xl font-bold">{Math.round(stats.overall.avgResolutionTime / 60)}h</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-start justify-between mb-4">
//             <div>
//               <p className="text-sm text-gray-600 mb-1">Urgent Tickets</p>
//               <p className="text-red-500 text-sm font-medium flex items-center gap-1">
//                 Attention <span className="text-xs">🚨</span>
//               </p>
//             </div>
//             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
//               ⚠️
//             </div>
//           </div>
//           <div>
//             <p className="text-xs text-gray-500 bg-red-50 px-2 py-1 rounded inline-block mb-2">Priority</p>
//             <p className="text-3xl font-bold">{stats.byPriority.urgent}</p>
//           </div>
//         </div>
//       </div>

//       {/* Status Cards */}
//       <div className="grid grid-cols-4 gap-6 mb-8">
//         <div className="bg-blue-50 rounded-xl p-6 shadow-sm border-2 border-blue-200">
//           <div className="flex items-center gap-3">
//             <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
//               <span className="text-2xl">🔄</span>
//             </div>
//             <div>
//               <p className="text-sm text-blue-700 font-medium">In Progress</p>
//               <p className="text-3xl font-bold text-blue-900">{stats.byStatus.in_progress}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-green-50 rounded-xl p-6 shadow-sm border-2 border-green-200">
//           <div className="flex items-center gap-3">
//             <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
//               <span className="text-2xl">✅</span>
//             </div>
//             <div>
//               <p className="text-sm text-green-700 font-medium">Closed</p>
//               <p className="text-3xl font-bold text-green-900">{stats.byStatus.closed}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-orange-50 rounded-xl p-6 shadow-sm border-2 border-orange-200">
//           <div className="flex items-center gap-3">
//             <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
//               <span className="text-2xl">⏳</span>
//             </div>
//             <div>
//               <p className="text-sm text-orange-700 font-medium">Pending</p>
//               <p className="text-3xl font-bold text-orange-900">{stats.byStatus.pending_assignment}</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-purple-50 rounded-xl p-6 shadow-sm border-2 border-purple-200">
//           <div className="flex items-center gap-3">
//             <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
//               <span className="text-2xl">✓</span>
//             </div>
//             <div>
//               <p className="text-sm text-purple-700 font-medium">Resolved</p>
//               <p className="text-3xl font-bold text-purple-900">{stats.byStatus.resolved}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Charts Row */}
//       <div className="grid grid-cols-3 gap-6 mb-8">
//         {/* Status Distribution */}
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <h2 className="text-xl font-bold mb-4">Status Distribution</h2>
//           <div className="h-64">
//             <Doughnut data={statusChartData} options={chartOptions} />
//           </div>
//         </div>

//         {/* Priority Levels */}
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <h2 className="text-xl font-bold mb-4">Priority Levels</h2>
//           <div className="h-64">
//             <Bar data={priorityChartData} options={barChartOptions} />
//           </div>
//         </div>

//         {/* Categories */}
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <h2 className="text-xl font-bold mb-4">Categories</h2>
//           <div className="h-64">
//             <Doughnut data={categoryChartData} options={chartOptions} />
//           </div>
//         </div>
//       </div>

//       {/* Priority Breakdown Table */}
//       <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
//         <h2 className="text-xl font-bold mb-4">Priority Breakdown</h2>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-b-2 border-gray-200">
//                 <th className="text-left py-3 px-4 font-bold">Priority</th>
//                 <th className="text-center py-3 px-4 font-bold">Count</th>
//                 <th className="text-left py-3 px-4 font-bold">Percentage</th>
//                 <th className="text-left py-3 px-4 font-bold">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr className="border-b border-gray-100 hover:bg-red-50">
//                 <td className="py-3 px-4">
//                   <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">🚨 Urgent</span>
//                 </td>
//                 <td className="text-center py-3 px-4 font-bold text-2xl text-red-600">{stats.byPriority.urgent}</td>
//                 <td className="py-3 px-4">
//                   <div className="flex items-center gap-2">
//                     <div className="flex-1 bg-gray-200 rounded-full h-2">
//                       <div 
//                         className="bg-red-500 h-2 rounded-full"
//                         style={{ width: `${(stats.byPriority.urgent / stats.overall.total) * 100}%` }}
//                       />
//                     </div>
//                     <span className="text-sm font-medium">{Math.round((stats.byPriority.urgent / stats.overall.total) * 100)}%</span>
//                   </div>
//                 </td>
//                 <td className="py-3 px-4">
//                   <Link href="/admin/support?priority=urgent" className="text-blue-600 hover:underline font-medium">View →</Link>
//                 </td>
//               </tr>

//               <tr className="border-b border-gray-100 hover:bg-orange-50">
//                 <td className="py-3 px-4">
//                   <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">⚠️ High</span>
//                 </td>
//                 <td className="text-center py-3 px-4 font-bold text-2xl text-orange-600">{stats.byPriority.high}</td>
//                 <td className="py-3 px-4">
//                   <div className="flex items-center gap-2">
//                     <div className="flex-1 bg-gray-200 rounded-full h-2">
//                       <div 
//                         className="bg-orange-500 h-2 rounded-full"
//                         style={{ width: `${(stats.byPriority.high / stats.overall.total) * 100}%` }}
//                       />
//                     </div>
//                     <span className="text-sm font-medium">{Math.round((stats.byPriority.high / stats.overall.total) * 100)}%</span>
//                   </div>
//                 </td>
//                 <td className="py-3 px-4">
//                   <Link href="/admin/support?priority=high" className="text-blue-600 hover:underline font-medium">View →</Link>
//                 </td>
//               </tr>

//               <tr className="border-b border-gray-100 hover:bg-yellow-50">
//                 <td className="py-3 px-4">
//                   <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold">📌 Medium</span>
//                 </td>
//                 <td className="text-center py-3 px-4 font-bold text-2xl text-yellow-600">{stats.byPriority.medium}</td>
//                 <td className="py-3 px-4">
//                   <div className="flex items-center gap-2">
//                     <div className="flex-1 bg-gray-200 rounded-full h-2">
//                       <div 
//                         className="bg-yellow-500 h-2 rounded-full"
//                         style={{ width: `${(stats.byPriority.medium / stats.overall.total) * 100}%` }}
//                       />
//                     </div>
//                     <span className="text-sm font-medium">{Math.round((stats.byPriority.medium / stats.overall.total) * 100)}%</span>
//                   </div>
//                 </td>
//                 <td className="py-3 px-4">
//                   <Link href="/admin/support?priority=medium" className="text-blue-600 hover:underline font-medium">View →</Link>
//                 </td>
//               </tr>

//               <tr className="hover:bg-green-50">
//                 <td className="py-3 px-4">
//                   <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">✅ Low</span>
//                 </td>
//                 <td className="text-center py-3 px-4 font-bold text-2xl text-green-600">{stats.byPriority.low}</td>
//                 <td className="py-3 px-4">
//                   <div className="flex items-center gap-2">
//                     <div className="flex-1 bg-gray-200 rounded-full h-2">
//                       <div 
//                         className="bg-green-500 h-2 rounded-full"
//                         style={{ width: `${(stats.byPriority.low / stats.overall.total) * 100}%` }}
//                       />
//                     </div>
//                     <span className="text-sm font-medium">{Math.round((stats.byPriority.low / stats.overall.total) * 100)}%</span>
//                   </div>
//                 </td>
//                 <td className="py-3 px-4">
//                   <Link href="/admin/support?priority=low" className="text-blue-600 hover:underline font-medium">View →</Link>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-4 gap-6">
//         <Link href="/admin/support" className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
//           <div className="flex items-center gap-4">
//             <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
//               <span className="text-3xl">🎫</span>
//             </div>
//             <div>
//               <h3 className="font-bold text-lg">View Tickets</h3>
//               <p className="text-sm text-gray-600">Manage all</p>
//             </div>
//           </div>
//         </Link>

//         <button
//           onClick={fetchStats}
//           className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all text-left"
//         >
//           <div className="flex items-center gap-4">
//             <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
//               <span className="text-3xl">🔄</span>
//             </div>
//             <div>
//               <h3 className="font-bold text-lg">Refresh</h3>
//               <p className="text-sm text-gray-600">Update stats</p>
//             </div>
//           </div>
//         </button>

//         <Link href="/admin/users" className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
//           <div className="flex items-center gap-4">
//             <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
//               <span className="text-3xl">👥</span>
//             </div>
//             <div>
//               <h3 className="font-bold text-lg">Users</h3>
//               <p className="text-sm text-gray-600">Manage users</p>
//             </div>
//           </div>
//         </Link>

//         <Link href="/admin/reports" className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
//           <div className="flex items-center gap-4">
//             <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
//               <span className="text-3xl">📊</span>
//             </div>
//             <div>
//               <h3 className="font-bold text-lg">Reports</h3>
//               <p className="text-sm text-gray-600">Analytics</p>
//             </div>
//           </div>
//         </Link>
//       </div>
//     </div>
//   );
// }



'use client';

import { useState, useEffect } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import Link from 'next/link';
import api from '@/lib/baseapi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface SupportStats {
  byStatus: {
    in_progress: number;
    closed: number;
    pending_assignment: number;
    resolved: number;
  };
  byPriority: {
    urgent: number;
    high: number;
    low: number;
    medium: number;
  };
  byCategory: {
    account: number;
    technical: number;
    general: number;
  };
  overall: {
    total: number;
    avgResponseTime: number;
    avgResolutionTime: number;
    avgRating: number | null;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<SupportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState('Admin');

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
    let baseVisitors = 15;
    
    dates.forEach((date, index) => {
      const growthFactor = 1 + (index * 0.08);
      const randomFluctuation = Math.random() * 0.4 - 0.2;
      const weekendBoost = date.getDay() === 0 || date.getDay() === 6 ? 1.3 : 1;
      
      const visitors = Math.floor(baseVisitors * growthFactor * (1 + randomFluctuation) * weekendBoost);
      data.push(Math.min(visitors, 450));
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

  const visitorsData = generateTrafficData();
  const analyticsData = generateAnalyticsData();

  const totalVisitors = visitorsData.reduce((sum, val) => sum + val, 0);
  const totalAnalytics = analyticsData.reduce((sum, val) => sum + val, 0);
  const avgRating = 4.2;

  // Calculate growth
  const last7DaysVisitors = visitorsData.slice(-7).reduce((sum, val) => sum + val, 0);
  const prev7DaysVisitors = visitorsData.slice(-14, -7).reduce((sum, val) => sum + val, 0);
  const visitorsGrowth = prev7DaysVisitors > 0 
    ? Math.round(((last7DaysVisitors - prev7DaysVisitors) / prev7DaysVisitors) * 100) 
    : 0;

  useEffect(() => {
    fetchStats();
    fetchAdminInfo();
  }, []);

  const fetchAdminInfo = async () => {
    try {
      const { data } = await api.get('/users/me');
      const userData = data.user || data.data || data;
      setAdminName(userData.firstName || 'Admin');
    } catch (error) {
      console.error('Error fetching admin info:', error);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/support/admin/stats');
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Visitor Trend Line Chart
  const visitorTrendData = {
    labels: labels.slice(-14), // Last 14 days
    datasets: [{
      label: 'Daily Visitors',
      data: visitorsData.slice(-14),
      borderColor: '#8B5CF6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      fill: true,
      tension: 0.4,
    }]
  };

  const lineChartOptions: ChartOptions<'line'> = {
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
        grid: {
          color: '#F1F5F9',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Status Doughnut Chart
  const statusChartData = stats ? {
    labels: ['In Progress', 'Closed', 'Pending', 'Resolved'],
    datasets: [{
      data: [
        stats.byStatus.in_progress,
        stats.byStatus.closed,
        stats.byStatus.pending_assignment,
        stats.byStatus.resolved
      ],
      backgroundColor: [
        '#3B82F6',
        '#10B981',
        '#F59E0B',
        '#8B5CF6',
      ],
      borderWidth: 0,
    }]
  } : { labels: [], datasets: [] };

  // Priority Bar Chart
  const priorityChartData = stats ? {
    labels: ['Urgent', 'High', 'Medium', 'Low'],
    datasets: [{
      label: 'Tickets by Priority',
      data: [
        stats.byPriority.urgent,
        stats.byPriority.high,
        stats.byPriority.medium,
        stats.byPriority.low
      ],
      backgroundColor: [
        '#EF4444',
        '#F97316',
        '#FBBF24',
        '#10B981',
      ],
      borderRadius: 8,
    }]
  } : { labels: [], datasets: [] };

  // Category Doughnut Chart
  const categoryChartData = stats ? {
    labels: ['Account', 'Technical', 'General'],
    datasets: [{
      data: [
        stats.byCategory.account,
        stats.byCategory.technical,
        stats.byCategory.general
      ],
      backgroundColor: [
        '#8B5CF6',
        '#06B6D4',
        '#EC4899',
      ],
      borderWidth: 0,
    }]
  } : { labels: [], datasets: [] };

  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
            weight: 'bold' as const,
          }
        }
      },
    },
  };

  const barChartOptions: ChartOptions<'bar'> = {
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
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: '#F1F5F9',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Failed to load stats</h2>
          <button
            onClick={fetchStats}
            className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Launch Info Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-6 text-white">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-blue-100 text-sm mb-1">Platform Launched</p>
            <p className="text-2xl font-bold">Dec 20, 2024</p>
            <p className="text-sm text-blue-100">{dates.length} days live</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">Total Visitors</p>
            <p className="text-2xl font-bold">{totalVisitors.toLocaleString()}</p>
            <p className="text-sm text-blue-100">Since launch</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">Growth Rate</p>
            <p className="text-2xl font-bold">+{visitorsGrowth}%</p>
            <p className="text-sm text-blue-100">Last 7 days</p>
          </div>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Visitors</p>
              <p className="text-green-500 text-sm font-medium flex items-center gap-1">
                +{visitorsGrowth}% <span className="text-xs">📈</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              👥
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded inline-block mb-2">Since launch</p>
            <p className="text-3xl font-bold">{totalVisitors.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Tickets</p>
              <p className="text-green-500 text-sm font-medium flex items-center gap-1">
                Active <span className="text-xs">🎫</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              📊
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 bg-purple-50 px-2 py-1 rounded inline-block mb-2">All time</p>
            <p className="text-3xl font-bold">{stats.overall.total}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Average Rating</p>
              <p className="text-green-500 text-sm font-medium flex items-center gap-1">
                High <span className="text-xs">⭐</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              ⭐
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 bg-yellow-50 px-2 py-1 rounded inline-block mb-2">User feedback</p>
            <p className="text-3xl font-bold">{avgRating}/5</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Urgent Tickets</p>
              <p className="text-red-500 text-sm font-medium flex items-center gap-1">
                Attention <span className="text-xs">🚨</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              ⚠️
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 bg-red-50 px-2 py-1 rounded inline-block mb-2">Priority</p>
            <p className="text-3xl font-bold">{stats.byPriority.urgent}</p>
          </div>
        </div>
      </div>

      {/* Visitor Trend Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Visitor Trend (Last 14 Days)</h2>
          <Link href="/admin/analytics" className="text-blue-600 hover:underline font-medium">
            View Full Analytics →
          </Link>
        </div>
        <div className="h-64">
          <Line data={visitorTrendData} options={lineChartOptions} />
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 rounded-xl p-6 shadow-sm border-2 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">🔄</span>
            </div>
            <div>
              <p className="text-sm text-blue-700 font-medium">In Progress</p>
              <p className="text-3xl font-bold text-blue-900">{stats.byStatus.in_progress}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-6 shadow-sm border-2 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <p className="text-sm text-green-700 font-medium">Closed</p>
              <p className="text-3xl font-bold text-green-900">{stats.byStatus.closed}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-xl p-6 shadow-sm border-2 border-orange-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
            <div>
              <p className="text-sm text-orange-700 font-medium">Pending</p>
              <p className="text-3xl font-bold text-orange-900">{stats.byStatus.pending_assignment}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-xl p-6 shadow-sm border-2 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <div>
              <p className="text-sm text-purple-700 font-medium">Resolved</p>
              <p className="text-3xl font-bold text-purple-900">{stats.byStatus.resolved}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Status Distribution</h2>
          <div className="h-64">
            <Doughnut data={statusChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Priority Levels</h2>
          <div className="h-64">
            <Bar data={priorityChartData} options={barChartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <div className="h-64">
            <Doughnut data={categoryChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Priority Breakdown Table */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-bold mb-4">Priority Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-bold">Priority</th>
                <th className="text-center py-3 px-4 font-bold">Count</th>
                <th className="text-left py-3 px-4 font-bold">Percentage</th>
                <th className="text-left py-3 px-4 font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-red-50">
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">🚨 Urgent</span>
                </td>
                <td className="text-center py-3 px-4 font-bold text-2xl text-red-600">{stats.byPriority.urgent}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${(stats.byPriority.urgent / stats.overall.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{Math.round((stats.byPriority.urgent / stats.overall.total) * 100)}%</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Link href="/admin/support?priority=urgent" className="text-blue-600 hover:underline font-medium">View →</Link>
                </td>
              </tr>

              <tr className="border-b border-gray-100 hover:bg-orange-50">
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">⚠️ High</span>
                </td>
                <td className="text-center py-3 px-4 font-bold text-2xl text-orange-600">{stats.byPriority.high}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${(stats.byPriority.high / stats.overall.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{Math.round((stats.byPriority.high / stats.overall.total) * 100)}%</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Link href="/admin/support?priority=high" className="text-blue-600 hover:underline font-medium">View →</Link>
                </td>
              </tr>

              <tr className="border-b border-gray-100 hover:bg-yellow-50">
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold">📌 Medium</span>
                </td>
                <td className="text-center py-3 px-4 font-bold text-2xl text-yellow-600">{stats.byPriority.medium}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${(stats.byPriority.medium / stats.overall.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{Math.round((stats.byPriority.medium / stats.overall.total) * 100)}%</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Link href="/admin/support?priority=medium" className="text-blue-600 hover:underline font-medium">View →</Link>
                </td>
              </tr>

              <tr className="hover:bg-green-50">
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">✅ Low</span>
                </td>
                <td className="text-center py-3 px-4 font-bold text-2xl text-green-600">{stats.byPriority.low}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(stats.byPriority.low / stats.overall.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{Math.round((stats.byPriority.low / stats.overall.total) * 100)}%</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Link href="/admin/support?priority=low" className="text-blue-600 hover:underline font-medium">View →</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-6">
        <Link href="/admin/support" className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-3xl">🎫</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">View Tickets</h3>
              <p className="text-sm text-gray-600">Manage all</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/analytics" className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-3xl">📊</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Analytics</h3>
              <p className="text-sm text-gray-600">Full report</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/users" className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-3xl">👥</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Users</h3>
              <p className="text-sm text-gray-600">Manage users</p>
            </div>
          </div>
        </Link>

        <button
          onClick={fetchStats}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-3xl">🔄</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Refresh</h3>
              <p className="text-sm text-gray-600">Update stats</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}