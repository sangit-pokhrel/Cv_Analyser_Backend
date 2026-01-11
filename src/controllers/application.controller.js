// const JobApplication = require('../models/jobApplication.model');
// const Job = require('../models/job.model');
// const JobMatch = require('../models/jobMatch.model');

// // Submit Application (handles both internal and external)
// async function submitApplication(req, res) {
//   try {
//     const jobId = req.body.jobId || req.params.jobId;
//     const job = await Job.findById(jobId);
    
//     if (!job || job.status !== 'active') {
//       return res.status(404).json({ error: 'Job not available' });
//     }

//     // Check if already applied
//     const existing = await JobApplication.findOne({ 
//       user: req.user._id, 
//       job: jobId 
//     });
    
//     if (existing) {
//       return res.status(400).json({ error: 'Already applied to this job' });
//     }

//     let application;

//     // Handle based on application method
//     if (job.applicationMethod === 'external_redirect') {
//       // External job - just track the click/interest
//       application = await JobApplication.create({
//         user: req.user._id,
//         job: jobId,
//         applicationType: 'external_redirect',
//         externalClickedAt: new Date(),
//         externalStatus: 'clicked'
//       });

//       // Increment external click count
//       job.externalClickCount = (job.externalClickCount || 0) + 1;
//       await job.save();

//       // Update job match status if exists
//       await JobMatch.updateOne(
//         { user: req.user._id, job: jobId },
//         { status: 'applied' }
//       );

//       return res.status(201).json({ 
//         application,
//         redirect: true,
//         externalUrl: job.externalUrl,
//         message: 'Application tracked. You will be redirected to apply externally.'
//       });

//     } else {
//       // Internal job - full application
//       application = await JobApplication.create({
//         user: req.user._id,
//         job: jobId,
//         applicationType: 'internal',
//         coverLetter: req.body.coverLetter,
//         resumeUrl: req.body.resumeUrl || req.user.resumeUrl,
//         status: 'pending'
//       });

//       // Increment application count
//       job.applicationCount = (job.applicationCount || 0) + 1;
//       await job.save();

//       // Update job match status if exists
//       await JobMatch.updateOne(
//         { user: req.user._id, job: jobId },
//         { status: 'applied' }
//       );

//       return res.status(201).json({ 
//         application,
//         redirect: false,
//         message: 'Application submitted successfully'
//       });
//     }

//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: 'Failed to submit application' });
//   }
// }

// // List user's applications
// async function listUserApplications(req, res) {
//   try {
//     const { page = 1, limit = 20, status, applicationType } = req.query;

//     const query = { user: req.user._id };
//     if (status) query.status = status;
//     if (applicationType) query.applicationType = applicationType;

//     const skip = (page - 1) * limit;
    
//     const apps = await JobApplication.find(query)
//       .populate('job')
//       .sort({ appliedDate: -1 })
//       .skip(skip)
//       .limit(Number(limit));

//     const total = await JobApplication.countDocuments(query);

//     return res.json({ 
//       meta: {
//         total,
//         page: Number(page),
//         pages: Math.ceil(total / limit)
//       },
//       data: apps 
//     });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: 'Failed to list applications' });
//   }
// }

// // Get single application


// async function getApplication(req, res) {
//   try {
//     const requestedId = req.params.id;
    
//     // --- FIX IMPLEMENTED HERE ---
    
//     // 1. Check if the user is requesting their list of applications (e.g., via /applications/my-applications)
//     if (requestedId === 'my-applications') {
        
//         // Find all applications belonging to the current user (req.user._id)
//         const userApplications = await JobApplication.find({ user: req.user._id })
//             .populate('job user')
//             .sort({ createdAt: -1 }); // Optional: sort by newest first

//         // Return the list of applications
//         return res.json({ applications: userApplications });
//     }
    
//     // --- END OF FIX ---
    
//     // 2. If it's not the special string, treat it as a request for a single application ID.
//     const app = await JobApplication.findById(requestedId) // Use the standard findById
//       .populate('job user');
    
//     if (!app) return res.status(404).json({ error: 'Application not found' });

//     // Authorization: applicant, job owner, or admin
//     // NOTE: This authorization check must be slightly adjusted to compare IDs correctly.
//     const isApplicant = app.user._id.toString() === req.user._id.toString();
    
//     let isJobOwner = false;
//     // Check if user is the job creator (owner)
//     if (!isApplicant) {
//       // Since 'app' is populated with 'job', we can check job.createdBy directly
//       // Assuming Job model has a 'createdBy' field
//       if (app.job && app.job.createdBy && app.job.createdBy.toString() === req.user._id.toString()) {
//          isJobOwner = true;
//       }
//     }
    
