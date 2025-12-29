'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';

export default function UserAssignments() {
  const router = useRouter();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchAssignments();
  }, [filter]);

  const fetchAssignments = async () => {
    try {
      const { data } = await api.get(`/user/assignments?status=${filter}`);
      setAssignments(data.data);
    } catch (error) {
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">My Assignments</h1>
        <p className="text-gray-600">Complete assignments from your coach</p>
      </div>

      <div className="flex gap-2 mb-6">
        {['pending', 'submitted', 'reviewed'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-2 rounded-xl font-bold capitalize ${
              filter === status ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : assignments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <p className="text-gray-500">No {filter} assignments</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {assignments.map(assignment => (
            <div key={assignment._id} className="bg-white border rounded-2xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{assignment.title}</h3>
                  <p className="text-gray-600 mb-3">{assignment.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm mb-3">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full capitalize">
                      {assignment.type}
                    </span>
                    <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full capitalize">
                      {assignment.difficulty}
                    </span>
                    <span className="text-gray-600">Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    <span className="text-gray-600">Points: {assignment.points}</span>
                  </div>

                  {assignment.mySubmission?.grade && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="font-bold text-green-600">Grade: {assignment.mySubmission.grade}/{assignment.points}</div>
                      {assignment.mySubmission.feedback && (
                        <div className="text-sm mt-2">{assignment.mySubmission.feedback}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {assignment.myStatus === 'pending' && (
                <button
                  onClick={() => router.push(`/user/assignments/${assignment._id}`)}
                  className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 font-bold"
                >
                  Start Assignment
                </button>
              )}

              {assignment.myStatus === 'submitted' && (
                <div className="bg-orange-50 text-orange-600 p-3 rounded-xl text-center font-bold">
                  Submitted - Awaiting Review
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
