const InterviewRequest = require('../models/interviewRequest.model');
const StudentSubmission = require('../models/studentSubmission.model');
const VideoInterview = require('../models/videoInterview.model');
const Assignment = require('../models/assignment.model');
const User = require('../models/user.model');

/**
 * STUDENT/USER CONTROLLER  
 * Interview and assignment features for users (job_seekers)
 */

// ==================== INTERVIEWS ====================

/**
 * Get pending interview assessments
 */
async function getPendingInterviews(req, res) {
  try {
    const userId = req.user._id;
    
    const pendingInterviews = await InterviewRequest.find({
      student: userId,
      status: 'pending',
      tokenStatus: 'unused',
      expiresAt: { $gte: new Date() },
      isDeleted: false
    })
    .populate('coach', 'firstName lastName email')
    .sort({ createdAt: -1 });
    
    return res.json({
      success: true,
      data: pendingInterviews
    });
    
  } catch (error) {
    console.error('❌ Get pending interviews error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch pending interviews'
    });
  }
}

/**
 * Access interview assessment (ONE-TIME LINK)
 */
async function accessInterview(req, res) {
  try {
    const { token } = req.params;
    const userId = req.user._id;
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    const interview = await InterviewRequest.findOne({
      accessToken: token,
      student: userId,
      isDeleted: false
    }).populate('coach', 'firstName lastName');
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found or invalid token'
      });
    }
    
    // Check if token is valid
    if (!interview.isTokenValid()) {
      // Token already used, expired, or deleted
      let message = 'This assessment link has expired or is invalid.';
      
      if (interview.tokenStatus === 'active' || interview.tokenStatus === 'submitted') {
        message = 'This assessment has already been started or completed. Assessment links can only be opened once for security.';
      }
      
      return res.status(400).json({
        success: false,
        error: message,
        tokenStatus: interview.tokenStatus,
        openedAt: interview.openedAt
      });
    }
    
    // Log access attempt
    interview.accessAttempts += 1;
    
    // Mark token as used (first access)
    await interview.markTokenUsed(ipAddress);
    
    return res.json({
      success: true,
      message: 'Assessment accessed successfully',
      data: {
        interview: {
          _id: interview._id,
          title: interview.title,
          description: interview.description,
          assessmentType: interview.assessmentType,
          questions: interview.questions.map(q => ({
            _id: q._id,
            type: q.type,
            question: q.question,
            options: q.options, // For MCQ
            expectedLength: q.expectedLength // For written
            // Note: correctAnswer is NOT sent to client
          })),
          timeLimit: interview.timeLimit,
          totalPoints: interview.totalPoints,
          coach: interview.coach
        },
        startedAt: interview.openedAt
      }
    });
    
  } catch (error) {
    console.error('❌ Access interview error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to access interview'
    });
  }
}

/**
 * Submit interview assessment
 */
async function submitInterview(req, res) {
  try {
    const { interviewId } = req.params;
    const userId = req.user._id;
    const { answers } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    // Get interview request
    const interview = await InterviewRequest.findOne({
      _id: interviewId,
      student: userId,
      tokenStatus: 'active', // Must be in active state
      isDeleted: false
    });
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found or not accessible'
      });
    }
    
    // Check if already submitted
    const existingSubmission = await StudentSubmission.findOne({
      interviewRequest: interviewId,
      student: userId
    });
    
    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        error: 'Assessment already submitted'
      });
    }
    
    // Create submission
    const submission = new StudentSubmission({
      interviewRequest: interviewId,
      student: userId,
      coach: interview.coach,
      answers: answers.map(ans => ({
        questionId: ans.questionId,
        questionType: ans.questionType,
        answer: ans.answer
      })),
      totalPoints: interview.totalPoints,
      startedAt: interview.openedAt,
      submittedAt: new Date(),
      submittedFromIP: ipAddress
    });
    
    // Auto-grade MCQ questions
    submission.autoGradeMCQ(interview.questions);
    
    await submission.save();
    
    // Update interview request status
    interview.status = 'submitted';
    interview.tokenStatus = 'submitted';
    await interview.save();
    
    return res.json({
      success: true,
      message: 'Assessment submitted successfully',
      data: {
        submissionId: submission._id,
        mcqScore: submission.mcqScore,
        timeTaken: submission.timeTaken,
        message: 'Your coach will review your submission and contact you soon.'
      }
    });
    
  } catch (error) {
    console.error('❌ Submit interview error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to submit assessment'
    });
  }
}