//     const isAdmin = req.user.role === 'admin';
    
//     if (!isApplicant && !isJobOwner && !isAdmin) {
//       return res.status(403).json({ error: 'Forbidden' });
//     }

//     return res.json({ application: app });
//   } catch (e) {
//     // A CastError for an invalid ObjectId will now fall here, 
//     // but the 'my-applications' error is prevented.
//     console.error("Error fetching application:", e);
    
//     // You can check if the error is specifically a CastError and return 400 (Bad Request)
//     if (e.name === 'CastError' && e.kind === 'ObjectId') {
//         return res.status(400).json({ error: 'Invalid application ID format' });
//     }
    
//     return res.status(500).json({ error: 'Failed to fetch application' });
//   }
// }
// // async function getApplication(req, res) {
// //   try {
// //     const app = await JobApplication.findById(req.params.id)
// //       .populate('job user');
    
// //     if (!app) return res.status(404).json({ error: 'Application not found' });

// //     // Authorization: applicant, job owner, or admin
// //     if (app.user._id.toString() !== req.user._id.toString()) {
// //       const job = await Job.findById(app.job._id);
// //       if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
// //         return res.status(403).json({ error: 'Forbidden' });
// //       }
// //     }

// //     return res.json({ application: app });
// //   } catch (e) {
// //     console.error(e);
// //     return res.status(500).json({ error: 'Failed to fetch application' });
// //   }
// // }

// // Withdraw application (only for internal applications)
// async function withdrawApplication(req, res) {
//   try {
//     const app = await JobApplication.findById(req.params.id);
    
//     if (!app) return res.status(404).json({ error: 'Application not found' });
    
//     if (app.user.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ error: 'Forbidden' });
//     }

//     if (app.applicationType === 'external_redirect') {
//       return res.status(400).json({ 
//         error: 'Cannot withdraw external applications. Please contact the employer directly.' 
//       });
//     }

//     // Update job match status back to viewed
//     await JobMatch.updateOne(
//       { user: req.user._id, job: app.job },
//       { status: 'viewed' }
//     );

//     await app.deleteOne();
    
//     return res.json({ message: 'Application withdrawn successfully' });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: 'Failed to withdraw application' });
//   }
// }

// // Update application status (Admin/Employer only)
// async function updateApplicationStatus(req, res) {
//   try {
//     const { status, notes } = req.body;
    
//     const app = await JobApplication.findById(req.params.id).populate('job');
    
//     if (!app) return res.status(404).json({ error: 'Application not found' });

//     // Only job creator or admin can update
//     const job = await Job.findById(app.job._id);
//     if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Forbidden' });
//     }

//     if (app.applicationType === 'external_redirect') {
//       return res.status(400).json({ 
//         error: 'Cannot update status of external applications' 
//       });
//     }

//     if (status) app.status = status;
//     if (notes !== undefined) app.notes = notes;
    
//     if (status && status !== 'pending') {
//       app.reviewedDate = new Date();
//     }

//     await app.save();

//     return res.json({ 
//       application: app,
//       message: 'Application status updated successfully'
//     });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: 'Failed to update application' });
//   }
// }

// // List applications for a specific job (Employer/Admin)
// async function listJobApplications(req, res) {
//   try {
//     const { jobId } = req.params;
//     const { page = 1, limit = 20, status } = req.query;

//     const job = await Job.findById(jobId);
//     if (!job) return res.status(404).json({ error: 'Job not found' });

//     // Only job creator or admin can view applications
//     if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Forbidden' });
//     }

//     const query = { 
//       job: jobId,
//       applicationType: 'internal' // Only show internal applications to employers
//     };
    
//     if (status) query.status = status;

//     const skip = (page - 1) * limit;

//     const apps = await JobApplication.find(query)
//       .populate('user', '-password')
//       .sort({ appliedDate: -1 })
//       .skip(skip)
//       .limit(Number(limit));

//     const total = await JobApplication.countDocuments(query);

//     return res.json({
//       meta: {
//         total,
//         page: Number(page),
//         pages: Math.ceil(total / limit)
//       },
//       data: apps
//     });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: 'Failed to list job applications' });
//   }
// }

// module.exports = { 
//   submitApplication, 
//   listUserApplications, 
//   getApplication, 
//   withdrawApplication,
//   updateApplicationStatus,
//   listJobApplications
// };


const JobApplication = require('../models/jobApplication.model');
const Job = require('../models/job.model');
const JobMatch = require('../models/jobMatch.model');
const mongoose = require('mongoose');

