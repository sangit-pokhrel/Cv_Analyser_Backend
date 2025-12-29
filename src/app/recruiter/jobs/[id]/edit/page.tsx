'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    description: '',
    location: '',
    jobType: 'full-time',
    workMode: 'hybrid',
    experienceLevel: 'mid',
    salaryMin: '',
    salaryMax: '',
    requiredSkills: '',
    status: 'active'
  });

  useEffect(() => {
    if (params.id) {
      fetchJob(params.id as string);
    }
  }, [params.id]);

  const fetchJob = async (id: string) => {
    try {
      const { data } = await api.get(`/recruiter/jobs/${id}`);
      const job = data.data || data.job;
      setFormData({
        ...formData,
        title: job.title,
        companyName: job.companyName,
        description: job.description,
        location: job.location,
        jobType: job.jobType,
        workMode: job.workMode,
        experienceLevel: job.experienceLevel,
        salaryMin: job.salaryMin || '',
        salaryMax: job.salaryMax || '',
        requiredSkills: job.requiredSkills?.join(', ') || '',
        status: job.status
      });
    } catch (error: any) {
      toast.error('Failed to load job');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.patch(`/recruiter/jobs/${params.id}`, {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()),
        salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : undefined
      });

      toast.success('Job updated successfully!');
      router.push(`/recruiter/jobs/${params.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update job');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button onClick={() => router.back()} className="mb-6 text-purple-600 hover:underline">
        ← Back to Job Details
      </button>

      <div className="bg-white rounded-2xl p-8 shadow-sm border max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Edit Job</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold mb-2">Job Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full border-2 rounded-xl p-3"
                required
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Company Name *</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                className="w-full border-2 rounded-xl p-3"
                required
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full border-2 rounded-xl p-3"
                required
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full border-2 rounded-xl p-3"
              >
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border-2 rounded-xl p-3 h-32"
              required
            />
          </div>

          <div>
            <label className="block font-bold mb-2">Required Skills (comma separated)</label>
            <input
              type="text"
              value={formData.requiredSkills}
              onChange={(e) => setFormData({...formData, requiredSkills: e.target.value})}
              className="w-full border-2 rounded-xl p-3"
              placeholder="React, TypeScript, Node.js"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold mb-2">Min Salary</label>
              <input
                type="number"
                value={formData.salaryMin}
                onChange={(e) => setFormData({...formData, salaryMin: e.target.value})}
                className="w-full border-2 rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block font-bold mb-2">Max Salary</label>
              <input
                type="number"
                value={formData.salaryMax}
                onChange={(e) => setFormData({...formData, salaryMax: e.target.value})}
                className="w-full border-2 rounded-xl p-3"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 border-2 border-gray-300 py-3 rounded-xl font-bold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