/**
 * Get interview results/submissions
 */
async function getMySubmissions(req, res) {
  try {
    const userId = req.user._id;
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = { student: userId };
    if (status) {
      query.reviewStatus = status;
    }
    
    const submissions = await StudentSubmission.find(query)
      .populate('coach', 'firstName lastName email')
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
 * Get single submission result
 */
async function getSubmissionResult(req, res) {
  try {
    const { submissionId } = req.params;
    const userId = req.user._id;
    
    const submission = await StudentSubmission.findOne({
      _id: submissionId,
      student: userId
    })
    .populate('coach', 'firstName lastName')
    .populate('interviewRequest', 'title description assessmentType');
    
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
    console.error('❌ Get submission result error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch submission result'
    });
  }
}

// ==================== VIDEO INTERVIEWS ====================

/**
 * Get scheduled video interviews
 */
async function getScheduledInterviews(req, res) {
  try {
    const userId = req.user._id;
    const { status = 'scheduled', page = 1, limit = 20 } = req.query;
    
    const query = {
      student: userId
    };
    
    if (status) {
      query.status = status;
    }
    
    const interviews = await VideoInterview.find(query)
      .populate('coach', 'firstName lastName email')
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
 * Get video interview details & join link
 */
async function getVideoInterviewDetails(req, res) {
  try {
    const { interviewId } = req.params;
    const userId = req.user._id;
    
    const interview = await VideoInterview.findOne({
      _id: interviewId,
      student: userId
    })
    .populate('coach', 'firstName lastName email')
    .populate('submission', 'percentage mcqScore');
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found'
      });
    }
    
    return res.json({
      success: true,
      data: interview
    });
    
  } catch (error) {
    console.error('❌ Get video interview details error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch interview details'
    });
  }
}

/**
 * Join video interview
 */
async function joinVideoInterview(req, res) {
  try {
    const { interviewId } = req.params;
    const userId = req.user._id;
    
    const interview = await VideoInterview.findOne({
      _id: interviewId,
      student: userId,
      status: 'scheduled'
    });
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found or not accessible'
      });
    }
    
    // Check if interview time is close (within 15 minutes before)
    const now = new Date();
    const scheduledTime = interview.scheduledDateTime;
    const diff = scheduledTime - now;
    const minutesUntil = diff / (1000 * 60);
    
    if (minutesUntil > 15) {
      return res.status(400).json({
        success: false,
        error: `Interview starts in ${Math.round(minutesUntil)} minutes. You can join 15 minutes before.`
      });
    }
    
    // Mark student as joined
    if (!interview.studentJoinedAt) {
      interview.studentJoinedAt = new Date();
      interview.status = 'in-progress';
      await interview.save();
    }
    
    return res.json({
      success: true,
      data: {
        meetingLink: interview.meetingLink,
        roomId: interview.roomId,
        coach: interview.coach,
        joinedAt: interview.studentJoinedAt
      }
    });
    
  } catch (error) {
    console.error('❌ Join video interview error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to join interview'
    });
  }
}

/**
 * Submit interview feedback
 */
async function submitInterviewFeedback(req, res) {
  try {
    const { interviewId } = req.params;
    const userId = req.user._id;
    const { feedback, rating } = req.body;
    
    const interview = await VideoInterview.findOne({
      _id: interviewId,
      student: userId
    });
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found'
      });
    }
    
    interview.studentFeedback = feedback;
    if (rating) {
      interview.studentRating = rating;
    }
    
    await interview.save();
    
    return res.json({
      success: true,
      message: 'Feedback submitted successfully'
    });
    
  } catch (error) {
    console.error('❌ Submit feedback error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to submit feedback'
    });
  }
}