// Submit Application (handles both internal and external)
async function submitApplication(req, res) {
  try {
    const jobId = req.body.jobId || req.params.jobId;
    const job = await Job.findById(jobId);
    
    if (!job || job.status !== 'active') {
      return res.status(404).json({ error: 'Job not available' });
    }

    // Check if already applied
    const existing = await JobApplication.findOne({ 
      user: req.user._id, 
      job: jobId 
    });
    
    if (existing) {
      return res.status(400).json({ 
        error: 'Already applied',
        message: 'You have already applied to this job'
      });
    }

    let application;

    // Handle based on application method
    if (job.applicationMethod === 'external_redirect') {
      // External job - just track the click/interest
      application = await JobApplication.create({
        user: req.user._id,
        job: jobId,
        applicationType: 'external_redirect',
        externalClickedAt: new Date(),
        externalStatus: 'clicked'
      });

      // Increment external click count
      job.externalClickCount = (job.externalClickCount || 0) + 1;
      await job.save();

      // Update job match status if exists
      await JobMatch.updateOne(
        { user: req.user._id, job: jobId },
        { status: 'applied' }
      );

      return res.status(201).json({ 
        success: true,
        application,
        redirect: true,
        externalUrl: job.externalUrl,
        message: 'Application tracked. You will be redirected to apply externally.'
      });

    } else {
      // Internal job - full application
      application = await JobApplication.create({
        user: req.user._id,
        job: jobId,
        applicationType: 'internal',
        coverLetter: req.body.coverLetter,
        resumeUrl: req.body.resumeUrl || req.user.resumeUrl,
        status: 'pending'
      });

      // Increment application count
      job.applicationCount = (job.applicationCount || 0) + 1;
      await job.save();

      // Update job match status if exists
      await JobMatch.updateOne(
        { user: req.user._id, job: jobId },
        { status: 'applied' }
      );

      return res.status(201).json({ 
        success: true,
        application,
        redirect: false,
        message: 'Application submitted successfully'
      });
    }

  } catch (e) {
    console.error('Submit application error:', e);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to submit application' 
    });
  }
}

// List user's applications
async function listUserApplications(req, res) {
  try {
    const { page = 1, limit = 20, status, applicationType } = req.query;

    const query = { user: req.user._id };
    if (status) query.status = status;
    if (applicationType) query.applicationType = applicationType;

    const skip = (page - 1) * limit;
    
    const apps = await JobApplication.find(query)
      .populate('job')
      .sort({ appliedDate: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await JobApplication.countDocuments(query);

    return res.json({ 
      success: true,
      meta: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      },
      data: apps 
    });
  } catch (e) {
    console.error('List applications error:', e);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to list applications' 
    });
  }
}

// Get single application
async function getApplication(req, res) {
  try {
    const app = await JobApplication.findById(req.params.id)
      .populate('job user');
    
    if (!app) {
      return res.status(404).json({ 
        success: false,
        error: 'Application not found' 
      });
    }

    // Authorization: applicant, job owner, or admin
    if (app.user._id.toString() !== req.user._id.toString()) {
      const job = await Job.findById(app.job._id);
      if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false,
          error: 'Forbidden' 
        });
      }
    }

    return res.json({ 
      success: true,
      application: app 
    });
  } catch (e) {
    console.error('Get application error:', e);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to fetch application' 
    });
  }
}

// Withdraw application - FIXED: Only allow if status is 'pending'
async function withdrawApplication(req, res) {
  try {
    const app = await JobApplication.findById(req.params.id).populate('job');
    
    if (!app) {
      return res.status(404).json({ 
        success: false,
        error: 'Application not found' 
      });
    }
    
    if (app.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false,
        error: 'Forbidden' 
      });
    }

    // Check application type
    if (app.applicationType === 'external_redirect') {
      return res.status(400).json({ 
        success: false,
        error: 'Cannot withdraw external applications',
        message: 'Please contact the employer directly to withdraw your application.' 
      });
    }

    // FIXED: Only allow withdrawal if status is 'pending'
    if (app.status !== 'pending') {
      return res.status(400).json({ 
        success: false,
        error: 'Cannot withdraw application',
        message: `Your application is currently "${app.status}". Please contact the employer directly to withdraw.`
      });
    }

    // Update job match status back to viewed
    await JobMatch.updateOne(
      { user: req.user._id, job: app.job._id },
      { status: 'viewed' }
    );

    // Decrement application count
    await Job.findByIdAndUpdate(app.job._id, {
      $inc: { applicationCount: -1 }
    });

    await app.deleteOne();
    
    return res.json({ 
      success: true,
      message: 'Application withdrawn successfully' 
    });
  } catch (e) {
    console.error('Withdraw application error:', e);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to withdraw application' 
    });
  }
}

