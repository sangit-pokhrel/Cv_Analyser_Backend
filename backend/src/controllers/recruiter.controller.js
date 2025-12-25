const Job = require('../models/job.model');
const User = require('../models/user.model');
const JobApplication = require('../models/jobApplication.model');
const mongoose = require('mongoose');

/**
 * RECRUITER CONTROLLER
 * Job posting and application management for recruiters
 */

// ==================== DASHBOARD ====================

/**
 * Get recruiter dashboard statistics
 */
async function getDashboard(req, res) {
  try {
    const recruiterId = req.user._id;
    
    // Total jobs posted
    const totalJobs = await Job.countDocuments({
      postedBy: recruiterId,
      isDeleted: false
    });
    
    // Active jobs
    const activeJobs = await Job.countDocuments({
      postedBy: recruiterId,
      status: 'active',
      isDeleted: false
    });
    
    // Total applications
    const jobs = await Job.find({ postedBy: recruiterId }).select('_id');
    const jobIds = jobs.map(j => j._id);
    
    const totalApplications = await JobApplication.countDocuments({
      job: { $in: jobIds }
    });
    
    // Pending applications
    const pendingApplications = await JobApplication.countDocuments({
      job: { $in: jobIds },
      status: 'pending'
    });
    
    // Interviews scheduled
    const interviewsScheduled = await JobApplication.countDocuments({
      job: { $in: jobIds },
      status: 'interview'
    });
    
    // Recent applications
    const recentApplications = await JobApplication.find({
      job: { $in: jobIds }
    })
    .populate('applicant', 'firstName lastName email')
    .populate('job', 'title')
    .sort({ appliedAt: -1 })
    .limit(10);
    
    // Jobs stats
    const jobsStats = await Job.aggregate([
      {
        $match: {
          postedBy: new mongoose.Types.ObjectId(recruiterId),
          isDeleted: false
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    return res.json({
      success: true,
      data: {
        stats: {
          totalJobs,
          activeJobs,
          totalApplications,
          pendingApplications,
          interviewsScheduled
        },
        jobsStats,
        recentApplications
      }
    });
    
  } catch (error) {
    console.error('❌ Get recruiter dashboard error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data'
    });
  }
}

// ==================== JOB POSTING ====================

/**
 * Create job posting
 */
async function createJob(req, res) {
  try {
    const recruiterId = req.user._id;
    const {
      companyName,
      companyLogo,
      companyWebsite,
      title,
      description,
      requiredSkills,
      experienceLevel,
      minExperience,
      maxExperience,
      education,
      jobType,
      workMode,
      location,
      salaryMin,
      salaryMax,
      salaryCurrency,
      deadline,
      maxApplicants,
      benefits,
      responsibilities,
      contactEmail,
      contactPhone,
      isPublic,
      isFeatured
    } = req.body;
    
    // Validation
    if (!title || !description || !companyName || !location || !experienceLevel || !jobType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    // Create job
    const job = new Job({
      postedBy: recruiterId,
      companyName,
      companyLogo,
      companyWebsite,
      title,
      description,
      requiredSkills,
      experienceLevel,
      minExperience,
      maxExperience,
      education,
      jobType,
      workMode,
      location,
      salaryMin,
      salaryMax,
      salaryCurrency,
      deadline,
      maxApplicants,
      benefits,
      responsibilities,
      contactEmail: contactEmail || req.user.email,
      contactPhone,
      isPublic: isPublic !== undefined ? isPublic : true,
      isFeatured: isFeatured || false,
      status: 'active'
    });
    
    await job.save();
    
    return res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      data: job
    });
    
  } catch (error) {
    console.error('❌ Create job error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create job'
    });
  }
}

/**
 * Get all jobs posted by recruiter
 */
async function getMyJobs(req, res) {
  try {
    const recruiterId = req.user._id;
    const { status, page = 1, limit = 20, search = '' } = req.query;
    
    const query = {
      postedBy: recruiterId,
      isDeleted: false
    };
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { companyName: new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') }
      ];
    }
    
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Job.countDocuments(query);
    
    // Add application count to each job
    const jobsWithStats = await Promise.all(jobs.map(async (job) => {
      const applicationCount = await JobApplication.countDocuments({ job: job._id });
      return {
        ...job.toObject(),
        applicationCount
      };
    }));
    
    return res.json({
      success: true,
      data: jobsWithStats,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('❌ Get jobs error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch jobs'
    });
  }
}

/**
 * Get single job details
 */
async function getJobDetails(req, res) {
  try {
    const { jobId } = req.params;
    const recruiterId = req.user._id;
    
    const job = await Job.findOne({
      _id: jobId,
      postedBy: recruiterId,
      isDeleted: false
    });
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }
    
    // Get applications for this job
    const applications = await JobApplication.find({ job: jobId })
      .populate('applicant', 'firstName lastName email phoneNumber skills')
      .sort({ appliedAt: -1 });
    
    return res.json({
      success: true,
      data: {
        job,
        applications
      }
    });
    
  } catch (error) {
    console.error('❌ Get job details error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch job details'
    });
  }
}

