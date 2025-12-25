const InterviewRequest = require('../models/interviewRequest.model');
const StudentSubmission = require('../models/studentSubmission.model');
const VideoInterview = require('../models/videoInterview.model');
const Assignment = require('../models/assignment.model');
const User = require('../models/user.model');
const crypto = require('crypto');
const { sendEmail } = require('../services/email.service');

/**
 * CAREER COACH CONTROLLER
 * All functionalities for career coaches
 */

// ==================== DASHBOARD ====================

/**
 * Get coach dashboard statistics
 */
async function getDashboard(req, res) {
  try {
    const coachId = req.user._id;
    
    // Get assigned students count
    const assignedStudents = await User.countDocuments({
      role: 'job_seeker',
      assignedCoach: coachId
    });
    
    // Get active interviews count
    const activeInterviews = await InterviewRequest.countDocuments({
      coach: coachId,
      status: { $in: ['pending', 'in-progress'] }
    });
    
    // Get pending submissions
    const pendingReviews = await StudentSubmission.countDocuments({
      coach: coachId,
      reviewStatus: 'pending'
    });
    
    // Get scheduled video calls
    const scheduledCalls = await VideoInterview.countDocuments({
      coach: coachId,
      status: 'scheduled',
      scheduledDate: { $gte: new Date() }
    });
    
    // Get assignments stats
    const activeAssignments = await Assignment.countDocuments({
      coach: coachId,
      status: 'published',
      dueDate: { $gte: new Date() }
    });
    
    // Recent submissions
    const recentSubmissions = await StudentSubmission.find({
      coach: coachId,
      reviewStatus: 'pending'
    })
    .populate('student', 'firstName lastName email')
    .populate('interviewRequest', 'title')
    .sort({ submittedAt: -1 })
    .limit(5);
    
    // Upcoming video interviews
    const upcomingInterviews = await VideoInterview.find({
      coach: coachId,
      status: 'scheduled',
      scheduledDate: { $gte: new Date() }
    })
    .populate('student', 'firstName lastName email')
    .sort({ scheduledDate: 1 })
    .limit(5);
    
    return res.json({
      success: true,
      data: {
        stats: {
          assignedStudents,
          activeInterviews,
          pendingReviews,
          scheduledCalls,
          activeAssignments
        },
        recentSubmissions,
        upcomingInterviews
      }
    });
    
  } catch (error) {
    console.error('❌ Get dashboard error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data'
    });
  }
}

// ==================== STUDENTS ====================

/**
 * Get assigned students
 */
async function getAssignedStudents(req, res) {
  try {
    const coachId = req.user._id;
    const { page = 1, limit = 20, search = '' } = req.query;
    
    const query = {
      role: 'job_seeker',
      assignedCoach: coachId
    };
    
    if (search) {
      query.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }
    
    const students = await User.find(query)
      .select('firstName lastName email phoneNumber skills location isPremium createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);
    
    return res.json({
      success: true,
      data: students,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('❌ Get students error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch students'
    });
  }
}

/**
 * Get student details
 */
async function getStudentDetails(req, res) {
  try {
    const { studentId } = req.params;
    const coachId = req.user._id;
    
    const student = await User.findOne({
      _id: studentId,
      assignedCoach: coachId,
      role: 'job_seeker'
    }).select('-password');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }
    
    // Get student's interview history
    const interviews = await InterviewRequest.find({
      student: studentId,
      coach: coachId
    }).sort({ createdAt: -1 });
    
    // Get submissions
    const submissions = await StudentSubmission.find({
      student: studentId,
      coach: coachId
    }).sort({ submittedAt: -1 });
    
    // Get assignments
    const assignments = await Assignment.find({
      'assignedTo.student': studentId,
      coach: coachId
    });
    
    return res.json({
      success: true,
      data: {
        student,
        interviews,
        submissions,
        assignments
      }
    });
    
  } catch (error) {
    console.error('❌ Get student details error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch student details'
    });
  }
}

// ==================== INTERVIEW REQUESTS ====================

/**
 * Create interview request
 */
