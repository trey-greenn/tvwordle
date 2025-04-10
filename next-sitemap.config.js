/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'www.tvwordle.com',
    generateRobotsTxt: true,
    changefreq: 'daily',
    priority: 0.7,
    sitemapSize: 5000,
    exclude: ['/admin'], // optional
  };
  