/**
 * Update job
 */
async function updateJob(req, res) {
  try {
    const { jobId } = req.params;
    const recruiterId = req.user._id;
    const updates = req.body;
    
    const job = await Job.findOne({
      _id: jobId,
      postedBy: recruiterId,
      isDeleted: false
    });
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }
    
    // Update allowed fields
    const allowedFields = [
      'title', 'description', 'requiredSkills', 'experienceLevel',
      'minExperience', 'maxExperience', 'education', 'jobType',
      'workMode', 'location', 'salaryMin', 'salaryMax', 'deadline',
      'maxApplicants', 'benefits', 'responsibilities', 'contactEmail',
      'contactPhone', 'status', 'isPublic', 'isFeatured'
    ];
    
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        job[field] = updates[field];
      }
    });
    
    await job.save();
    
    return res.json({
      success: true,
      message: 'Job updated successfully',
      data: job
    });
    
  } catch (error) {
    console.error('❌ Update job error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update job'
    });
  }
}

/**
 * Delete job (soft delete)
 */
async function deleteJob(req, res) {
  try {
    const { jobId } = req.params;
    const recruiterId = req.user._id;
    
    const job = await Job.findOne({
      _id: jobId,
      postedBy: recruiterId
    });
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }
    
    job.isDeleted = true;
    job.status = 'closed';
    await job.save();
    
    return res.json({
      success: true,
      message: 'Job deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ Delete job error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete job'
    });
  }
}

/**
 * Close job (stop accepting applications)
 */
async function closeJob(req, res) {
  try {
    const { jobId } = req.params;
    const recruiterId = req.user._id;
    
    const job = await Job.findOne({
      _id: jobId,
      postedBy: recruiterId,
      isDeleted: false
    });
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }
    
    job.status = 'closed';
    await job.save();
    
    return res.json({
      success: true,
      message: 'Job closed successfully',
      data: job
    });
    
  } catch (error) {
    console.error('❌ Close job error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to close job'
    });
  }
}

// ==================== APPLICATION TRACKING ====================

/**
 * Get applications for a specific job
 */
