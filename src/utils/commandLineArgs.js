const logger = require('./logger');

const cmdArgs = process.argv;

class CommandLineArgsUtils {
  static getUrlArg() {
    for (const arg of cmdArgs) {
      if (arg.indexOf(`--url=`) > -1) {
        return arg.split('=')[1];
      }
    }
    return null;
  }

  static showUsage() {
    logger.log(`Please run with args "--url=http://example.com"`);
  }
}

module.exports = CommandLineArgsUtils;
