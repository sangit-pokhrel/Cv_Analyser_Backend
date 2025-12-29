'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';

type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead';
type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';
type WorkMode = 'onsite' | 'remote' | 'hybrid';

interface JobForm {
  companyName: string;
  title: string;
  description: string;
  requiredSkills: string;
  experienceLevel: ExperienceLevel;
  minExperience: number;
  maxExperience: number;
  education: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  deadline: string;
  maxApplicants: number;
  benefits: string;
  responsibilities: string;
  isPublic: boolean;
}

export default function RecruiterPostJob() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<JobForm>({
    companyName: '',
    title: '',
    description: '',
    requiredSkills: '',
    experienceLevel: 'mid',
    minExperience: 0,
    maxExperience: 0,
    education: 'bachelors',
    jobType: '',
    workMode: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'NPR',
    deadline: '',
    maxApplicants: 100,
    benefits: '',
    responsibilities: '',
    isPublic: true,
   
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        benefits: formData.benefits.split('\n').map(s => s.trim()).filter(Boolean),
        responsibilities: formData.responsibilities.split('\n').map(s => s.trim()).filter(Boolean),
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : undefined,
      };

      await api.post('/recruiter/jobs', payload);
      toast.success('Job posted successfully!');
      router.push('/recruiter/jobs');

    } catch (error: unknown) {
      console.error('Error:', error);

      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error ?? 'Failed to post job');

    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof JobForm, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const safeDate = (date: string | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString();
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Post New Job</h1>
        <p className="text-gray-600">Create a job posting to attract candidates</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">

        <h3 className="text-lg font-bold mb-4">Company Information</h3>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-xl p-3 mb-6"
          value={formData.companyName}
          onChange={(e) => updateField('companyName', e.target.value)}
          required
        />

        <h3 className="text-lg font-bold mb-4">Job Details</h3>
        <textarea
          className="w-full border border-gray-300 rounded-xl p-3 mb-6"
          rows={6}
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <input
            type="text"
            className="md:col-span-2 w-full border border-gray-300 rounded-xl p-3"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            required
          />

          <input
            type="text"
            className="md:col-span-2 w-full border border-gray-300 rounded-xl p-3"
            value={formData.requiredSkills}
            onChange={(e) => updateField('requiredSkills', e.target.value)}
            required
          />

          <select
            className="w-full border border-gray-300 rounded-xl p-3"
            value={formData.experienceLevel}
            onChange={(e) => updateField('experienceLevel', e.target.value)}
          >
            <option value="entry">Entry</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>

          <select
            className="w-full border border-gray-300 rounded-xl p-3"
            value={formData.jobType}
            onChange={(e) => updateField('jobType', e.target.value)}
          >
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>

          <select
            className="w-full border border-gray-300 rounded-xl p-3"
            value={formData.workMode}
            onChange={(e) => updateField('workMode', e.target.value)}
          >
            <option value="onsite">Onsite</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>

          <input
            type="text"
            className="md:col-span-2 w-full border border-gray-300 rounded-xl p-3"
            value={formData.location}
            onChange={(e) => updateField('location', e.target.value)}
            required
          />
        </div>

        <h3 className="text-lg font-bold mb-4">Compensation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <input
            type="number"
            className="w-full border border-gray-300 rounded-xl p-3"
            value={formData.salaryMin}
            onChange={(e) => updateField('salaryMin', e.target.value)}
          />
          <input
            type="number"
            className="w-full border border-gray-300 rounded-xl p-3"
            value={formData.salaryMax}
            onChange={(e) => updateField('salaryMax', e.target.value)}
          />
          <select
            className="w-full border border-gray-300 rounded-xl p-3"
            value={formData.salaryCurrency}
            onChange={(e) => updateField('salaryCurrency', e.target.value)}
          >
            <option value="NPR">NPR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <input
            type="date"
            className="w-full border border-gray-300 rounded-xl p-3"
            value={formData.deadline}
            onChange={(e) => updateField('deadline', e.target.value)}
          />
          <input
            type="number"
            className="w-full border border-gray-300 rounded-xl p-3"
            value={formData.maxApplicants}
            onChange={(e) => updateField('maxApplicants', e.target.value)}
            min={1}
          />
        </div>

        <textarea
          className="w-full border border-gray-300 rounded-xl p-3 mb-6"
          rows={4}
          value={formData.benefits}
          onChange={(e) => updateField('benefits', e.target.value)}
        />

        <textarea
          className="w-full border border-gray-300 rounded-xl p-3 mb-6"
          rows={4}
          value={formData.responsibilities}
          onChange={(e) => updateField('responsibilities', e.target.value)}
        />

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </div>
      </form>
    </>
  );
}