async function getJobApplications(req, res) {
  try {
    const { jobId } = req.params;
    const recruiterId = req.user._id;
    const { status, page = 1, limit = 20 } = req.query;
    
    // Verify job belongs to recruiter
    const job = await Job.findOne({
      _id: jobId,
      postedBy: recruiterId,
      isDeleted: false
    });
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }
    
    const query = { job: jobId };
    if (status) {
      query.status = status;
    }
    
    const applications = await JobApplication.find(query)
      .populate('applicant', 'firstName lastName email phoneNumber skills location resumeUrl')
      .populate('job', 'title')
      .sort({ appliedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await JobApplication.countDocuments(query);
    
    return res.json({
      success: true,
      data: applications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('❌ Get job applications error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch applications'
    });
  }
}

/**
 * Get all applications across all jobs
 */
async function getAllApplications(req, res) {
  try {
    const recruiterId = req.user._id;
    const { status, page = 1, limit = 20, jobId } = req.query;
    
    // Get all jobs by this recruiter
    const jobs = await Job.find({
      postedBy: recruiterId,
      isDeleted: false
    }).select('_id');
    
    const jobIds = jobs.map(j => j._id);
    
    const query = { job: { $in: jobIds } };
    if (status) {
      query.status = status;
    }
    if (jobId) {
      query.job = jobId;
    }
    
    const applications = await JobApplication.find(query)
      .populate('applicant', 'firstName lastName email phoneNumber skills')
      .populate('job', 'title companyName')
      .sort({ appliedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await JobApplication.countDocuments(query);
    
    return res.json({
      success: true,
      data: applications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('❌ Get all applications error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch applications'
    });
  }
}

/**
 * Get single application details
 */
async function getApplicationDetails(req, res) {
  try {
    const { applicationId } = req.params;
    const recruiterId = req.user._id;
    
    const application = await JobApplication.findById(applicationId)
      .populate('applicant', '-password')
      .populate('job');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    // Verify job belongs to recruiter
    if (application.job.postedBy.toString() !== recruiterId.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized access'
      });
    }
    
    return res.json({
      success: true,
      data: application
    });
    
  } catch (error) {
    console.error('❌ Get application details error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch application details'
    });
  }
}

/**
 * Update application status
 */
async function updateApplicationStatus(req, res) {
  try {
    const { applicationId } = req.params;
    const recruiterId = req.user._id;
    const { status, notes, interviewDate, interviewTime } = req.body;
    
    const application = await JobApplication.findById(applicationId)
      .populate('job')
      .populate('applicant', 'firstName lastName email');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }
    
    // Verify job belongs to recruiter
    if (application.job.postedBy.toString() !== recruiterId.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized access'
      });
    }
    
    // Update status
    application.status = status;
    
    if (status === 'interview' && interviewDate && interviewTime) {
      application.interviewScheduled = true;
      application.interviewDate = interviewDate;
      application.interviewTime = interviewTime;
    }
    
    if (status === 'rejected' || status === 'offered') {
      application.reviewedAt = new Date();
      application.reviewedBy = recruiterId;
    }
    
    if (notes) {
      application.recruiterNotes = notes;
    }
    
    await application.save();
    
    // TODO: Send email notification to applicant
    
    return res.json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });
    
  } catch (error) {
    console.error('❌ Update application status error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update application status'
    });
  }
}

/**
 * Bulk update application status
 */
async function bulkUpdateApplications(req, res) {
  try {
    const recruiterId = req.user._id;
    const { applicationIds, status, notes } = req.body;
    
    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid application IDs'
      });
    }
    
    // Get all applications
    const applications = await JobApplication.find({
      _id: { $in: applicationIds }
    }).populate('job');
    
    // Verify all jobs belong to recruiter
    for (const app of applications) {
      if (app.job.postedBy.toString() !== recruiterId.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Unauthorized access to one or more applications'
        });
      }
    }
    
    // Update all
    await JobApplication.updateMany(
      { _id: { $in: applicationIds } },
      {
        $set: {
          status,
          recruiterNotes: notes,
          reviewedAt: new Date(),
          reviewedBy: recruiterId
        }
      }
    );
    
    return res.json({
      success: true,
      message: `${applicationIds.length} applications updated successfully`
    });
    
  } catch (error) {
    console.error('❌ Bulk update error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update applications'
    });
  }
}

module.exports = {
  getDashboard,
  createJob,
  getMyJobs,
  getJobDetails,
  updateJob,
  deleteJob,
  closeJob,
  getJobApplications,
  getAllApplications,
  getApplicationDetails,
  updateApplicationStatus,
  bulkUpdateApplications
};
