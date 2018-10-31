const Page = require('../models/Page');
const taskService = require('../services/taskService');

/**
 * This static class is responsible for creating some reporting on the result. Passed is an Array<Objects>. Returned is
 * an Object with the reporting in it.
 */
class ReportingService {
  /**
   * Create report for the given page result, which is first converted to a page. (Local storage converts the page
   * from a Page object to a normal Object for storage.
   * @param pages {Array<Object>}
   * @returns {Object}
   */
  static getReport(pages) {
    pages = pages.map(({ value: page }) => Page.createNewPageFromObject(page));
    const workingPages = this.getWorkingPages(pages);
    const failedPages = this.getFailedPages(pages);

    return {
      workingPages: {
        count: workingPages.length,
        avgPageLoadTimeInMS: this.getAverageLoadTime(workingPages),
        avgPageSizeInBytes: this.getAveragePageSize(workingPages),
        avgLinksOnPage: this.getAverageLinksOnPage(workingPages),
        totalExternalLinks: this.getTotalExternalLinks(workingPages),
        totalInternalLinks: this.getTotalInternalLinks(workingPages)
      },
      failedPages: {
        count: failedPages.length,
        failedPagesResponseCodeHistogram: this.getFailedPagesStatusCodes(failedPages)
      },
      percentageWorking: `${this.getWorkingPercentage(workingPages.length, failedPages.length)}%`
    };
  }

  /**
   * Get percentage of the amount of pages that loaded successfully.
   * @param workingPagesCount {Number}
   * @param failedPagesCount {Number}
   * @returns {Number}
   */
  static getWorkingPercentage(workingPagesCount, failedPagesCount) {
    const failedPercentage = parseFloat(failedPagesCount / workingPagesCount * 100);
    return parseFloat((100 - failedPercentage).toFixed(2));
  }

  static getWorkingPages(pages) {
    return pages.filter(this.workingPagesFilter);
  }

  static getFailedPages(pages) {
    return pages.filter(this.failedPagesFilter);
  }

  static getAverageLoadTime(pages) {
    const totalLoadTime = pages.reduce((total, page) => total + page.getRequestTime(), 0);
    return this.getAvg(totalLoadTime, pages.length);
  }

  static getAveragePageSize(pages) {
    const totalPageSizes = pages.reduce((total, page) => total + page.getPageSize(), 0);
    return this.getAvg(totalPageSizes, pages.length);
  }

  static getAverageLinksOnPage(pages) {
    const totalPageLinks = pages.reduce((total, page) => total + page.getLinks().length, 0);
    return this.getAvg(totalPageLinks, pages.length);
  }

  /**
   * Get the amount of links on the pages that point to an external website.
   * @param pages {Array<Page>}
   * @returns {Number}
   */
  static getTotalExternalLinks(pages) {
    return pages.reduce((total, page) => total + page.getLinks()
      .filter(
        this.externalDomainFilter.bind(this, page.getUrl())
      ).length, 0);
  }

  /**
   * Get the amount of links on the pages that point an internal page.
   * @param pages {Array<Page>}
   * @returns {Number}
   */
  static getTotalInternalLinks(pages) {
    return pages.reduce((total, page) => total + page.getLinks()
      .filter(
        this.internalDomainFilter.bind(this, page.getUrl())
      ).length, 0);
  }

  /**
   * Create a histogram for the failed pages and what their statusCodes were.
   * @param pages {Array<Page>}
   * @returns {Object} eg: { 404: 10, 301: 2}
   */
  static getFailedPagesStatusCodes(pages) {
    const statusCodes = {};
    pages.forEach((page) => {
      const statusCode = page.getStatusCode();
      if (!statusCode) {
        statusCodes.noStatusCode = statusCodes.noStatusCode ? statusCodes.noStatusCode += 1 : 1;
      } else {
        statusCodes[statusCode] = statusCodes[statusCode] ? statusCodes[statusCode] += 1 : 1;
      }
    });
    return statusCodes;
  }

  static getAvg(total, itemCount) {
    return parseInt(total / itemCount, 0);
  }

  static failedPagesFilter(page) {
    return page.pageErr;
  }

  static workingPagesFilter(page) {
    return !page.pageErr;
  }

  /**
   * Filter function to filter external domains for an array.
   * @param pageUrl {String}
   * @param linkUrl {String}
   * @returns {boolean}
   */
  static externalDomainFilter(pageUrl, linkUrl) {
    return !taskService.ensureSameDomain(taskService.getCompleteTaskUrl(pageUrl, linkUrl), pageUrl);
  }

  /**
   * Filter function to filter inter pages for an array.
   * @param pageUrl {String}
   * @param linkUrl {String}
   * @returns {boolean}
   */
  static internalDomainFilter(pageUrl, linkUrl) {
    return taskService.ensureSameDomain(taskService.getCompleteTaskUrl(pageUrl, linkUrl), pageUrl);
  }
}

module.exports = ReportingService;
