
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const ScrapedJob = require('./models/scrapedJob.model'); 

async function run(){
  await mongoose.connect(process.env.MONGO_URI);
  const missing = await ScrapedJob.find({ $or: [{ fullDescriptionHtml: {$exists:false} }, { fullDescriptionHtml: null }] }).limit(50).lean();
  console.log('Missing details count (sample 50):', missing.length);
  missing.forEach(d => console.log(d.source, d.externalJobId, d.url));
  process.exit(0);
}
run().catch(e=>{console.error(e); process.exit(1);});