async function createInterviewRequest(req, res) {
  try {
    const coachId = req.user._id;
    const {
      studentId,
      title,
      description,
      assessmentType,
      questions,
      timeLimit,
      expiryDays = 7
    } = req.body;
    
    // Validate student
    const student = await User.findOne({
      _id: studentId,
      role: 'job_seeker',
      assignedCoach: coachId
    });
    
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found or not assigned to you'
      });
    }
    
    // Generate unique access token
    const accessToken = crypto.randomBytes(32).toString('hex');
    
    // Set expiry date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);
    
    // Create interview request
    const interviewRequest = new InterviewRequest({
      coach: coachId,
      student: studentId,
      title,
      description,
      assessmentType,
      questions,
      timeLimit,
      accessToken,
      expiresAt
    });
    
    await interviewRequest.save();
    
    // Send email to student
    const assessmentLink = `${process.env.FRONTEND_URL}/user/interviews/${accessToken}`;
    
    try {
      await sendEmail({
        to: student.email,
        subject: `Interview Assessment - ${title}`,
        template: 'interview-request',
        data: {
          studentName: student.firstName,
          coachName: req.user.firstName,
          title,
          description,
          assessmentType,
          timeLimit,
          questionCount: questions.length,
          link: assessmentLink,
          expiryDate: expiresAt.toLocaleDateString()
        }
      });
      
      interviewRequest.emailSent = true;
      interviewRequest.emailSentAt = new Date();
      await interviewRequest.save();
      
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
    }
    
    return res.status(201).json({
      success: true,
      message: 'Interview request created and sent to student',
      data: interviewRequest
    });
    
  } catch (error) {
    console.error('❌ Create interview request error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create interview request'
    });
  }
}

/**
 * Get all interview requests
 */
