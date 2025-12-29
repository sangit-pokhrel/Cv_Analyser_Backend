'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';

export default function CoachStudents() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStudents();
  }, [search]);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get(`/coach/students?search=${search}`);
      setStudents(data.data);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Students</h1>
        <p className="text-gray-600">View and manage assigned students</p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          className="w-full max-w-md border border-gray-300 rounded-xl p-3"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <p className="text-gray-500">No students assigned</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map(student => (
            <div
              key={student._id}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-colors cursor-pointer"
              onClick={() => router.push(`/coach/students/${student._id}`)}
            >
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl">
                  {student.firstName[0]}{student.lastName[0]}
                </div>
                <h3 className="font-bold text-lg">{student.firstName} {student.lastName}</h3>
                <p className="text-sm text-gray-600">{student.email}</p>
              </div>

              <div className="space-y-2 text-sm">
                {student.phoneNumber && (
                  <div>📞 {student.phoneNumber}</div>
                )}
                {student.location && (
                  <div>📍 {student.location}</div>
                )}
                {student.isPremium && (
                  <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-center font-bold">
                    ⭐ Premium
                  </div>
                )}
              </div>

              <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 font-bold">
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
