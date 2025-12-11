// scraper/scrapers/indeed.detailProcessor.js
// Usage: const { processJobDetails } = require('./indeed.detailProcessor');
// await processJobDetails(jobs, browser, { concurrency: 3, retries: 2 });

const { scrapeJobDetail } = require('./indeed.puppeteer'); // adjust path if needed

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Process job details for an array of job list items.
 * Each job should have a .url property pointing to the job detail page.
 *
 * @param {Array} jobs - array of job objects (will be mutated with detail fields)
 * @param {Browser} browser - puppeteer browser instance (launched externally)
 * @param {Object} opts
 * @param {number} opts.concurrency - how many pages to fetch in parallel (default 3)
 * @param {number} opts.retries - number of retries on failure per job (default 2)
 * @param {number} opts.minDelay - minimum delay between requests per worker (ms)
 * @param {number} opts.maxDelay - maximum delay between requests per worker (ms)
 */
async function processJobDetails(jobs, browser, opts = {}) {
  const {
    concurrency = 3,
    retries = 2,
    minDelay = 800,
    maxDelay = 1800
  } = opts;

  if (!Array.isArray(jobs) || jobs.length === 0) {
    return { found: 0, processed: 0, errors: 0 };
  }
  if (!browser) throw new Error('Puppeteer browser instance required');

  let processed = 0;
  let errors = 0;

  // simple worker pool: maintain "concurrency" number of parallel runners
  const queue = jobs.slice(); // shallow copy
  const workers = new Array(Math.min(concurrency, queue.length)).fill(null).map(() => worker());

  await Promise.all(workers);

  return { found: jobs.length, processed, errors };

  // worker function consumes from queue until empty
  async function worker() {
    while (queue.length > 0) {
      const job = queue.shift();
      if (!job || !job.url) {
        // nothing to do for this item
        continue;
      }

      let attempt = 0;
      let success = false;
      let lastErr = null;

      while (attempt <= retries && !success) {
        attempt++;
        let page = null;
        try {
          page = await browser.newPage();

          // Optionally set headers / UA / viewport if your scrapeJobDetail expects a page param
          // If your scrapeJobDetail takes only a browser and url, adjust accordingly.
          // Here we assume scrapeJobDetail(browser, url) — your implementation may vary.
          // If scrapeJobDetail needs a page instance, you can modify it to accept a page param.
          // For backward compatibility, call both flavors.
          let detail;

          // If your scrapeJobDetail expects a page object: use this:
          if (scrapeJobDetail.length >= 2) {
            // signature like: async function scrapeJobDetail(page, url) { ... }
            await page.setExtraHTTPHeaders({ 'accept-language': 'en-US,en;q=0.9' });
            detail = await scrapeJobDetail(page, job.url);
          } else {
            // signature like: async function scrapeJobDetail(browser, url) { ... }
            detail = await scrapeJobDetail(browser, job.url);
          }

          // attach fields safely (guard against undefined)
          job.fullDescriptionHtml = (detail.fullDescriptionHtml ?? detail.fullDescriptionHTML ?? detail.fullDescription) || job.fullDescriptionHtml || null;
          job.fullDescriptionText = (detail.fullDescriptionText ?? detail.fullDescriptionText ?? detail.fullDescriptionText) || job.fullDescriptionText || null;
          job.salary = detail.salary ?? null;
          job.jobType = detail.jobType ?? null;
          job.companyRating = detail.companyRating ?? null;
          job.postedDate = detail.postedDate ?? null;
          job.benefits = Array.isArray(detail.benefits) ? detail.benefits : (detail.benefits ? [detail.benefits] : []);
          job.detailFetchedAt = new Date();

          success = true;
          processed++;
        } catch (err) {
          lastErr = err;
          attempt++;
          // retry after small exponential backoff
          const backoff = 500 * attempt + rand(200, 800);
          console.warn(`[detailProcessor] attempt ${attempt}/${retries} failed for ${job.url} — retrying in ${backoff}ms — error: ${err.message}`);
          await sleep(backoff);
        } finally {
          try { if (page && !page.isClosed()) await page.close(); } catch (e) {}
        }
      } // end attempts

      if (!success) {
        console.error(`[detailProcessor] Failed to fetch details for ${job.url} after ${retries} retries. Last error:`, lastErr && lastErr.message ? lastErr.message : lastErr);
        job.detailError = lastErr ? String(lastErr) : 'unknown';
        errors++;
      }

      // polite random delay between requests executed by this worker
      const delay = rand(minDelay, maxDelay);
      await sleep(delay);
    } // end while queue
  } // end worker
}

module.exports = { processJobDetails };
