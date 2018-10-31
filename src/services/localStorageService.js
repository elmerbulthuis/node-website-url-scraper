const localStorage = require('store');

/**
 * Layer for handling local storage. Currently it's a memory store.
 */
class LocalStorageService {
  /**
   * Add item to the storage
   * @param key {String}
   * @param value {Object}
   */
  static addItem(key, value) {
    localStorage.set(key, value);
  }

  /**
   * Get item from storage based on key
   * @param key {String}
   * @returns {Object}
   */
  static getItem(key) {
    return localStorage.get(key);
  }

  /**
   * Storage has a unique loop function. Create a memory clone of the items and filter empty items, if any.
   * @returns {Array<Object>}
   */
  static getAll() {
    const items = [];
    localStorage.each((value, key) => {
      if (key && value && Object.keys(value).length > 0) { // filter empty storage items
        items.push({ key, value });
      }
    });
    return items;
  }
}

module.exports = LocalStorageService;
