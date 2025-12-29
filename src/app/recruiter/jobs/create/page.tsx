'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';

export default function RecruiterPostJob() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    title: '',
    description: '',
    requiredSkills: '',
    experienceLevel: 'mid',
    minExperience: 0,
    maxExperience: 0,
    education: 'bachelors',
    jobType: 'full-time',
    workMode: 'onsite',
    location: '',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'NPR',
    deadline: '',
    maxApplicants: 100,
    benefits: '',
    responsibilities: '',
    isPublic: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        benefits: formData.benefits.split('\n').map(s => s.trim()).filter(Boolean),
        responsibilities: formData.responsibilities.split('\n').map(s => s.trim()).filter(Boolean),
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
      };

      await api.post('/recruiter/jobs', payload);
      toast.success('Job posted successfully!');
      router.push('/recruiter/jobs');

    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Post New Job</h1>
        <p className="text-gray-600">Create a job posting to attract candidates</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        
        {/* Company Info */}
        <h3 className="text-lg font-bold mb-4">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-bold mb-2">Company Name *</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl p-3"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Job Details */}
        <h3 className="text-lg font-bold mb-4 mt-6">Job Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="md:col-span-2">
            <label className="block font-bold mb-2">Job Title *</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl p-3"
              placeholder="e.g., Senior React Developer"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold mb-2">Job Description *</label>
            <textarea
              className="w-full border border-gray-300 rounded-xl p-3"
              rows="6"
              placeholder="Describe the role, responsibilities, and requirements..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold mb-2">Required Skills (comma-separated) *</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl p-3"
              placeholder="React, TypeScript, Node.js, MongoDB"
              value={formData.requiredSkills}
              onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block font-bold mb-2">Experience Level *</label>
            <select
              className="w-full border border-gray-300 rounded-xl p-3"
              value={formData.experienceLevel}
              onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
            >
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
              <option value="lead">Lead</option>
            </select>
          </div>

          <div>
            <label className="block font-bold mb-2">Education *</label>
            <select
              className="w-full border border-gray-300 rounded-xl p-3"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
            >
              <option value="high-school">High School</option>
              <option value="bachelors">Bachelor's Degree</option>
              <option value="masters">Master's Degree</option>
              <option value="phd">PhD</option>
              <option value="any">Any</option>
            </select>
          </div>

          <div>
            <label className="block font-bold mb-2">Job Type *</label>
            <select
              className="w-full border border-gray-300 rounded-xl p-3"
              value={formData.jobType}
              onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
            >
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          <div>
            <label className="block font-bold mb-2">Work Mode *</label>
            <select
              className="w-full border border-gray-300 rounded-xl p-3"
              value={formData.workMode}
              onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
            >
              <option value="onsite">On-site</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold mb-2">Location *</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl p-3"
              placeholder="e.g., Kathmandu, Nepal"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Compensation */}
        <h3 className="text-lg font-bold mb-4 mt-6">Compensation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block font-bold mb-2">Min Salary</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-xl p-3"
              value={formData.salaryMin}
              onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-bold mb-2">Max Salary</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-xl p-3"
              value={formData.salaryMax}
              onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-bold mb-2">Currency</label>
            <select
              className="w-full border border-gray-300 rounded-xl p-3"
              value={formData.salaryCurrency}
              onChange={(e) => setFormData({ ...formData, salaryCurrency: e.target.value })}
            >
              <option value="NPR">NPR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        {/* Additional Info */}
        <h3 className="text-lg font-bold mb-4 mt-6">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-bold mb-2">Application Deadline</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-xl p-3"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-bold mb-2">Max Applicants</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-xl p-3"
              value={formData.maxApplicants}
              onChange={(e) => setFormData({ ...formData, maxApplicants: parseInt(e.target.value) })}
              min="1"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold mb-2">Benefits (one per line)</label>
            <textarea
              className="w-full border border-gray-300 rounded-xl p-3"
              rows="4"
              placeholder="Health insurance
Flexible hours
Remote work
Professional development"
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold mb-2">Responsibilities (one per line)</label>
            <textarea
              className="w-full border border-gray-300 rounded-xl p-3"
              rows="4"
              placeholder="Develop React applications
Write clean, maintainable code
Collaborate with team
Code reviews"
              value={formData.responsibilities}
              onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
            />
          </div>
        </div>

        {/* Submit */}
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
            className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </div>
      </form>
    </>
  );
}
