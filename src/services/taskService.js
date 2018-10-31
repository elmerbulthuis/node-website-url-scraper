const URL = require('url');
const localStorageService = require('../services/localStorageService');
const queueService = require('../services/queueService');
const robotsUrlChecker = require('../utils/robotsUrlChecker');
const Task = require('../models/Task');

const { FILE_DOWNLOAD_URL_REGEX } = require('../config/config');

/**
 * This class is responsible for creating & validating the tasks.
 */
class TaskService {
  /**
   * Create new task, if the taskUrl does not have an host, complete the url by adding the host from the parent.
   * @param parentUrl {String}
   * @param taskUrl {String}
   * @returns {Task || null}
   */
  static createNewTask(parentUrl, taskUrl) {
    try {
      const parsedTaskUrl = URL.parse(taskUrl);
      if (!parentUrl) {
        return new Task(URL.format(parsedTaskUrl));
      }
      const parsedParentUrl = URL.parse(parentUrl);
      const newTaskUrl = this.getCompleteTaskUrl(parsedParentUrl, parsedTaskUrl);
      const fullTaskUrl = URL.format(newTaskUrl);
      return new Task(fullTaskUrl);
    } catch (e) {
      // ignore links that have parsing errors.
      return null;
    }
  }

  /**
   * Make sure the task url is complete, some urls are given as '/my/site/123', this by itself does not resolve
   * therefore we complete it with info from it's parent url which always has that info otherwise it couldn't have
   * resolved a web page.
   * @param parentUrl {Url || String}
   * @param taskUrl {Url || String}
   * @returns {Url}
   */
  static getCompleteTaskUrl(parentUrl, taskUrl) {
    parentUrl = this.ensureUrlObject(parentUrl);
    taskUrl = this.ensureUrlObject(taskUrl);
    // if the task does not have a host, copy the parent url and apply the task changes.
    if (!taskUrl.hostname) {
      parentUrl.search = taskUrl.search;
      parentUrl.path = taskUrl.path;
      parentUrl.query = taskUrl.query;
      parentUrl.pathname = taskUrl.pathname;
      parentUrl.href = taskUrl.href;
      return parentUrl;
    }

    return taskUrl;
  }

  /**
   * Make sure that the passed object is an Url object
   * @param url {Url || String}
   * @returns {Url}
   */
  static ensureUrlObject(url) {
    if (typeof url === 'string') {
      return URL.parse(url);
    }
    return url;
  }

  /**
   * Check if the task is allowed to queued. Check if we already processed the item (duplicate). Or the item is already
   * present in the queue (duplicate). Make sure the task has the same domain as the website we're crawling
   * from (no-external-urls-allowed). Do not crawl links that are download links (do-not-download-files)
   * Last but not least, check if we're allowed to crawl this url according to the
   * website's robot.txt
   * @param task {Task}
   * @param parentUrl {String}
   * @returns {Boolean}
   */
  static validateTask(task, parentUrl) {
    return !localStorageService.getItem(task.getUrl())
      && !queueService.findTask(task)
      && this.ensureSameDomain(task.getUrl(), parentUrl)
      && !this.checkForDownloadUrls(task)
      && robotsUrlChecker.isUrlAllowedAccordingToRobots(task.getUrl());
  }

  /**
   * Check if the url is a link for some file to download.
   * @param task {Task}
   * @returns {boolean}
   */
  static checkForDownloadUrls(task) {
    const result = FILE_DOWNLOAD_URL_REGEX.test(task.getUrl());
    FILE_DOWNLOAD_URL_REGEX.lastIndex = 0;
    return result;
  }

  /**
   * Make sure the task url is of the same domain as the parent's url
   * @param taskUrl {String}
   * @param parentUrl {String}
   * @returns {boolean}
   */
  static ensureSameDomain(taskUrl, parentUrl) {
    const parsedParentUrl = URL.parse(parentUrl);
    const parsedTaskUrl = URL.parse(taskUrl);
    return parsedParentUrl.host.replace('www.', '') === parsedTaskUrl.host.replace('www.', '');
  }
}

module.exports = TaskService;
