
// // const SavedJob = require('../models/savedJobs.model');
// // async function saveJob(req, res) {
// //   try {
// //     const jobId = req.params.jobId;
// //     const obj = { user: req.user._id, job: jobId };
// //     const saved = await SavedJob.findOneAndUpdate(obj, obj, { upsert: true, new: true, setDefaultsOnInsert: true });
// //     return res.status(201).json({ saved });
// //   } catch (e) { console.error(e); return res.status(500).json({ error: 'Failed' }); }
// // }
// // async function listSaved(req, res) {
// //   const list = await SavedJob.find({ user: req.user._id }).populate('job');
// //   return res.json({ data: list });
// // }
// // async function removeSaved(req, res) {
// //   await SavedJob.deleteOne({ user: req.user._id, job: req.params.jobId });
// //   return res.json({ message: 'Removed' });
// // }
// // module.exports = { saveJob, listSaved, removeSaved };


// const SavedJob = require('../models/savedJobs.model');
// const Job = require('../models/job.model');
// const mongoose = require('mongoose');

// // POST /api/v1/saved-jobs/:jobId - Save a job
// async function saveJob(req, res) {
//   try {
//     const { jobId } = req.params;
//     const userId = req.user._id;

//     // Validate jobId format
//     if (!mongoose.Types.ObjectId.isValid(jobId)) {
//       return res.status(400).json({ error: 'Invalid job ID format' });
//     }

//     // Check if job exists
//     const job = await Job.findById(jobId);
//     if (!job) {
//       return res.status(404).json({ error: 'Job not found' });
//     }

//     // Check if already saved
//     const existing = await SavedJob.findOne({ user: userId, job: jobId });
//     if (existing) {
//       return res.status(200).json({ 
//         message: 'Job already saved',
//         saved: existing 
//       });
//     }

//     // Save the job
//     const saved = await SavedJob.create({
//       user: userId,
//       job: jobId
//     });

//     // Populate job details
//     await saved.populate('job');

//     return res.status(201).json({ 
//       message: 'Job saved successfully',
//       saved 
//     });

//   } catch (error) {
//     console.error('Error saving job:', error);
    
//     // Handle duplicate key error
//     if (error.code === 11000) {
//       return res.status(200).json({ message: 'Job already saved' });
//     }
    
//     return res.status(500).json({ error: 'Failed to save job' });
//   }
// }

// // GET /api/v1/saved-jobs - Get all saved jobs for user
// async function listSaved(req, res) {
//   try {
//     const userId = req.user._id;
//     const { page = 1, limit = 20, sort = '-savedAt' } = req.query;

//     const options = {
//       page: parseInt(page),
//       limit: parseInt(limit),
//       sort,
//       populate: {
//         path: 'job',
//         select: 'title companyName location jobType salaryMin salaryMax experienceLevel status postedDate deadline companyLogoUrl requiredSkills'
//       }
//     };

//     const savedJobs = await SavedJob.paginate(
//       { user: userId },
//       options
//     );

//     // Filter out saved jobs where the job has been deleted
//     const validSavedJobs = savedJobs.docs.filter(saved => saved.job !== null);

//     return res.json({
//       success: true,
//       data: validSavedJobs,
//       meta: {
//         total: savedJobs.totalDocs,
//         page: savedJobs.page,
//         limit: savedJobs.limit,
//         pages: savedJobs.totalPages
//       }
//     });

//   } catch (error) {
//     console.error('Error listing saved jobs:', error);
//     return res.status(500).json({ error: 'Failed to fetch saved jobs' });
//   }
// }

// // DELETE /api/v1/saved-jobs/:jobId - Remove saved job
// async function removeSaved(req, res) {
//   try {
//     const { jobId } = req.params;
//     const userId = req.user._id;

//     // Validate jobId format
//     if (!mongoose.Types.ObjectId.isValid(jobId)) {
//       return res.status(400).json({ error: 'Invalid job ID format' });
//     }

//     const result = await SavedJob.deleteOne({ 
//       user: userId, 
//       job: jobId 
//     });

