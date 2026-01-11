// // scraper/scrapers/indeed.puppeteer.js
// const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// puppeteer.use(StealthPlugin());
// const randomUseragent = require('random-useragent');

// async function scrapeIndeedPuppeteer(search='backend engineer', location='Kathmandu', proxy) {
//   const url = `https://www.indeed.com/jobs?q=${encodeURIComponent(search)}&l=${encodeURIComponent(location)}`;

//   const launchOpts = {
//     headless: true,
//     args: [
//       '--no-sandbox',
//       '--disable-setuid-sandbox',
//       '--disable-dev-shm-usage',
//       '--disable-accelerated-2d-canvas'
//     ]
//   };
//   if (proxy) launchOpts.args.push(`--proxy-server=${proxy}`);

//   const browser = await puppeteer.launch(launchOpts);
//   const page = await browser.newPage();

//   // Human-like headers
//   const ua = randomUseragent.getRandom() || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';
//   await page.setUserAgent(ua);
//   await page.setViewport({ width: 1280 + Math.floor(Math.random()*100), height: 800 + Math.floor(Math.random()*50) });
//   await page.setExtraHTTPHeaders({
//     'accept-language': 'en-US,en;q=0.9'
//   });

//   // Navigate
//   await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

//   // Wait for job cards to appear
//   await page.waitForSelector('.job_seen_beacon, .result', { timeout: 15000 });

//   // Extract jobs
//   const jobs = await page.evaluate(() => {
//     const list = [];
//     const nodes = document.querySelectorAll('.job_seen_beacon, .result');
//     nodes.forEach(el => {
//       const jobKey = el.getAttribute('data-jk') || (el.querySelector('a') && el.querySelector('a').getAttribute('data-jk'));
//       const titleEl = el.querySelector('h2.jobTitle') || el.querySelector('.jobTitle');
//       const title = titleEl ? titleEl.innerText.trim() : '';
//       const company = (el.querySelector('.companyName') || {}).innerText || '';
//       const location = (el.querySelector('.companyLocation') || {}).innerText || '';
//       const summary = (el.querySelector('.job-snippet') || {}).innerText || '';
//       const link = jobKey ? `https://www.indeed.com/viewjob?jk=${jobKey}` : (el.querySelector('a') ? el.querySelector('a').href : '');
//       list.push({
//         externalId: jobKey || link,
//         title, company, location, description: summary, url: link
//       });
//     });
//     return list;
//   });

//   await browser.close();
//   return jobs;
// }

// module.exports = { scrapeIndeedPuppeteer };


// scraper/scrapers/indeed.puppeteer.js
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const randomUseragent = require('random-useragent');

puppeteer.use(StealthPlugin());

async function scrapeIndeedPuppeteer(search = 'backend engineer', location = 'Kathmandu', proxy) {
  const url = `https://www.indeed.com/jobs?q=${encodeURIComponent(search)}&l=${encodeURIComponent(location)}`;

  const launchOpts = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas'
    ]
  };
  if (proxy) launchOpts.args.push(`--proxy-server=${proxy}`);

  const browser = await puppeteer.launch(launchOpts);
  const page = await browser.newPage();

  // Human-like headers
  const ua = randomUseragent.getRandom() || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';
  await page.setUserAgent(ua);
  await page.setViewport({ width: 1280 + Math.floor(Math.random()*100), height: 800 + Math.floor(Math.random()*50) });
  await page.setExtraHTTPHeaders({ 'accept-language': 'en-US,en;q=0.9' });

  // Navigate
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

  // Wait for job cards
  try {
    await page.waitForSelector('.job_seen_beacon, .result', { timeout: 15000 });
  } catch (err) {
    // no job cards found — return empty
    await browser.close();
    return [];
  }

  // Extract jobs
  const jobs = await page.evaluate(() => {
    const list = [];
    const nodes = document.querySelectorAll('.job_seen_beacon, .result');
    nodes.forEach(el => {
      const jobKey = el.getAttribute('data-jk') || (el.querySelector('a') && el.querySelector('a').getAttribute('data-jk'));
      const titleEl = el.querySelector('h2.jobTitle') || el.querySelector('.jobTitle') || el.querySelector('a.jobtitle');
      const title = titleEl ? titleEl.innerText.trim() : '';
      const company = (el.querySelector('.companyName') || {}).innerText || '';
      const location = (el.querySelector('.companyLocation') || {}).innerText || '';
      const summary = (el.querySelector('.job-snippet') || {}).innerText || '';
      const link = jobKey ? `https://www.indeed.com/viewjob?jk=${jobKey}` : (el.querySelector('a') ? el.querySelector('a').href : '');
      const postedText = (el.querySelector('.date') || {}).innerText || null;
      list.push({
        externalId: jobKey || link,
        title,
        company,
        location,
        description: summary,
        url: link,
        postedText,
        rawHtml: el.innerHTML
      });
    });
    return list;
  });

  await browser.close();
  return jobs;
}

async function scrapeJobDetail(browser, url) {
  const page = await browser.newPage();
  await page.setUserAgent(randomUseragent.getRandom());
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

  const detail = await page.evaluate(() => {
    return {
      fullDescriptionHtml: document.querySelector('#jobDescriptionText')?.innerHTML || '',
      fullDescriptionText: document.querySelector('#jobDescriptionText')?.innerText || '',
      salary: document.querySelector('.salary-snippet-container')?.innerText || null,
      jobType: document.querySelector('.jobsearch-JobDescriptionSection-sectionItem')?.innerText || null,
      companyRating: document.querySelector('.icl-Ratings-starsCountWrapper')?.innerText || null,
      postedDate: document.querySelector('.jobsearch-JobMetadataFooter')?.innerText || null,
      benefits: Array.from(document.querySelectorAll('.jobsearch-JobDescriptionSection-sectionItem'))
          .map(x => x.innerText)
    };
  });

  await page.close();
  return detail;
}


module.exports = { scrapeIndeedPuppeteer, scrapeJobDetail };
