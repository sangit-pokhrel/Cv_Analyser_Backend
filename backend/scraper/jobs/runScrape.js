// scraper/jobs/runScrape.js
const { connect } = require('../config');
const ScrapedJob = require('../models/scrapedJob.model');
const { scrapeIndeedPuppeteer } = require('../scrapers/indeed.puppeteer');
const { processJobDetails } = require('../scrapers/indeed.detailProcessor');

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function launchBrowser(proxy = null, headless = true) {
  const launchOpts = {
    headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  };
  if (proxy) launchOpts.args.push(`--proxy-server=${proxy}`);
  const browser = await puppeteer.launch(launchOpts);
  return browser;
}

/**
 * runOnce - main integrated scraper runner
 * @param {Object} opts
 *   opts.source - source label (default 'indeed')
 *   opts.search - search query
 *   opts.location - location
 *   opts.proxy - optional proxy server (http://user:pass@host:port)
 *   opts.headless - boolean
 */
async function runOnce({
  source = 'indeed',
  search = 'backend engineer',
  location = 'Kathmandu',
  proxy = process.env.SCRAPER_PROXY || null,
  headless = true
} = {}) {
  await connect();

  // 1) Launch a browser (for detail pages)
  const browser = await launchBrowser(proxy, headless);
  console.log(`[scrape] browser launched (headless=${headless})`);

  try {
    // 2) Get listing page jobs (this function may launch/close its own browser internally;
    //    it only needs to return job list with .url / .externalId)
    const jobs = await scrapeIndeedPuppeteer(search, location, proxy);
    console.log(`[scrape] listing found ${jobs.length} jobs (source=${source})`);
    if (!jobs || jobs.length === 0) {
      await browser.close();
      return { found: 0, inserted: 0 };
    }

    // 3) Enrich jobs by visiting each job detail page
    //    processJobDetails will mutate `jobs` array and add fullDescription*, salary, etc.
    await processJobDetails(jobs, browser, { concurrency: 3, retries: 2, minDelay: 800, maxDelay: 1600 });
    console.log('[scrape] details fetched for jobs');

    // 4) Insert only new jobs into DB (dedupe by source + externalJobId)
    let inserted = 0;
    for (const j of jobs) {
      try {
        const externalJobId = String(j.externalId || j.url || '');
        if (!externalJobId) {
          console.warn('[scrape] skipping job without external id/url', j.title || j.url);
          continue;
        }

        const exists = await ScrapedJob.findOne({ source, externalJobId });
        if (exists) {
          // optionally update existing doc with fresh details (uncomment if you want)
          // await ScrapedJob.updateOne({ source, externalJobId }, { $set: { title: j.title, company: j.company, location: j.location, description: j.description, url: j.url, postedText: j.postedText, raw: j.rawHtml || j.raw, fullDescriptionHtml: j.fullDescriptionHtml, fullDescriptionText: j.fullDescriptionText, salary: j.salary, jobType: j.jobType, companyRating: j.companyRating, benefits: j.benefits, detailFetchedAt: j.detailFetchedAt }});
          continue;
        }

        const doc = {
          source,
          externalJobId,
          title: j.title || null,
          company: j.company || null,
          location: j.location || null,
          description: j.description || null,
          url: j.url || null,
          postedText: j.postedText || null,
          raw: j.rawHtml || j.raw || null,
          // detail fields
          fullDescriptionHtml: j.fullDescriptionHtml || null,
          fullDescriptionText: j.fullDescriptionText || null,
          salary: j.salary || null,
          jobType: j.jobType || null,
          companyRating: j.companyRating || null,
          benefits: j.benefits || null,
          detailFetchedAt: j.detailFetchedAt || null
        };

        await ScrapedJob.create(doc);
        inserted++;
      } catch (err) {
        if (err && err.code === 11000) {
          // duplicate key
          continue;
        }
        console.error('[scrape] insert error for job:', j.url, err.message || err);
      }
    }

    console.log(`[scrape] inserted ${inserted} new jobs (source=${source})`);
    await browser.close();
    return { found: jobs.length, inserted };
  } catch (err) {
    console.error('[scrape] runner error:', err);
    try { await browser.close(); } catch(e) {}
    throw err;
  }
}

module.exports = { runOnce };