// ==================== ASSIGNMENTS ====================

/**
 * Get my assignments
 */
async function getMyAssignments(req, res) {
  try {
    const userId = req.user._id;
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = {
      'assignedTo.student': userId,
      isDeleted: false
    };
    
    if (status) {
      query['assignedTo.status'] = status;
    }
    
    const assignments = await Assignment.find(query)
      .populate('coach', 'firstName lastName email')
      .sort({ dueDate: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    // Filter to show only this student's assignment data
    const formattedAssignments = assignments.map(assignment => {
      const myAssignment = assignment.assignedTo.find(
        a => a.student.toString() === userId.toString()
      );
      
      return {
        ...assignment.toObject(),
        myStatus: myAssignment?.status,
        mySubmission: {
          submittedAt: myAssignment?.submittedAt,
          submissionText: myAssignment?.submissionText,
          submissionFiles: myAssignment?.submissionFiles,
          grade: myAssignment?.grade,
          feedback: myAssignment?.feedback
        }
      };
    });
    
    const total = await Assignment.countDocuments(query);
    
    return res.json({
      success: true,
      data: formattedAssignments,
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
 * Get assignment details
 */
async function getAssignmentDetails(req, res) {
  try {
    const { assignmentId } = req.params;
    const userId = req.user._id;
    
    const assignment = await Assignment.findOne({
      _id: assignmentId,
      'assignedTo.student': userId,
      isDeleted: false
    }).populate('coach', 'firstName lastName email');
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }
    
    const myAssignment = assignment.assignedTo.find(
      a => a.student.toString() === userId.toString()
    );
    
    return res.json({
      success: true,
      data: {
        ...assignment.toObject(),
        mySubmission: myAssignment
      }
    });
    
  } catch (error) {
    console.error('❌ Get assignment details error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch assignment details'
    });
  }
}

/**
 * Submit assignment
 */
async function submitAssignment(req, res) {
  try {
    const { assignmentId } = req.params;
    const userId = req.user._id;
    const { submissionText, submissionFiles } = req.body;
    
    const assignment = await Assignment.findOne({
      _id: assignmentId,
      'assignedTo.student': userId,
      isDeleted: false
    });
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }
    
    // Find student's assignment
    const studentAssignment = assignment.assignedTo.find(
      a => a.student.toString() === userId.toString()
    );
    
    if (!studentAssignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not assigned to you'
      });
    }
    
    // Check if already submitted
    if (studentAssignment.status === 'submitted' || studentAssignment.status === 'reviewed') {
      return res.status(400).json({
        success: false,
        error: 'Assignment already submitted'
      });
    }
    
    // Check deadline
    if (!assignment.allowLateSubmission && new Date() > assignment.dueDate) {
      return res.status(400).json({
        success: false,
        error: 'Submission deadline has passed'
      });
    }
    
    // Update submission
    studentAssignment.status = 'submitted';
    studentAssignment.submittedAt = new Date();
    studentAssignment.submissionText = submissionText;
    studentAssignment.submissionFiles = submissionFiles || [];
    
    await assignment.save();
    
    return res.json({
      success: true,
      message: 'Assignment submitted successfully',
      data: studentAssignment
    });
    
  } catch (error) {
    console.error('❌ Submit assignment error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to submit assignment'
    });
  }
}

module.exports = {
  // Interviews
  getPendingInterviews,
  accessInterview,
  submitInterview,
  getMySubmissions,
  getSubmissionResult,
  
  // Video Interviews
  getScheduledInterviews,
  getVideoInterviewDetails,
  joinVideoInterview,
  submitInterviewFeedback,
  
  // Assignments
  getMyAssignments,
  getAssignmentDetails,
  submitAssignment
};
