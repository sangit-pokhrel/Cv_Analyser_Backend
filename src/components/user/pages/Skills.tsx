'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  skills: string[];
}

export default function Skills() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [editingSkill, setEditingSkill] = useState<{ oldName: string; newName: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users/me');
      const userData = data.user || data;
      setProfile(userData);
      setSkills(userData.skills || []);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSkillName.trim()) {
      toast.error('Please enter a skill name');
      return;
    }

    // Check if skill already exists (case-insensitive)
    if (skills.some(s => s.toLowerCase() === newSkillName.trim().toLowerCase())) {
      toast.error('This skill already exists');
      return;
    }

    try {
      setSubmitting(true);
      
      // Add skill to the array
      const updatedSkills = [...skills, newSkillName.trim()];
      
      // Update profile with new skills array
      const { data } = await api.put('/users/profile', { skills: updatedSkills });
      
      // Update local state immediately from response
      const userData = data.data || data.user || data;
      setSkills(userData.skills || updatedSkills);
      setProfile(userData);
      
      toast.success('Skill added successfully! 🎉');
      setNewSkillName('');
      setShowAddModal(false);
    } catch (error: any) {
      console.error('Error adding skill:', error);
      toast.error(error.response?.data?.message || 'Failed to add skill');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingSkill || !editingSkill.newName.trim()) {
      toast.error('Please enter a skill name');
      return;
    }

    // Check if new name already exists (excluding current skill)
    if (skills.some(s => s !== editingSkill.oldName && s.toLowerCase() === editingSkill.newName.trim().toLowerCase())) {
      toast.error('This skill name already exists');
      return;
    }

    try {
      setSubmitting(true);
      
      // Update the skill in the array
      const updatedSkills = skills.map(s => 
        s === editingSkill.oldName ? editingSkill.newName.trim() : s
      );
      
      // Update profile with modified skills array
      const { data } = await api.put('/users/profile', { skills: updatedSkills });
      
      // Update local state immediately from response
      const userData = data.data || data.user || data;
      setSkills(userData.skills || updatedSkills);
      setProfile(userData);
      
      toast.success('Skill updated successfully! 🎉');
      setShowEditModal(false);
      setEditingSkill(null);
    } catch (error: any) {
      console.error('Error updating skill:', error);
      toast.error(error.response?.data?.message || 'Failed to update skill');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSkill = async (skillName: string) => {
    if (!confirm(`Are you sure you want to delete "${skillName}"?`)) return;

    try {
      // Remove skill from array
      const updatedSkills = skills.filter(s => s !== skillName);
      
      // Update profile with reduced skills array
      const { data } = await api.put('/users/profile', { skills: updatedSkills });
      
      // Update local state immediately from response
      const userData = data.data || data.user || data;
      setSkills(userData.skills || updatedSkills);
      setProfile(userData);
      
      toast.success('Skill deleted successfully');
    } catch (error: any) {
      console.error('Error deleting skill:', error);
      toast.error(error.response?.data?.message || 'Failed to delete skill');
    }
  };

  const openEditModal = (skillName: string) => {
    setEditingSkill({ oldName: skillName, newName: skillName });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading skills...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Skills</h1>
        <p className="text-gray-600">Manage your professional skills</p>
        <svg width="150" height="12" className="mt-2">
          <path
            d="M 0 6 Q 20 2, 40 6 T 80 6 T 120 6 T 150 6"
            stroke="#000"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-500">Your Skills</h2>
            <p className="text-sm text-gray-600 mt-1">Total: {skills.length} skills</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <span>➕</span>
            Add New Skill
          </button>
        </div>

        {skills.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-500 text-lg mb-4">No skills added yet</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              Add Your First Skill
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200 group hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{skill}</h3>
                    <p className="text-xs text-gray-500">Professional Skill</p>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(skill)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                      title="Edit skill"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteSkill(skill)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete skill"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Add New Skill</h2>
            
            <form onSubmit={handleAddSkill}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., React, Python, Project Management"
                  required
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-2">
                  Enter a skill you want to showcase on your profile
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewSkillName('');
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Adding...' : 'Add Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Skill Modal */}
      {showEditModal && editingSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Edit Skill</h2>
            
            <form onSubmit={handleEditSkill}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingSkill.newName}
                  onChange={(e) => setEditingSkill({ ...editingSkill, newName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., React, Python, Project Management"
                  required
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingSkill(null);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}