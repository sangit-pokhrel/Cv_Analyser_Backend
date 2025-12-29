'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';
import type { Student } from '@/types';

export default function StudentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchStudent(params.id as string);
    }
  }, [params.id]);

  const fetchStudent = async (id: string) => {
    try {
      const { data } = await api.get(`/coach/students/${id}`);
      setStudent(data.data || data.student);
    } catch (error: any) {
      toast.error('Failed to load student details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button onClick={() => router.back()} className="mb-6 text-green-600 hover:underline">
        ← Back to Students
      </button>

      <div className="bg-white rounded-2xl p-8 shadow-sm border">
        <h1 className="text-3xl font-bold mb-6">Student Details</h1>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-500">Name</label>
            <p className="text-lg font-bold">{student?.firstName} {student?.lastName}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="text-lg">{student?.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Phone</label>
            <p className="text-lg">{student?.phoneNumber || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Status</label>
            <span className={`inline-block px-3 py-1 rounded-full text-sm ${
              student?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {student?.status || 'Active'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
