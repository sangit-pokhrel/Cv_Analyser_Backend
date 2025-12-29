'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';

export default function JobDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchJob(params.id as string);
    }
  }, [params.id]);

  const fetchJob = async (id: string) => {
    try {
      const { data } = await api.get(`/recruiter/jobs/${id}`);
      setJob(data.data || data.job);
    } catch (error: any) {
      toast.error('Failed to load job');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading || !job) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button onClick={() => router.back()} className="mb-6 text-purple-600 hover:underline">
        ← Back to Jobs
      </button>

      <div className="bg-white rounded-2xl p-8 shadow-sm border">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            <p className="text-gray-600">{job.companyName} • {job.location}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${
            job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {job.status}
          </span>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm text-gray-500">Description</label>
            <p className="text-lg">{job.description}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Required Skills</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {job.requiredSkills?.map((skill: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Job Type</label>
              <p className="text-lg font-bold capitalize">{job.jobType}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Work Mode</label>
              <p className="text-lg font-bold capitalize">{job.workMode}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Experience Level</label>
              <p className="text-lg font-bold capitalize">{job.experienceLevel}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Applications</label>
              <p className="text-lg font-bold">{job.applicationCount || 0}</p>
            </div>
          </div>

          {job.salaryMin && job.salaryMax && (
            <div>
              <label className="text-sm text-gray-500">Salary Range</label>
              <p className="text-lg font-bold">
                ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
              </p>
            </div>
          )}

          <div className="flex gap-4 pt-6">
            <button
              onClick={() => router.push(`/recruiter/jobs/${job._id}/edit`)}
              className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700"
            >
              Edit Job
            </button>
            <button
              onClick={() => router.push('/recruiter/applications')}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700"
            >
              View Applications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
