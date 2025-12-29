'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';

export default function RecruiterMyJobs() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    fetchJobs();
  }, [filter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/recruiter/jobs?status=${filter}`);
      setJobs(data.data);
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">My Jobs</h1>
          <button
            onClick={() => router.push('/recruiter/jobs/create')}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600"
          >
            + Post New Job
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {['active', 'closed', 'draft'].map(status => (
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
        <div className="grid grid-cols-1 gap-4">
          {jobs.map(job => (
            <div key={job._id} className="bg-white border rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-2">{job.title}</h3>
              <p className="text-gray-600 mb-3">{job.description.substring(0, 150)}...</p>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/recruiter/jobs/${job._id}`)}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 font-bold"
                >
                  View Applications ({job.applicationCount || 0})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
