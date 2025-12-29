export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'job_seeker' | 'career_coach' | 'recruiter' | 'admin';
  phoneNumber?: string;
  location?: string;
  isPremium?: boolean;
  status?: 'active' | 'inactive' | 'blocked';
}

export interface Student extends User {
  assignedCoach?: string | Coach;
}

export interface Coach extends User {}

export interface DashboardStats {
  assignedStudents?: number;
  activeInterviews?: number;
  pendingReviews?: number;
  scheduledCalls?: number;
  activeAssignments?: number;
  totalJobs?: number;
  activeJobs?: number;
  closedJobs?: number;
  totalApplications?: number;
  pendingApplications?: number;
  interviewsScheduled?: number;
}

export interface Question {
  _id?: string;
  type: 'mcq' | 'written';
  question: string;
  options?: string[];
  correctAnswer?: string;
  expectedLength?: number;
  points: number;
}

export interface InterviewRequest {
  _id: string;
  coach: Coach;
  student: Student;
  title: string;
  description: string;
  assessmentType: 'mcq' | 'written' | 'both';
  questions: Question[];
  timeLimit: number;
  totalPoints: number;
  expiresAt: string;
  accessToken: string;
  status: string;
  createdAt: string;
}

export interface Submission {
  _id: string;
  interviewRequest: InterviewRequest;
  student: Student;
  answers: any[];
  mcqScore: number;
  writtenScore: number;
  totalScore: number;
  percentage: number;
  reviewStatus: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
}

export interface VideoInterview {
  _id: string;
  submission?: Submission;
  coach: Coach;
  student: Student;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  meetingLink?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notesForStudent?: string;
  result?: 'pass' | 'fail';
}

export interface Assignment {
  _id: string;
  coach: Coach;
  title: string;
  description: string;
  type: 'project' | 'task' | 'reading' | 'practice';
  difficulty: 'easy' | 'medium' | 'hard';
  dueDate: string;
  points: number;
  students: Student[];
  status: 'draft' | 'published';
}

export interface Job {
  _id: string;
  recruiter: User;
  companyName: string;
  title: string;
  description: string;
  requiredSkills: string[];
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
  minExperience?: number;
  maxExperience?: number;
  education: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
  workMode: 'onsite' | 'remote' | 'hybrid';
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  deadline?: string;
  status: 'active' | 'closed' | 'draft';
  applicationCount?: number;
  createdAt: string;
}

export interface Application {
  _id: string;
  job: Job;
  applicant: User;
  status: 'pending' | 'interview' | 'offered' | 'rejected' | 'shortlisted';
  coverLetter?: string;
  resumeUrl?: string;
  appliedAt: string;
  updatedAt: string;
}
