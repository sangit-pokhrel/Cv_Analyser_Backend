// scraper/index.js
const { runOnce } = require('./jobs/runScrape');

async function main() {
  try {
    const result = await runOnce({
      source: 'indeed',
      search: process.env.SCRAPE_SEARCH || 'backend engineer',
      location: process.env.SCRAPE_LOCATION || 'Kathmandu',
      proxy: process.env.SCRAPER_PROXY || null
    });
    console.log('Done:', result);
    process.exit(0);
  } catch (err) {
    console.error('Scraper failed:', err);
    process.exit(1);
  }
}

main();
