const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeIndeed(search = 'backend+engineer', location = 'Kathmandu') {
  const url = `https://www.indeed.com/jobs?q=${encodeURIComponent(search)}&l=${encodeURIComponent(location)}`;
  const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const $ = cheerio.load(data);
  const jobs = [];

  $('.result, .job_seen_beacon').each((i, el) => {
    const title = $(el).find('h2.jobTitle').text().trim() || $(el).find('a.jobtitle').text().trim();
    const company = $(el).find('.companyName').text().trim();
    const locationText = $(el).find('.companyLocation').text().trim();
    const jobKey = $(el).attr('data-jk') || $(el).find('a').attr('data-jk');
    const link = jobKey ? `https://www.indeed.com/viewjob?jk=${jobKey}` : $(el).find('a').attr('href');
    const summary = $(el).find('.job-snippet').text().trim();

    if (jobKey) {
      jobs.push({
        externalId: jobKey,
        title,
        company,
        location: locationText,
        description: summary,
        url: link,
        postedAt: null,
        raw: $(el).html()
      });
    }
  });

  return jobs;
}

module.exports = { scrapeIndeed };