// Update application status (Employer/Admin only)
async function updateApplicationStatus(req, res) {
  try {
    const { status, notes } = req.body;
    
    if (!status) {
      return res.status(400).json({ 
        success: false,
        error: 'Status is required',
        validStatuses: ['pending', 'under_review', 'accepted', 'rejected', 'interview_scheduled']
      });
    }

    const validStatuses = ['pending', 'under_review', 'accepted', 'rejected', 'interview_scheduled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid status',
        validStatuses
      });
    }

    const app = await JobApplication.findById(req.params.id).populate('job');
    
    if (!app) {
      return res.status(404).json({ 
        success: false,
        error: 'Application not found' 
      });
    }

    // Only job creator or admin can update
    const job = await Job.findById(app.job._id);
    if (!job) {
      return res.status(404).json({ 
        success: false,
        error: 'Job not found' 
      });
    }

    if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        error: 'Forbidden',
        message: 'Only the job creator or admin can update application status'
      });
    }

    if (app.applicationType === 'external_redirect') {
      return res.status(400).json({ 
        success: false,
        error: 'Cannot update status of external applications',
        message: 'This application was submitted through an external platform'
      });
    }

    app.status = status;
    if (notes !== undefined) app.notes = notes;
    
    if (status !== 'pending') {
      app.reviewedDate = new Date();
    }

    await app.save();

    return res.json({ 
      success: true,
      message: 'Application status updated successfully',
      application: app
    });
  } catch (e) {
    console.error('Update application status error:', e);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to update application' 
    });
  }
}

// List applications for a specific job (Employer/Admin)
async function listJobApplications(req, res) {
  try {
    const { jobId } = req.params;
    const { page = 1, limit = 20, status } = req.query;

    // Validate jobId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid job ID' 
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ 
        success: false,
        error: 'Job not found' 
      });
    }

    // Only job creator or admin can view applications
    if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        error: 'Forbidden',
        message: 'Only the job creator or admin can view applications'
      });
    }

    const query = { 
      job: jobId,
      applicationType: 'internal' // Only show internal applications
    };
    
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const apps = await JobApplication.find(query)
      .populate('user', '-password')
      .sort({ appliedDate: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await JobApplication.countDocuments(query);

    // Get statistics
    const stats = await JobApplication.aggregate([
      { $match: { job: new mongoose.Types.ObjectId(jobId), applicationType: 'internal' } },
      { $group: {
        _id: '$status',
        count: { $sum: 1 }
      }}
    ]);

    const statusStats = stats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    return res.json({
      success: true,
      meta: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      },
      stats: statusStats,
      data: apps
    });
  } catch (e) {
    console.error('List job applications error:', e);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to list job applications',
      details: e.message
    });
  }
}


/**
 * List all applications (Admin only)
 * GET /applications/admin/all
 */
async function listAllApplications(req, res) {
  try {
    const { page = 1, limit = 20, status, applicationType, userId, jobId } = req.query;

    const query = {};
    if (status) query.status = status;
    if (applicationType) query.applicationType = applicationType;
    if (userId) query.user = userId;
    if (jobId) query.job = jobId;

    const skip = (page - 1) * limit;

    const [apps, total] = await Promise.all([
      JobApplication.find(query)
        .populate('user', 'email firstName lastName')
        .populate('job', 'title companyName')
        .sort({ appliedDate: -1 })
        .skip(skip)
        .limit(Number(limit)),
      JobApplication.countDocuments(query)
    ]);

    return res.json({
      success: true,
      meta: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      },
      data: apps
    });
  } catch (e) {
    console.error('List all applications error:', e);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to list applications' 
    });
  }
}

/**
 * Delete application (Admin only)
 * DELETE /applications/admin/:id
 */
async function deleteApplication(req, res) {
  try {
    const app = await JobApplication.findById(req.params.id);
    
    if (!app) {
      return res.status(404).json({ 
        success: false,
        error: 'Application not found' 
      });
    }

    await app.deleteOne();
    
    return res.json({ 
      success: true,
      message: 'Application deleted successfully' 
    });
  } catch (e) {
    console.error('Delete application error:', e);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to delete application' 
    });
  }
}

// Update exports
module.exports = { 
  submitApplication, 
  listUserApplications, 
  getApplication, 
  withdrawApplication,
  updateApplicationStatus,
  listJobApplications,
  listAllApplications,
  deleteApplication
};
