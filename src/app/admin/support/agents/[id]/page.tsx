'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = 'https://amused-celinka-nothingname-3b1ecdef.koyeb.appapi/v1';

interface Review {
  _id: string;
  ticket: {
    ticketNumber: string;
    subject: string;
  };
  rating: number;
  feedback: string;
  ratedBy: {
    firstName: string;
    lastName: string;
  };
  ratedAt: string;
}

interface Agent {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  averageRating: number;
  totalRatings: number;
}

interface Stats {
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  overall: {
    totalTickets: number;
    avgResponseTime: number;
    avgResolutionTime: number;
  };
}

interface RatingBreakdown {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export default function AgentProfile() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [ratingBreakdown, setRatingBreakdown] = useState<RatingBreakdown>({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgentDetails();
  }, [agentId]);

  const getAccessToken = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];
  };

  const fetchAgentDetails = async () => {
    try {
      setLoading(true);
      const token = getAccessToken();
      const { data } = await axios.get(`${baseURL}/support/admin/agents/${agentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAgent(data.agent);
      setStats(data.stats);
      setRatingBreakdown(data.ratings?.breakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
      setReviews(data.ratings?.recent || []);
    } catch (error: any) {
      console.error('Error fetching agent details:', error);
      toast.error(error.response?.data?.error || 'Failed to load agent profile');
      router.push('/admin/support/agents');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      'admin': 'bg-red-500 text-white',
      'csr': 'bg-blue-500 text-white',
      'sales': 'bg-green-500 text-white'
    };
    return colors[role] || 'bg-gray-500 text-white';
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading agent profile...</p>
        </div>
      </div>
    );
  }

  if (!agent || !stats) {
    return null;
  }

  return (
    <div className="p-6">
      <button
        onClick={() => router.push('/admin/support/agents')}
        className="mb-6 text-gray-600 hover:text-gray-900"
      >
        ← Back to Agents
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl p-8 shadow-sm border mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center text-4xl font-bold">
              {agent.firstName?.[0]}{agent.lastName?.[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{agent.firstName} {agent.lastName}</h1>
              <p className="text-gray-600 mt-1">{agent.email}</p>
              <span className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-bold ${getRoleBadge(agent.role)}`}>
                {agent.role.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 justify-end mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={`text-2xl ${star <= Math.round(agent.averageRating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <p className="text-3xl font-bold text-yellow-900">{agent.averageRating?.toFixed(1) || '0.0'}</p>
              <p className="text-sm text-gray-600 mt-1">{agent.totalRatings || 0} total ratings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <p className="text-blue-100 text-sm font-medium">Total Tickets</p>
          <p className="text-4xl font-bold mt-2">{stats.overall.totalTickets || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <p className="text-green-100 text-sm font-medium">Resolved</p>
          <p className="text-4xl font-bold mt-2">{stats.byStatus?.resolved || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <p className="text-purple-100 text-sm font-medium">Avg Response</p>
          <p className="text-4xl font-bold mt-2">{formatTime(stats.overall.avgResponseTime || 0)}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <p className="text-orange-100 text-sm font-medium">Avg Resolution</p>
          <p className="text-4xl font-bold mt-2">{formatTime(stats.overall.avgResolutionTime || 0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="font-bold text-xl mb-4">⭐ Rating Breakdown</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = ratingBreakdown[rating as keyof RatingBreakdown] || 0;
              const percentage = agent.totalRatings > 0 ? (count / agent.totalRatings) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-8">{rating} ⭐</span>
                  <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-16 text-right">{count} ({percentage.toFixed(0)}%)</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="font-bold text-xl mb-4">📊 Tickets by Status</h3>
          <div className="space-y-3">
            {Object.entries(stats.byStatus || {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium capitalize">{status.replace('_', ' ')}</span>
                <span className="font-bold text-lg">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="font-bold text-xl mb-4">💬 Recent Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No reviews yet</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span
                          key={star}
                          className={star <= review.rating ? 'text-yellow-500' : 'text-gray-300'}
                        >
                          ⭐
                        </span>
                      ))}
                      <span className="font-bold text-lg">{review.rating}/5</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      by {review.ratedBy?.firstName} {review.ratedBy?.lastName}
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{review.ticket?.ticketNumber}</p>
                    <p>{new Date(review.ratedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {review.feedback && (
                  <p className="text-gray-700 italic">"{review.feedback}"</p>
                )}
                <p className="text-sm text-gray-500 mt-1">{review.ticket?.subject}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}