async function getInterviewRequests(req, res) {
  try {
    const coachId = req.user._id;
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = { coach: coachId };
    if (status) query.status = status;
    
    const requests = await InterviewRequest.find(query)
      .populate('student', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await InterviewRequest.countDocuments(query);
    
    return res.json({
      success: true,
      data: requests,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('❌ Get interview requests error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch interview requests'
    });
  }
}

// ==================== SUBMISSIONS ====================

/**
 * Get submissions to review
 */
async function getSubmissions(req, res) {
  try {
    const coachId = req.user._id;
    const { reviewStatus = 'pending', page = 1, limit = 20 } = req.query;
    
    const query = { coach: coachId };
    if (reviewStatus) query.reviewStatus = reviewStatus;
    
    const submissions = await StudentSubmission.find(query)
      .populate('student', 'firstName lastName email')
      .populate('interviewRequest', 'title assessmentType')
      .sort({ submittedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await StudentSubmission.countDocuments(query);
    
    return res.json({
      success: true,
      data: submissions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('❌ Get submissions error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch submissions'
    });
  }
}

/**
 * Get single submission details
 */
async function getSubmissionDetails(req, res) {
  try {
    const { submissionId } = req.params;
    const coachId = req.user._id;
    
    const submission = await StudentSubmission.findOne({
      _id: submissionId,
      coach: coachId
    })
    .populate('student', 'firstName lastName email')
    .populate('interviewRequest');
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }
    
    return res.json({
      success: true,
      data: submission
    });
    
  } catch (error) {
    console.error('❌ Get submission details error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch submission details'
    });
  }
}

/**
 * Review submission (approve/reject)
 */
async function reviewSubmission(req, res) {
  try {
    const { submissionId } = req.params;
    const coachId = req.user._id;
    const { decision, feedback, writtenScores } = req.body;
    
    const submission = await StudentSubmission.findOne({
      _id: submissionId,
      coach: coachId
    }).populate('student', 'firstName lastName email');
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }
    
    // Update written question scores if provided
    if (writtenScores && Array.isArray(writtenScores)) {
      writtenScores.forEach(score => {
        const answer = submission.answers.id(score.answerId);
        if (answer && answer.questionType === 'written') {
          answer.coachScore = score.points;
          answer.coachNotes = score.notes;
          answer.pointsEarned = score.points;
        }
      });
      
      // Recalculate total
      submission.earnedPoints = submission.answers.reduce((sum, a) => sum + (a.pointsEarned || 0), 0);
      if (submission.totalPoints > 0) {
        submission.percentage = Math.round((submission.earnedPoints / submission.totalPoints) * 100);
      }
    }
    
    // Update review status
    submission.reviewStatus = decision; // 'approved' or 'rejected'
    submission.decision = decision === 'approved' ? 'schedule-video' : 'reject';
    submission.coachFeedback = feedback;
    submission.reviewedAt = new Date();
    submission.reviewedBy = coachId;
    
    await submission.save();
    
    // Send email to student
    try {
      const emailTemplate = decision === 'approved' ? 'assessment-approved' : 'assessment-rejected';
      
      await sendEmail({
        to: submission.student.email,
        subject: decision === 'approved' 
          ? 'Assessment Approved - Schedule Interview'
          : 'Assessment Result',
        template: emailTemplate,
        data: {
          studentName: submission.student.firstName,
          coachName: req.user.firstName,
          feedback,
          score: submission.percentage,
          mcqScore: submission.mcqScore
        }
      });
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
    }
    
    return res.json({
      success: true,
      message: `Submission ${decision}`,
      data: submission
    });
    
  } catch (error) {
    console.error('❌ Review submission error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to review submission'
    });
  }
}

// ==================== VIDEO INTERVIEWS ====================

/**
 * Schedule video interview
 */
async function scheduleVideoInterview(req, res) {
  try {
    const coachId = req.user._id;
    const {
      submissionId,
      scheduledDate,
      scheduledTime,
      duration = 30,
      notesForStudent
    } = req.body;
    
    // Validate submission
    const submission = await StudentSubmission.findOne({
      _id: submissionId,
      coach: coachId,
      reviewStatus: 'approved'
    }).populate('student', 'firstName lastName email');
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found or not approved'
      });
    }
    
    // Generate room ID
    const roomId = `interview_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
    const meetingLink = `${process.env.FRONTEND_URL}/interview/video/${roomId}`;
    
    // Create video interview
    const videoInterview = new VideoInterview({
      coach: coachId,
      student: submission.student._id,
      interviewRequest: submission.interviewRequest,
      submission: submissionId,
      scheduledDate,
      scheduledTime,
      duration,
      platform: 'daily',
      roomId,
      meetingLink,
      notesForStudent
    });
    
    await videoInterview.save();
    
    // Update submission
    submission.videoInterviewScheduled = true;
    submission.videoInterview = videoInterview._id;
    await submission.save();
    
    // Send email to student
    try {
      await sendEmail({
        to: submission.student.email,
        subject: 'Video Interview Scheduled',
        template: 'interview-scheduled',
        data: {
          studentName: submission.student.firstName,
          coachName: req.user.firstName,
          date: new Date(scheduledDate).toLocaleDateString(),
          time: scheduledTime,
          duration,
          meetingLink,
          notes: notesForStudent
        }
      });
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
    }
    
    return res.status(201).json({
      success: true,
      message: 'Video interview scheduled successfully',
      data: videoInterview
    });
    
  } catch (error) {
    console.error('❌ Schedule video interview error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to schedule video interview'
    });
  }
}

/**
 * Get scheduled video interviews
 */
async function getScheduledInterviews(req, res) {
  try {
    const coachId = req.user._id;
    const { status = 'scheduled', page = 1, limit = 20 } = req.query;
    
    const query = { coach: coachId };
    if (status) query.status = status;
    
    const interviews = await VideoInterview.find(query)
      .populate('student', 'firstName lastName email')
      .populate('submission', 'percentage mcqScore')
      .sort({ scheduledDate: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await VideoInterview.countDocuments(query);
    
    return res.json({
      success: true,
      data: interviews,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('❌ Get scheduled interviews error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch scheduled interviews'
    });
  }
}

/**
 * Update video interview
 */
async function updateVideoInterview(req, res) {
  try {
    const { interviewId } = req.params;
    const coachId = req.user._id;
    const updates = req.body;
    
    const interview = await VideoInterview.findOne({
      _id: interviewId,
      coach: coachId
    });
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found'
      });
    }
    
    // Update allowed fields
    const allowedUpdates = ['scheduledDate', 'scheduledTime', 'duration', 'notesForStudent', 'status', 'coachFeedback', 'result', 'resultNotes'];
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        interview[field] = updates[field];
      }
    });
    
    if (updates.status === 'completed') {
      interview.completedAt = new Date();
    }
    
    await interview.save();
    
    return res.json({
      success: true,
      message: 'Interview updated successfully',
      data: interview
    });
    
  } catch (error) {
    console.error('❌ Update video interview error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update interview'
    });
  }
}

/**
 * Cancel video interview
 */
async function cancelVideoInterview(req, res) {
  try {
    const { interviewId } = req.params;
    const coachId = req.user._id;
    const { reason } = req.body;
    
    const interview = await VideoInterview.findOne({
      _id: interviewId,
      coach: coachId
    }).populate('student', 'firstName lastName email');
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found'
      });
    }
    
    interview.status = 'cancelled';
    interview.cancelledBy = coachId;
    interview.cancellationReason = reason;
    interview.cancelledAt = new Date();
    
    await interview.save();
    
    // Send email to student
    try {
      await sendEmail({
        to: interview.student.email,
        subject: 'Interview Cancelled',
        template: 'interview-cancelled',
        data: {
          studentName: interview.student.firstName,
          coachName: req.user.firstName,
          reason
        }
      });
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
    }
    
    return res.json({
      success: true,
      message: 'Interview cancelled successfully',
      data: interview
    });
    
  } catch (error) {
    console.error('❌ Cancel video interview error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to cancel interview'
    });
  }
}

// ==================== ASSIGNMENTS ====================

/**
 * Create assignment
 */
async function createAssignment(req, res) {
  try {
    const coachId = req.user._id;
    const {
      title,
      description,
      type,
      difficulty,
      dueDate,
      points,
      studentIds,
      attachments,
      resourceLinks,
      allowLateSubmission,
      requiresFile
    } = req.body;
    
    // Create assignment
    const assignment = new Assignment({
      coach: coachId,
      title,
      description,
      type,
      difficulty,
      dueDate,
      points,
      attachments,
      resourceLinks,
      allowLateSubmission,
      requiresFile
    });
    
    // Assign to students
    if (studentIds && studentIds.length > 0) {
      assignment.assignedTo = studentIds.map(studentId => ({
        student: studentId,
        assignedAt: new Date(),
        status: 'assigned'
      }));
    }
    
    await assignment.save();
    
    // Send email to students
    const students = await User.find({ _id: { $in: studentIds } });
    
    for (const student of students) {
      try {
        await sendEmail({
          to: student.email,
          subject: `New Assignment: ${title}`,
          template: 'new-assignment',
          data: {
            studentName: student.firstName,
            coachName: req.user.firstName,
            title,
            description,
            dueDate: new Date(dueDate).toLocaleDateString(),
            points,
            link: `${process.env.FRONTEND_URL}/user/assignments/${assignment._id}`
          }
        });
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
      }
    }
    
    return res.status(201).json({
      success: true,
      message: 'Assignment created and sent to students',
      data: assignment
    });
    
  } catch (error) {
    console.error('❌ Create assignment error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create assignment'
    });
  }
}

/**
 * Get assignments
 */
async function getAssignments(req, res) {
  try {
    const coachId = req.user._id;
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = { coach: coachId, isDeleted: false };
    if (status) query.status = status;
    
    const assignments = await Assignment.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Assignment.countDocuments(query);
    
    return res.json({
      success: true,
      data: assignments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('❌ Get assignments error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch assignments'
    });
  }
}

/**
 * Get eligible students for assignment
 */
async function getEligibleStudents(req, res) {
  try {
    const coachId = req.user._id;
    
    const eligibleStudents = await Assignment.findEligibleStudents(coachId);
    
    return res.json({
      success: true,
      data: eligibleStudents
    });
    
  } catch (error) {
    console.error('❌ Get eligible students error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch eligible students'
    });
  }
}

/**
 * Review assignment submission
 */
async function reviewAssignmentSubmission(req, res) {
  try {
    const { assignmentId, studentId } = req.params;
    const coachId = req.user._id;
    const { grade, feedback } = req.body;
    
    const assignment = await Assignment.findOne({
      _id: assignmentId,
      coach: coachId
    });
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }
    
    const studentAssignment = assignment.assignedTo.find(
      a => a.student.toString() === studentId
    );
    
    if (!studentAssignment) {
      return res.status(404).json({
        success: false,
        error: 'Student assignment not found'
      });
    }
    
    studentAssignment.grade = grade;
    studentAssignment.feedback = feedback;
    studentAssignment.status = 'reviewed';
    studentAssignment.reviewedAt = new Date();
    
    await assignment.save();
    
    return res.json({
      success: true,
      message: 'Assignment reviewed successfully',
      data: assignment
    });
    
  } catch (error) {
    console.error('❌ Review assignment error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to review assignment'
    });
  }
}

module.exports = {
  getDashboard,
  getAssignedStudents,
  getStudentDetails,
  createInterviewRequest,
  getInterviewRequests,
  getSubmissions,
  getSubmissionDetails,
  reviewSubmission,
  scheduleVideoInterview,
  getScheduledInterviews,
  updateVideoInterview,
  cancelVideoInterview,
  createAssignment,
  getAssignments,
  getEligibleStudents,
  reviewAssignmentSubmission
};
