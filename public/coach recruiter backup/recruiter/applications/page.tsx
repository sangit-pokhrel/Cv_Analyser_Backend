'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';

export default function RecruiterApplications() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/recruiter/applications?status=${filter}`);
      setApplications(data.data);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      await api.put(`/recruiter/applications/${appId}/status`, { status });
      toast.success('Application updated');
      fetchApplications();
    } catch (error) {
      toast.error('Failed to update application');
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Applications</h1>
        <p className="text-gray-600">Review and manage candidate applications</p>
      </div>

      <div className="flex gap-2 mb-6">
        {['pending', 'interview', 'offered', 'rejected'].map(status => (
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
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-bold">Applicant</th>
                <th className="text-left p-4 font-bold">Job</th>
                <th className="text-left p-4 font-bold">Applied</th>
                <th className="text-left p-4 font-bold">Status</th>
                <th className="text-left p-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app._id} className="border-t">
                  <td className="p-4">
                    <div className="font-bold">{app.applicant?.firstName} {app.applicant?.lastName}</div>
                    <div className="text-sm text-gray-600">{app.applicant?.email}</div>
                  </td>
                  <td className="p-4">{app.job?.title}</td>
                  <td className="p-4 text-sm">{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-600">
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(app._id, 'interview')}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                      >
                        Interview
                      </button>
                      <button
                        onClick={() => updateStatus(app._id, 'rejected')}
                        className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