//     if (result.deletedCount === 0) {
//       return res.status(404).json({ error: 'Saved job not found' });
//     }

//     return res.json({ 
//       success: true,
//       message: 'Job removed from saved list' 
//     });

//   } catch (error) {
//     console.error('Error removing saved job:', error);
//     return res.status(500).json({ error: 'Failed to remove saved job' });
//   }
// }

// // GET /api/v1/saved-jobs/check/:jobId - Check if job is saved
// async function checkIfSaved(req, res) {
//   try {
//     const { jobId } = req.params;
//     const userId = req.user._id;

//     // Validate jobId format
//     if (!mongoose.Types.ObjectId.isValid(jobId)) {
//       return res.status(400).json({ error: 'Invalid job ID format' });
//     }

//     const saved = await SavedJob.findOne({ 
//       user: userId, 
//       job: jobId 
//     });

//     return res.json({ 
//       success: true,
//       isSaved: !!saved 
//     });

//   } catch (error) {
//     console.error('Error checking saved status:', error);
//     return res.status(500).json({ error: 'Failed to check saved status' });
//   }
// }

// module.exports = { 
//   saveJob, 
//   listSaved, 
//   removeSaved,
//   checkIfSaved 
// };


const SavedJob = require('../models/savedJobs.model');
const Job = require('../models/job.model');
const mongoose = require('mongoose');

// POST /api/v1/saved-jobs/:jobId - Save a job
async function saveJob(req, res) {
  try {
    const { jobId } = req.params;
    
    // Get userId from req.user (set by your existing auth middleware)
    const userId = req.user._id || req.user.id;

    // Validate jobId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: 'Invalid job ID format' });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if already saved
    const existing = await SavedJob.findOne({ user: userId, job: jobId });
    if (existing) {
      await existing.populate('job');
      return res.status(200).json({ 
        message: 'Job already saved',
        saved: existing 
      });
    }

    // Save the job
    const saved = await SavedJob.create({
      user: userId,
      job: jobId
    });

    // Populate job details
    await saved.populate('job');

    return res.status(201).json({ 
      message: 'Job saved successfully',
      saved 
    });

  } catch (error) {
    console.error('Error saving job:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(200).json({ message: 'Job already saved' });
    }
    
    return res.status(500).json({ error: 'Failed to save job' });
  }
}

// GET /api/v1/saved-jobs - Get all saved jobs for user
async function listSaved(req, res) {
  try {
    const userId = req.user._id || req.user.id;
    const { page = 1, limit = 20, sort = '-savedAt' } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
      populate: {
        path: 'job',
        select: 'title companyName location jobType salaryMin salaryMax experienceLevel status postedDate deadline companyLogoUrl requiredSkills'
      }
    };

    const savedJobs = await SavedJob.paginate(
      { user: userId },
      options
    );

    // Filter out saved jobs where the job has been deleted
    const validSavedJobs = savedJobs.docs.filter(saved => saved.job !== null);

    return res.json({
      success: true,
      data: validSavedJobs,
      meta: {
        total: savedJobs.totalDocs,
        page: savedJobs.page,
        limit: savedJobs.limit,
        pages: savedJobs.totalPages
      }
    });

  } catch (error) {
    console.error('Error listing saved jobs:', error);
    return res.status(500).json({ error: 'Failed to fetch saved jobs' });
  }
}

// DELETE /api/v1/saved-jobs/:jobId - Remove saved job
async function removeSaved(req, res) {
  try {
    const { jobId } = req.params;
    const userId = req.user._id || req.user.id;

    // Validate jobId format
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: 'Invalid job ID format' });
    }

    const result = await SavedJob.deleteOne({ 
      user: userId, 
      job: jobId 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Saved job not found' });
    }

    return res.json({ 
      success: true,
      message: 'Job removed from saved list' 
    });

  } catch (error) {
    console.error('Error removing saved job:', error);
    return res.status(500).json({ error: 'Failed to remove saved job' });
  }
}

module.exports = { 
  saveJob, 
  listSaved, 
  removeSaved
};