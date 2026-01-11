const Job = require('../models/job.model');
const JobMatch = require('../models/jobMatch.model');
const CVAnalysis = require('../models/cvAnlalysis.model');
const sanitizeHtml = require('sanitize-html');
const mongoose = require('mongoose');

// Helper function to calculate job matches for a specific CV analysis
async function generateJobMatches(cvAnalysisId) {
  try {
    const cvAnalysis = await CVAnalysis.findById(cvAnalysisId).populate('user');
    if (!cvAnalysis || cvAnalysis.status !== 'done') return;

    const userSkills = cvAnalysis.skillsDetected || [];
    const userExperience = cvAnalysis.extractedData?.totalYearsExperience || 0;
    const userLocation = cvAnalysis.user?.location || '';

    // Find active jobs
    const activeJobs = await Job.find({ status: 'active' });

    for (const job of activeJobs) {
      // Check if match already exists
      const existingMatch = await JobMatch.findOne({
        user: cvAnalysis.user._id,
        job: job._id,
        cvAnalysis: cvAnalysisId
      });

      if (existingMatch) continue; // Skip if already matched

      // Calculate match score
      const jobSkills = job.requiredSkills || [];
      const matchedSkills = userSkills.filter(skill => 
        jobSkills.some(jobSkill => 
          jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(jobSkill.toLowerCase())
        )
      );

      const missingSkills = jobSkills.filter(jobSkill =>
        !userSkills.some(skill =>
          skill.toLowerCase().includes(jobSkill.toLowerCase()) ||
          jobSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );

      // Skills match score (0-100)
      const skillsMatchScore = jobSkills.length > 0
        ? (matchedSkills.length / jobSkills.length) * 100
        : 50;

      // Experience match score
      let experienceMatchScore = 50;
      if (job.experienceLevel === 'entry' && userExperience <= 2) experienceMatchScore = 100;
      else if (job.experienceLevel === 'mid' && userExperience >= 2 && userExperience <= 5) experienceMatchScore = 100;
      else if (job.experienceLevel === 'senior' && userExperience >= 5) experienceMatchScore = 100;
      else if (userExperience > 0) experienceMatchScore = 70;

      // Location match score
      let locationMatchScore = 50;
      if (job.jobType === 'remote') locationMatchScore = 100;
      else if (job.location && userLocation) {
        if (job.location.toLowerCase().includes(userLocation.toLowerCase()) ||
            userLocation.toLowerCase().includes(job.location.toLowerCase())) {
          locationMatchScore = 100;
        }
      }

      // Overall match score (weighted average)
      const overallMatchScore = Math.round(
        (skillsMatchScore * 0.6) +
        (experienceMatchScore * 0.25) +
        (locationMatchScore * 0.15)
      );

      // Only create match if score is above threshold (e.g., 40%)
      if (overallMatchScore >= 40) {
        await JobMatch.create({
          user: cvAnalysis.user._id,
          job: job._id,
          cvAnalysis: cvAnalysisId,
          matchScore: overallMatchScore,
          matchingCriteria: {
            skillsMatch: Math.round(skillsMatchScore),
            experienceMatch: Math.round(experienceMatchScore),
            locationMatch: Math.round(locationMatchScore),
            matchedSkills: matchedSkills,
            missingSkills: missingSkills
          },
          status: 'recommended'
        });
      }
    }

    // Update CV analysis to mark matching as triggered
    cvAnalysis.matchingTriggered = true;
    cvAnalysis.matchingTriggeredAt = new Date();
    await cvAnalysis.save();

    console.log(`Generated job matches for CV analysis: ${cvAnalysisId}`);
  } catch (error) {
    console.error('Error generating job matches:', error);
  }
}

// Create Job (Admin/Employer)
async function createJob(req, res) {
  try {
    const jobData = {
      title: req.body.title,
      description: sanitizeHtml(req.body.description || '', { allowedTags: [], allowedAttributes: {} }),
      companyName: req.body.companyName,
      companyLogoUrl: req.body.companyLogoUrl,
      requirements: req.body.requirements,
      category: req.body.category,
      location: req.body.location,
      jobType: req.body.jobType,
      salaryMin: req.body.salaryMin,
      salaryMax: req.body.salaryMax,
      experienceLevel: req.body.experienceLevel,
      status: req.body.status || 'active',
      deadline: req.body.deadline,
      createdBy: req.user._id,
      
      // New fields
      jobSource: req.body.jobSource || 'manual',
      externalUrl: req.body.externalUrl,
      externalId: req.body.externalId,
      applicationMethod: req.body.applicationMethod || (req.body.externalUrl ? 'external_redirect' : 'internal'),
      requiredSkills: req.body.requiredSkills || []
    };

    const job = await Job.create(jobData);

    // Trigger job matching for all users with completed CV analysis
    // This runs in background
    setImmediate(async () => {
      try {
        const completedAnalyses = await CVAnalysis.find({ 
          status: 'done',
          matchingTriggered: true 
        }).populate('user');

        for (const analysis of completedAnalyses) {
          const userSkills = analysis.skillsDetected || [];
          const matchedSkills = userSkills.filter(skill =>
            jobData.requiredSkills.some(jobSkill =>
              jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
              skill.toLowerCase().includes(jobSkill.toLowerCase())
            )
          );

          if (matchedSkills.length > 0) {
            const skillsMatchScore = (matchedSkills.length / jobData.requiredSkills.length) * 100;
            
            if (skillsMatchScore >= 40) {
              await JobMatch.create({
                user: analysis.user._id,
                job: job._id,
                cvAnalysis: analysis._id,
                matchScore: Math.round(skillsMatchScore),
                matchingCriteria: {
                  skillsMatch: Math.round(skillsMatchScore),
                  matchedSkills: matchedSkills
                },
                status: 'recommended'
              });
            }
          }
        }
      } catch (err) {
        console.error('Error creating real-time matches:', err);
      }
    });

    return res.status(201).json({ job });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create job' });
  }
}

// List Jobs with filters
async function listJobs(req, res) {
  try {
    const { 
      page = 1, 
      limit = 20, 
      q, 
      location, 
      type, 
      category,
      jobSource,
      experienceLevel,
      salaryMin,
      salaryMax
    } = req.query;

    const query = { status: 'active' }; // Only show active jobs by default

    if (q) query.$or = [
      { title: new RegExp(q, 'i') }, 
      { description: new RegExp(q, 'i') },
      { companyName: new RegExp(q, 'i') }
    ];
    if (location) query.location = new RegExp(location, 'i');
    if (type) query.jobType = type;
    if (category) query.category = category;
    if (jobSource) query.jobSource = jobSource;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (salaryMin) query.salaryMin = { $gte: Number(salaryMin) };
    if (salaryMax) query.salaryMax = { $lte: Number(salaryMax) };

    const opts = { 
      page: Number(page), 
      limit: Math.min(100, Number(limit)), 
      sort: { postedDate: -1 }, 
      populate: 'createdBy category' 
    };

    const result = await Job.paginate(query, opts);
    
    return res.json({ 
      meta: { 
        total: result.totalDocs, 
        page: result.page, 
        pages: result.totalPages 
      }, 
      data: result.docs 
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to list jobs' });
  }
}

// Get single job and increment view count
async function getJob(req, res) {
  try {
    const job = await Job.findById(req.params.id).populate('createdBy category');
    if (!job) return res.status(404).json({ error: 'Job not found' });

    // Increment view count
    job.viewCount = (job.viewCount || 0) + 1;
    await job.save();

    return res.json({ job });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to fetch job' });
  }
}

// Update Job
async function updateJob(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    
    if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updateFields = [
      'title', 'companyName', 'companyLogoUrl', 'requirements', 
      'location', 'jobType', 'salaryMin', 'salaryMax', 
      'experienceLevel', 'status', 'deadline', 'category',
      'requiredSkills', 'externalUrl', 'jobSource', 'applicationMethod'
    ];

    updateFields.forEach(k => {
      if (req.body[k] !== undefined) job[k] = req.body[k];
    });

    if (req.body.description) {
      job.description = sanitizeHtml(req.body.description, { 
        allowedTags: [], 
        allowedAttributes: {} 
      });
    }

    await job.save();
    return res.json({ job });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to update job' });
  }
}

// Delete Job
async function deleteJob(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    
    if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await job.deleteOne();
    return res.json({ message: 'Job deleted' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Failed to delete job' });
  }
}

// Get job recommendations for logged-in user
async function getRecommendations(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;

    const matches = await JobMatch.find({ 
      user: req.user._id,
      status: { $in: ['recommended', 'viewed'] }
    })
      .populate('job')
      .sort({ matchScore: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await JobMatch.countDocuments({
      user: req.user._id,
      status: { $in: ['recommended', 'viewed'] }
    });

    return res.json({
      meta: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      },
      data: matches
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
}

module.exports = { 
  createJob, 
  listJobs, 
  getJob, 
  updateJob, 
  deleteJob,
  getRecommendations,
  generateJobMatches // Export for use in CV worker
};




















// const Job = require('../models/job.model');
// const sanitizeHtml = require('sanitize-html');

// async function createJob(req, res) {
//   try {
//     const jobData = {
//       title: req.body.title,
//       description: sanitizeHtml(req.body.description || '', { allowedTags: [], allowedAttributes: {} }),
//       companyName: req.body.companyName,
//       companyLogoUrl: req.body.companyLogoUrl,
//       requirements: req.body.requirements,
//       category: req.body.category,
//       location: req.body.location,
//       jobType: req.body.jobType,
//       salaryMin: req.body.salaryMin,
//       salaryMax: req.body.salaryMax,
//       experienceLevel: req.body.experienceLevel,
//       status: req.body.status || 'active',
//       deadline: req.body.deadline,
//       createdBy: req.user._id
//     };
//     const job = await Job.create(jobData);
//     return res.status(201).json({ job });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Failed to create job' });
//   }
// }

// async function listJobs(req, res) {
//   try {
//     const { page = 1, limit = 20, q, location, type, category } = req.query;
//     const query = {};
//     if (q) query.$or = [{ title: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') }];
//     if (location) query.location = new RegExp(location, 'i');
//     if (type) query.jobType = type;
//     if (category) query.category = category;

//     const opts = { page: Number(page), limit: Math.min(100, Number(limit)), sort: { postedDate: -1 }, populate: 'createdBy category' };
//     const result = await Job.paginate(query, opts);
//     return res.json({ meta: { total: result.totalDocs, page: result.page, pages: result.totalPages }, data: result.docs });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: 'Failed to list jobs' });
//   }
// }

// async function getJob(req, res) {
//   try {
//     const job = await Job.findById(req.params.id).populate('createdBy category');
//     if (!job) return res.status(404).json({ error: 'Job not found' });
//     return res.json({ job });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: 'Failed to fetch job' });
//   }
// }

// async function updateJob(req, res) {
//   try {
//     const job = await Job.findById(req.params.id);
//     if (!job) return res.status(404).json({ error: 'Job not found' });
//     if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Forbidden' });
//     }
//     ['title','companyName','companyLogoUrl','requirements','location','jobType','salaryMin','salaryMax','experienceLevel','status','deadline','category'].forEach(k => {
//       if (req.body[k] !== undefined) job[k] = req.body[k];
//     });
//     if (req.body.description) job.description = sanitizeHtml(req.body.description, { allowedTags: [], allowedAttributes: {} });
//     await job.save();
//     return res.json({ job });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: 'Failed to update job' });
//   }
// }

// async function deleteJob(req, res) {
//   try {
//     const job = await Job.findById(req.params.id);
//     if (!job) return res.status(404).json({ error: 'Job not found' });
//     if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//       return res.status(403).json({ error: 'Forbidden' });
//     }
//     await job.remove();
//     return res.json({ message: 'Job deleted' });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: 'Failed to delete job' });
//   }
// }

// module.exports = { createJob, listJobs, getJob, updateJob, deleteJob };
