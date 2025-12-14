const JobApplication = require('../models/jobApplication.model');
const Job = require('../models/job.model');
const JobMatch = require('../models/jobMatch.model');

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
      return res.status(400).json({ error: 'Already applied to this job' });
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
        application,
        redirect: false,
        message: 'Application submitted successfully'
      });
    }

  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to submit application' });
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
      meta: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      },
      data: apps 
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to list applications' });
  }
}

// Get single application
async function getApplication(req, res) {
  try {
    const app = await JobApplication.findById(req.params.id)
      .populate('job user');
    
    if (!app) return res.status(404).json({ error: 'Application not found' });

    // Authorization: applicant, job owner, or admin
    if (app.user._id.toString() !== req.user._id.toString()) {
      const job = await Job.findById(app.job._id);
      if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    return res.json({ application: app });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to fetch application' });
  }
}

// Withdraw application (only for internal applications)
async function withdrawApplication(req, res) {
  try {
    const app = await JobApplication.findById(req.params.id);
    
    if (!app) return res.status(404).json({ error: 'Application not found' });
    
    if (app.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (app.applicationType === 'external_redirect') {
      return res.status(400).json({ 
        error: 'Cannot withdraw external applications. Please contact the employer directly.' 
      });
    }

    // Update job match status back to viewed
    await JobMatch.updateOne(
      { user: req.user._id, job: app.job },
      { status: 'viewed' }
    );

    await app.deleteOne();
    
    return res.json({ message: 'Application withdrawn successfully' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to withdraw application' });
  }
}

// Update application status (Admin/Employer only)
async function updateApplicationStatus(req, res) {
  try {
    const { status, notes } = req.body;
    
    const app = await JobApplication.findById(req.params.id).populate('job');
    
    if (!app) return res.status(404).json({ error: 'Application not found' });

    // Only job creator or admin can update
    const job = await Job.findById(app.job._id);
    if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (app.applicationType === 'external_redirect') {
      return res.status(400).json({ 
        error: 'Cannot update status of external applications' 
      });
    }

    if (status) app.status = status;
    if (notes !== undefined) app.notes = notes;
    
    if (status && status !== 'pending') {
      app.reviewedDate = new Date();
    }

    await app.save();

    return res.json({ 
      application: app,
      message: 'Application status updated successfully'
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to update application' });
  }
}

// List applications for a specific job (Employer/Admin)
async function listJobApplications(req, res) {
  try {
    const { jobId } = req.params;
    const { page = 1, limit = 20, status } = req.query;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    // Only job creator or admin can view applications
    if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const query = { 
      job: jobId,
      applicationType: 'internal' // Only show internal applications to employers
    };
    
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const apps = await JobApplication.find(query)
      .populate('user', '-password')
      .sort({ appliedDate: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await JobApplication.countDocuments(query);

    return res.json({
      meta: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      },
      data: apps
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to list job applications' });
  }
}

module.exports = { 
  submitApplication, 
  listUserApplications, 
  getApplication, 
  withdrawApplication,
  updateApplicationStatus,
  listJobApplications
};




// const JobApplication = require('../models/jobApplication.model');
// const Job = require('../models/job.model');

// async function submitApplication(req, res) {
//   try {
//     const jobId = req.body.jobId || req.params.jobId;
//     const job = await Job.findById(jobId);
//     if (!job || job.status !== 'active') return res.status(404).json({ error: 'Job not available' });

//     const existing = await JobApplication.findOne({ user: req.user._id, job: jobId });
//     if (existing) return res.status(400).json({ error: 'Already applied' });

//     const app = await JobApplication.create({
//       user: req.user._id,
//       job: jobId,
//       coverLetter: req.body.coverLetter,
//       resumeUrl: req.body.resumeUrl
//     });
//     return res.status(201).json({ application: app });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: 'Failed to apply' });
//   }
// }

// async function listUserApplications(req, res) {
//   try {
//     const apps = await JobApplication.find({ user: req.user._id }).populate('job');
//     return res.json({ data: apps });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: 'Failed to list applications' });
//   }
// }

// async function getApplication(req, res) {
//   try {
//     const app = await JobApplication.findById(req.params.id).populate('job user');
//     if (!app) return res.status(404).json({ error: 'Not found' });
//     // authorize: applicant or job owner or admin
//     if (app.user._id.toString() !== req.user._id.toString()) {
//       const job = await Job.findById(app.job._id);
//       if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//         return res.status(403).json({ error: 'Forbidden' });
//       }
//     }
//     return res.json({ application: app });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: 'Failed to fetch application' });
//   }
// }

// async function withdrawApplication(req, res) {
//   try {
//     const app = await JobApplication.findById(req.params.id);
//     if (!app) return res.status(404).json({ error: 'Not found' });
//     if (app.user.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Forbidden' });
//     await app.remove();
//     return res.json({ message: 'Withdrawn' });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: 'Failed to withdraw' });
//   }
// }

// module.exports = { submitApplication, listUserApplications, getApplication, withdrawApplication };
