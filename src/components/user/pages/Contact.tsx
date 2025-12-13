// src/components/user/pages/ContactInquiries.tsx
'use client';

import { useState } from 'react';

interface ContactInquiry {
  id: number;
  contactId: string;
  message: string;
  date: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Closed';
}

export default function ContactInquiries() {
  const [searchContactId, setSearchContactId] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const inquiries: ContactInquiry[] = [
    {
      id: 1,
      contactId: 'TKT-001-A06',
      message: 'Analysis page is not getting loaded.',
      date: '2025-11-09 ( 11:03 AM )',
      priority: 'Low',
      status: 'Open',
    },
    {
      id: 2,
      contactId: 'TKT-001-A06',
      message: 'Analysis page is not getting loaded.',
      date: '2025-11-09 ( 11:03 AM )',
      priority: 'Low',
      status: 'Open',
    },
  ];

  const totalInquiries = 868;
  const resolved = 30;
  const pending = 90;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Contact Queries ({' '}
          <span className="text-orange-500">{totalInquiries}</span> |{' '}
          <span className="text-blue-500">{resolved}</span> |{' '}
          <span className="text-red-500">{pending}</span> )
        </h1>
        <p className="text-gray-600">View and track your contact queries.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter Contact Id"
              value={searchContactId}
              onChange={(e) => setSearchContactId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Select Date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              📅
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="p-4 bg-gray-50 rounded-xl flex items-center justify-between"
            >
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-2">{inquiry.message}</h4>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{inquiry.contactId}</span>
                  <span className="mx-2">•</span>
                  {inquiry.date}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium">
                  {inquiry.priority}
                </span>
                <span className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium">
                  {inquiry.status}
                </span>
                <button className="bg-orange-400 text-white px-6 py-2 rounded-xl font-medium hover:bg-orange-500 transition-colors">
                  Issue Details
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-2 mt-8">
          <button className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 transition-colors">
            Prev
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-100 text-gray-700 hover:bg-blue-200'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="px-4 py-2 bg-blue-100 text-gray-700 rounded-lg hover:bg-blue-200 transition-colors">
            Next
          </button>
        </div>
      </div>
    </>
  );
}