const winston = require('winston');

winston.add(new winston.transports.Console({
  format: winston.format.simple()
}));
class Logger {
  static log(...args) {
    if (this.mute) return;
    winston.info(this.constructMessage(...args));
  }

  static error(...args) {
    if (this.mute) return;
    winston.error(this.constructMessage(...args));
  }

  static constructMessage(...args) {
    const message = [`Url-Scraper-${process.pid}`, ...args].reduce((a, b) => a.concat(b), []);
    return Array.prototype.slice.call(message, 0).join(' ');
  }
}

module.exports = Logger;
