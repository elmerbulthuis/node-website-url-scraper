const request = require('request');
const URL = require('url');
const robotsParser = require('robots-parser');
const logger = require('./logger');

let robots = null;

/**
 * This class is responsible for loading the robots.txt from a given website, and returns a public API to validate if
 * crawled URL's are allowed to be crawled.
 */
class RobotsUrlChecker {
  /**
   * Load the robots.txt from the page. If it's missing, we allow everyting to be crawled.
   * @param url {String}
   * @returns {Promise<>}
   */
  static async loadRobots(url) {
    logger.log(`Checking for robots.txt`);
    const parsedUrl = URL.parse(url);
    parsedUrl.pathname = '/robots.txt';
    const robotsUrl = URL.format(parsedUrl);
    try {
      const result = await this.getRobotsTxtFileFromUrl(robotsUrl);
      robots = robotsParser(robotsUrl, result);
      logger.log(`Robots.txt loaded.`);
    } catch (robotsGetErr) {
      logger.error(`Couldn't get robots.txt from ${robotsUrl}`);
    }
  }

  /**
   * Validate if a given URL is valid according to robots.txt configuration. If the robots.txt couldn't be fetched
   * allow all urls.
   * @param url {String}
   * @returns {Boolean}
   */
  static isUrlAllowedAccordingToRobots(url) {
    if (!robots) {
      return true;
    }
    return robots.isAllowed(url);
  }

  /**
   * Load robots.txt from website.
   * @param url {String}
   * @returns {Promise<String>}
   */
  static getRobotsTxtFileFromUrl(url) {
    return new Promise((resolve, reject) => {
      request.get(url, (err, response, body) => {
        if (err) {
          reject(err);
        } else if (response.statusCode === 200) {
          resolve(body);
        } else {
          reject(`Robots.txt not found, statusCode: ${response.statusCode}`);
        }
      });
    });
  }
}

module.exports = RobotsUrlChecker;
