'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function CoachSettings() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    bio: ''
  });

  const handleSave = async () => {
    toast.success('Settings saved!');
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-gray-600">Manage your account settings</p>
      </div>

      <div className="bg-white rounded-2xl p-8 border">
        <h3 className="text-lg font-bold mb-4">Profile Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block font-bold mb-2">First Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl p-3"
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            />
          </div>
          <div>
            <label className="block font-bold mb-2">Last Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl p-3"
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            />
          </div>
          <div>
            <label className="block font-bold mb-2">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-xl p-3"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block font-bold mb-2">Phone Number</label>
            <input
              type="tel"
              className="w-full border border-gray-300 rounded-xl p-3"
              value={profile.phoneNumber}
              onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block font-bold mb-2">Bio</label>
          <textarea
            className="w-full border border-gray-300 rounded-xl p-3"
            rows="4"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600"
        >
          Save Changes
        </button>
      </div>
    </>
  );
}
