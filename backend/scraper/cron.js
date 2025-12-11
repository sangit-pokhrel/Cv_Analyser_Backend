
const cron = require('node-cron');
const { runOnce } = require('./jobs/runScrape');

console.log('Scheduling scraper every 12 hours');
cron.schedule('0 */12 * * *', async () => {
  console.log('Cron trigger:', new Date());
  await runOnce({
    source: 'indeed',
    search: process.env.SCRAPE_SEARCH || 'backend engineer',
    location: process.env.SCRAPE_LOCATION || 'Kathmandu',
    proxy: process.env.SCRAPER_PROXY || null
  });
});
