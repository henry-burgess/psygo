// External requirements
const configFS = require('fs');

// Internal requirements
const configUtil = require('./util');

/**
 * Load a configuration file
 * @param {string} path the path to the configuration file
 * @return {JSON}
 */
function loadConfiguration(path: string) {
  console.log(configUtil.info(`Loading configuration module '${path}'.`));
  try {
    return JSON.parse(configFS.readFileSync(path, 'utf8'));
  } catch (error) {
    console.log(configUtil.error(`Could not read ` +
    `configuration file '${path}'!`));
  }
}

module.exports = {
  loadConfiguration,
};
