'use client';

import { useState } from 'react';

export default function Settings() {
  const [fullName, setFullName] = useState('Sangit Kc');
  const [email, setEmail] = useState('sangitpokhrel0@gmail.com');
  const [phone, setPhone] = useState('9868618385');
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
        <p className="text-gray-600">Manage your profile and preferences</p>
        <svg width="280" height="12" className="mt-2">
          <path
            d="M 0 6 Q 20 2, 40 6 T 80 6 T 120 6 T 160 6 T 200 6 T 240 6 T 280 6"
            stroke="#000"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Profile Information</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold mb-6">Account Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
              <span>🔒</span>
              Change Password
            </button>
            <button className="w-full bg-orange-400 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-500 transition-colors flex items-center justify-center gap-2">
              <span>🔔</span>
              Notifications
            </button>
            <button className="w-full bg-orange-400 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-500 transition-colors flex items-center justify-center gap-2">
              <span>📊</span>
              Usage Statistics
            </button>
            <button className="w-full bg-red-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors mt-6">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}