const cmdLineArgsUtils = require('./utils/commandLineArgs');
const Worker = require('./worker');
const reportingService = require('./services/reportingService');
const localStorageService = require('./services/localStorageService');
const logger = require('./utils/logger');

main();

/**
 * Get application arguments and start crawling.
 */
function main() {
  const url = cmdLineArgsUtils.getUrlArg();
  if (!url) {
    return cmdLineArgsUtils.showUsage();
  }
  startWorker(url);
}

/**
 * Create new worker and start with the given URL. Keep track of total crawling time.
 * @param url {String}
 */
function startWorker(url) {
  const startTime = new Date();
  const worker = new Worker(url);
  worker.startCrawling().then(() => {
    const totalCrawlTime = parseInt(((new Date() - startTime) / 1000), 0);
    printStatistics(totalCrawlTime);
  });
}

/**
 * Print status of crawl job.
 * @param totalCrawlSeconds {Number}
 */
function printStatistics(totalCrawlSeconds) {
  const report = reportingService.getReport(localStorageService.getAll());
  logger.log(`Finished crawling. It took ${totalCrawlSeconds} seconds`);
  logger.log(`Result: ${JSON.stringify(report, null, 3)}`);
}
