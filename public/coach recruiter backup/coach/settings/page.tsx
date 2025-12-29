'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import api from '@/lib/baseapi';
import type { User } from '@/app/types/index';

export default function CoachSettings() {
  const router = useRouter();
  const [profile, setProfile] = useState<Omit<User, '_id' | 'role'>>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    location: '',
    isPremium: false,
  });

  const handleSave = async (): Promise<void> => {
    try {
      setLoading(true);
      const { data } = await api.put('/coach/settings/profile', profile);

      if (data?.success) {
        toast.success('Settings saved successfully!');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Something went wrong while saving');
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-gray-600">Manage your account settings</p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold mb-4">Profile Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-bold mb-2">First Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl p-3"
              value={profile.firstName}
              onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
            />
          </div>

          <div>
            <label className="block font-bold mb-2">Last Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl p-3"
              value={profile.lastName}
              onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
            />
          </div>

          <div>
            <label className="block font-bold mb-2">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-xl p-3"
              value={profile.email}
              onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div>
            <label className="block font-bold mb-2">Phone Number</label>
            <input
              type="tel"
              className="w-full border border-gray-300 rounded-xl p-3"
              value={profile.phoneNumber}
              onChange={(e) => setProfile(prev => ({ ...prev, phoneNumber: e.target.value }))}
            />
          </div>

          <div>
            <label className="block font-bold mb-2">Location</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl p-3"
              value={profile.location ?? ''}
              onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </>
  );
}
