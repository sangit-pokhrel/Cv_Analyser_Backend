
require('dotenv').config();
const cvQueue = require('../queues/cvQueus');
const CVAnalysis = require('../models/cvAnlalysis.model');

cvQueue.process(async (job) => {
  const { analysisId } = job.data;
  console.log('[CV WORKER] processing', analysisId);
  const record = await CVAnalysis.findById(analysisId);
  if (!record) throw new Error('analysis record not found');

  try {
    // mark processing
    record.status = 'processing';
    await record.save();

    // === PLACEHOLDER: call your ML/NLP function here ===
    // Simulated analysis:
    await new Promise(r => setTimeout(r, 2000)); // simulate processing time

    const fakeResult = {
      overallScore: Math.floor(Math.random() * 41) + 60, // 60-100
      strengths: ['clear structure','relevant keywords'],
      weaknesses: ['missing quantification','short summary'],
      recommendations: ['Add metrics', 'Include technical keywords'],
      skillsDetected: ['nodejs', 'mongodb']
    };

    record.analysisResult = fakeResult;
    record.overallScore = fakeResult.overallScore;
    record.strengths = fakeResult.strengths;
    record.weaknesses = fakeResult.weaknesses;
    record.recommendations = fakeResult.recommendations;
    record.skillsDetected = fakeResult.skillsDetected;
    record.status = 'done';
    record.analyzedAt = new Date();
    await record.save();

    console.log('[CV WORKER] done', analysisId);
    return { ok: true };
  } catch (err) {
    console.error('[CV WORKER] failed', err);
    record.status = 'failed';
    await record.save();
    throw err;
  }
});

cvQueue.on('completed', (job) => console.log('Job completed', job.id));
cvQueue.on('failed', (job, err) => console.log('Job failed', job.id, err.message));
console.log('CV worker started, listening for jobs...');
