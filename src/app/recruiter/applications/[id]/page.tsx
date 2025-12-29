'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';

export default function ApplicationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchApplication(params.id as string);
    }
  }, [params.id]);

  const fetchApplication = async (id: string) => {
    try {
      const { data } = await api.get(`/recruiter/applications/${id}`);
      setApplication(data.data || data.application);
    } catch (error: any) {
      toast.error('Failed to load application');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    try {
      await api.patch(`/recruiter/applications/${params.id}/status`, { status });
      toast.success('Status updated successfully');
      fetchApplication(params.id as string);
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  if (loading || !application) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button onClick={() => router.back()} className="mb-6 text-purple-600 hover:underline">
        ← Back to Applications
      </button>

      <div className="bg-white rounded-2xl p-8 shadow-sm border">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {application.applicant?.firstName} {application.applicant?.lastName}
            </h1>
            <p className="text-gray-600">{application.applicant?.email}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${
            application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            application.status === 'interview' ? 'bg-blue-100 text-blue-800' :
            application.status === 'offered' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {application.status}
          </span>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm text-gray-500">Applied For</label>
            <p className="text-lg font-bold">{application.job?.title}</p>
            <p className="text-gray-600">{application.job?.companyName}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Applied On</label>
            <p className="text-lg">{new Date(application.appliedAt).toLocaleDateString()}</p>
          </div>

          {application.coverLetter && (
            <div>
              <label className="text-sm text-gray-500">Cover Letter</label>
              <p className="text-lg bg-gray-50 p-4 rounded-xl">{application.coverLetter}</p>
            </div>
          )}

          <div className="flex gap-4 pt-6">
            <button
              onClick={() => handleStatusChange('interview')}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700"
            >
              Schedule Interview
            </button>
            <button
              onClick={() => handleStatusChange('offered')}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700"
            >
              Make Offer
            </button>
            <button
              onClick={() => handleStatusChange('rejected')}
              className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
