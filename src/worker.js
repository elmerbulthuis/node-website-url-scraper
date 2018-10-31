const localStorage = require('./services/localStorageService');
const queueService = require('./services/queueService');
const taskService = require('./services/taskService');
const pageCrawlService = require('./services/pageCrawlService');
const robotsUrlChecker = require('./utils/robotsUrlChecker');
const { BATCH_SIZE } = require('./config/config');

/**
 * Worker class, responsible for entire crawling job. Start with 1 tasks and continue to crawl until task queue is
 * empty. Keep track of results in local storage. Each successfully crawled page returns potential new pages. These
 * links are converted into tasks and added to the back of the queue.
 */
class Worker {
  /**
   * Constructor, which also adds the first task to the queue.
   * @param url {String}
   */
  constructor(url) {
    this.url = url;
    const firstTask = taskService.createNewTask(null, url); // First tasks does not have a parent url.
    queueService.addTask(firstTask);
  }

  /**
   * Load robots.txt (if present) and start crawling.
   * @returns {Promise<*>}
   */
  async startCrawling() {
    await robotsUrlChecker.loadRobots(this.url);
    return this.crawl();
  }

  /**
   * Recursive crawl batch of tasks (concurrently). If there are no more tasks, resolve.
   * @returns {Promise<>}
   */
  async crawl() {
    const taskBatch = queueService.getTasks(BATCH_SIZE);
    if (taskBatch.length === 0) {
      return Promise.resolve();
    }
    const promises = taskBatch.map(Worker.crawlPage);
    await Promise.all(promises);
    return this.crawl();
  }

  /**
   * Crawl single page, store result & start new jobs according the to links on that page.
   * @param task {Task}
   */
  static async crawlPage(task) {
    try {
      const pageResult = await pageCrawlService.crawlPage(task.getUrl());
      localStorage.addItem(task.getUrl(), pageResult);
      Worker.createNewTasks(task.getUrl(), pageResult.getLinks());
    } catch (errorPage) {
      localStorage.addItem(task.getUrl(), errorPage);
    }
  }

  /**
   * Create new tasks that are found on a page. The parent's page url is given, to validate that the url do not go
   * outside of the website. Convert a link to a task. Then check if we need to queue that tasks (check for duplicates)
   * @param parentUrl {String}
   * @param links {Array<String>}
   */
  static createNewTasks(parentUrl, links) {
    links.forEach((link) => {
      const task = taskService.createNewTask(parentUrl, link);
      if (task && taskService.validateTask(task, parentUrl)) {
        queueService.addTask(task);
      }
    });
  }
}

module.exports = Worker;
