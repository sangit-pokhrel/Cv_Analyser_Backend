const { connect } = require('../config');
const ScrapedJob = require('../models/scrapedJob.model');
const { processJobDetails } = require('../scrapers/indeed.detailProcessor');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function launchBrowser(proxy=null){
  const opts = { headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] };
  if (proxy) opts.args.push(`--proxy-server=${proxy}`);
  return await puppeteer.launch(opts);
}

async function run() {
  await connect();

  const docs = await ScrapedJob.find({ $or: [{ fullDescriptionHtml: {$exists:false} }, { fullDescriptionHtml: null }] }).limit(100).lean();
  if (!docs.length) { console.log('No missing docs'); process.exit(0); }

  const jobs = docs.map(d => ({ externalId: d.externalJobId, url: d.url, title: d.title }));

  const browser = await launchBrowser(process.env.SCRAPER_PROXY || null);
  await processJobDetails(jobs, browser, { concurrency: 2, retries: 3, minDelay: 1000, maxDelay: 2500 });

  for (const j of jobs) {
    if (!j.externalId) continue;
    const update = {};
    if (j.fullDescriptionHtml) update.fullDescriptionHtml = j.fullDescriptionHtml;
    if (j.fullDescriptionText) update.fullDescriptionText = j.fullDescriptionText;
    if (j.salary) update.salary = j.salary;
    if (j.jobType) update.jobType = j.jobType;
    if (j.companyRating) update.companyRating = j.companyRating;
    if (j.postedDate) update.postedDate = j.postedDate;
    if (j.benefits) update.benefits = j.benefits;
    if (j.detailFetchedAt) update.detailFetchedAt = j.detailFetchedAt || new Date();
    if (Object.keys(update).length) {
      await ScrapedJob.updateOne({ source: 'indeed', externalJobId: String(j.externalId) }, { $set: update });
      console.log('Updated', j.externalId);
    } else {
      console.log('No detail for', j.externalId);
    }
  }

  await browser.close();
  console.log('Reprocess done');
  process.exit(0);
}

run().catch(e=>{ console.error(e); process.exit(1); });
