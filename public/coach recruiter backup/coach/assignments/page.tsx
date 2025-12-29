'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/baseapi';
import { toast } from 'react-toastify';
import type { Assignment, Student } from '@/app/types/index';

export default function CoachAssignments() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [eligibleStudents, setEligibleStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const emptyForm: Omit<Assignment, '_id' | 'coach'> & { studentIds: string[] } = {
    title: '',
    description: '',
    type: 'project',
    difficulty: 'medium',
    dueDate: '',
    points: 10,
    students: [],
    status: 'draft',
    studentIds: [],
    mySubmission: undefined,
    myStatus: undefined,
  };

  const [formData, setFormData] = useState<typeof emptyForm>({
    ...emptyForm
  });

  useEffect(() => {
    fetchAssignments();
    fetchEligibleStudents();
  }, []);

  const fetchAssignments = async () => {
    try {
      const { data } = await api.get('/coach/assignments');
      setAssignments((data.data ?? []) as Assignment[]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchEligibleStudents = async () => {
    try {
      const { data } = await api.get('/coach/assignments/eligible-students');
      setEligibleStudents((data.data ?? []) as Student[]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load eligible students');
    }
  };

  const createAssignment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.studentIds.length === 0) {
      toast.error('Please select at least one student');
      return;
    }

    try {
      await api.post('/coach/assignments', formData);
      toast.success('Assignment created and sent to students!');
      setShowCreateModal(false);
      fetchAssignments();
      setFormData({ ...emptyForm });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create assignment');
    }
  };

  const toggleStudent = (studentId: string) => {
    setFormData(prev => ({
      ...prev,
      studentIds: prev.studentIds.includes(studentId)
        ? prev.studentIds.filter(id => id !== studentId)
        : [...prev.studentIds, studentId]
    }));
  };

  const safeDate = (date: string | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString();
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Assignments</h1>
            <p className="text-gray-600">Create and manage student assignments</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600"
          >
            + Create Assignment
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : assignments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl">
          <p className="text-gray-500">No assignments created yet</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600"
          >
            Create Your First Assignment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {assignments.map(assignment => (
            <div key={assignment._id} className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{assignment.title}</h3>
                  <p className="text-gray-600 mb-3">{assignment.description}</p>

                  <div className="flex items-center gap-4 text-sm">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full capitalize">
                      {assignment.type}
                    </span>
                    <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full capitalize">
                      {assignment.difficulty}
                    </span>
                    <span className="text-gray-600">
                      Due: {safeDate(assignment.dueDate)}
                    </span>
                    <span className="text-gray-600">
                      Points: {assignment.points}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <div className="text-sm text-gray-500">Assigned</div>
                  <div className="text-2xl font-bold">{assignment.students.length}</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl">
                  <div className="text-sm text-blue-500">Status</div>
                  <div className="text-2xl font-bold text-blue-600">{assignment.status}</div>
                </div>
                <div className="bg-green-50 p-3 rounded-xl">
                  <div className="text-sm text-green-500">Published</div>
                  <div className="text-2xl font-bold text-green-600">
                    {assignment.status === 'published' ? 'Yes' : 'No'}
                  </div>
                </div>
                <div className="bg-orange-50 p-3 rounded-xl">
                  <div className="text-sm text-orange-500">Points</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {assignment.points}
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push(`/coach/assignments/${assignment._id}`)}
                className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 font-bold"
              >
                View Submissions
              </button>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between">
              <h2 className="text-2xl font-bold">Create Assignment</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >✕</button>
            </div>

            <form onSubmit={createAssignment} className="p-6">
              <div className="mb-4">
                <label className="block font-bold mb-2">Title *</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-xl p-3"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block font-bold mb-2">Description *</label>
                <textarea
                  className="w-full border border-gray-300 rounded-xl p-3"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block font-bold mb-2">Assign to Students *</label>
                <div className="border border-gray-300 rounded-xl p-4 max-h-48 overflow-y-auto">
                  {eligibleStudents.map(student => (
                    <label key={student._id} className="flex items-center gap-2 mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.studentIds.includes(student._id)}
                        onChange={() => toggleStudent(student._id)}
                        className="w-4 h-4"
                      />
                      <span>{student.firstName} {student.lastName} ({student.email})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border-2 border-gray-300 py-3 rounded-xl font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600"
                >
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
