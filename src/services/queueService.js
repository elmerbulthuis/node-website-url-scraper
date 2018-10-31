const queue = [];

/**
 * Simple single threaded queue for tasks.
 */
class QueueService {
  /**
   * Add task to queue
   * @param task {Task}
   */
  static addTask(task) {
    queue.push(task);
  }

  /**
   * Get (x) tasks from queue. Default param set to 1.
   * @param amountOfTasks {number}
   * @returns {Array<Task>}
   */
  static getTasks(amountOfTasks = 1) {
    if (queue.length > 0) {
      amountOfTasks = queue.length > amountOfTasks ? amountOfTasks : queue.length;
      return queue.splice(0, amountOfTasks);
    }
    return [];
  }

  static getQueueLength() {
    return queue.length;
  }

  /**
   * Find task in queue, compare by URL (key)
   * @param task {Task}
   * @returns {boolean}
   */
  static findTask(task) {
    for (const queueTask of queue) {
      if (queueTask.getUrl() === task.getUrl()) {
        return queueTask;
      }
    }
    return null;
  }
}

module.exports = QueueService;
