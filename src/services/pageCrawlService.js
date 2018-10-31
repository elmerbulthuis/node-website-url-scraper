const request = require('request');
const cheerio = require('cheerio');
const URL = require('url');
const https = require('https');
const http = require('http');
const logger = require('../utils/logger');
const Page = require('../models/Page');
const { REQUEST_TIMEOUT } = require('../config/config');

/* Create HTTPS pool, so we can pool requests to the same domain */
const httpsPool = new https.Agent({
  maxSockets: 256,
  keepAlive: true
});
/* Create HTTP pool, so we can pool requests to the same domain */
const httpPool = new http.Agent({
  maxSockets: 256,
  keepAlive: true
});

/**
 * Service responsible to crawl the page. Load the page & parse with cheerio (server side jquery). Converts the
 * result to a Page object.
 */
class PageCrawlService {
  /**
   * Crawl the page of a given URL. Get some data and convert to a Page object.
   * @param url {String}
   * @returns {Promise<Page>}
   */
  static async crawlPage(url) {
    try {
      const { statusCode, requestTime, page: rawPage } = await this.getPage(url);
      const page = this.getCheerioPage(rawPage);
      const links = this.getLinksFromPage(page);
      const pageSize = this.getPageSize(rawPage);
      return new Page(null, url, statusCode, requestTime, links, pageSize);
    } catch ({ error, statusCode }) {
      return new Page(error, url, statusCode);
    }
  }

  /**
   * Do a request to get the page.
   * @param url {String}
   * @returns {Promise<Object>} Contains page body & time to complete request.
   */
  static getPage(url) {
    return new Promise((resolve, reject) => {
      const parsedUrl = URL.parse(url);
      logger.log('Checking', url);
      const options = {
        timeout: REQUEST_TIMEOUT,
        time: true,
        headers: {
          Accept: 'application/json, text/plain, */*',
          'user-agent': 'Node.JS Web crawler'
        },
        agent: httpsPool
      };
      if (parsedUrl.protocol === 'http:') {
        options.agent = httpPool;
      }
      request(url, options, (err, response, body) => {
        if (err) {
          console.log('err');
          return reject({ error: `Failed to load page, error: ${err}` });
        }
        if (response.statusCode !== 200) {
          return reject({ error: `Invalid status code ${response.statusCode}`, statusCode: response.statusCode });
        }
        resolve({ requestTime: response.elapsedTime, statusCode: response.statusCode, page: body });
      });
    });
  }

  static getPageSize(page) {
    return page.length;
  }

  /**
   * Convert body of page to cheerio object, so we can use the Jquery api on that object.
   * @param page {String} Raw page
   * @returns {*} Cheerio object
   */
  static getCheerioPage(page) {
    return cheerio.load(page);
  }

  /**
   * Use the cheerio API to get all the links on the given page.
   * @param jqueryPage {Object}
   * @returns {Array}
   */
  static getLinksFromPage(jqueryPage) {
    const links = [];
    const linksOnPage = jqueryPage('a');
    jqueryPage(linksOnPage).map((i, link) => links.push(jqueryPage(link).attr('href')));
    return links.filter(item => item); // sometimes cheerio adds an undefined item.
  }
}

module.exports = PageCrawlService;
