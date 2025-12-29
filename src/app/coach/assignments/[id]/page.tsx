'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';

export default function AssignmentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [assignment, setAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchAssignment(params.id as string);
    }
  }, [params.id]);

  const fetchAssignment = async (id: string) => {
    try {
      const { data } = await api.get(`/coach/assignments/${id}`);
      setAssignment(data.data || data.assignment);
    } catch (error: any) {
      toast.error('Failed to load assignment');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading || !assignment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button onClick={() => router.back()} className="mb-6 text-green-600 hover:underline">
        ← Back to Assignments
      </button>

      <div className="bg-white rounded-2xl p-8 shadow-sm border">
        <h1 className="text-3xl font-bold mb-6">{assignment.title}</h1>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm text-gray-500">Description</label>
            <p className="text-lg">{assignment.description}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-500">Type</label>
              <p className="text-lg font-bold capitalize">{assignment.type}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Difficulty</label>
              <p className="text-lg font-bold capitalize">{assignment.difficulty}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Points</label>
              <p className="text-lg font-bold">{assignment.points}</p>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-500">Due Date</label>
            <p className="text-lg">{new Date(assignment.dueDate).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Assigned Students</label>
            <p className="text-lg">{assignment.students?.length || 0} students</p>
          </div>
        </div>
      </div>
    </div>
  );
}
