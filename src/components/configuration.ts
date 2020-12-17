// External requirements
const config_fs = require('fs');

// Internal requirements
const config_util = require('./util');

function load_config(path: string) {
    console.log(config_util.info(`Loading configuration module '${path}'.`));
    return JSON.parse(config_fs.readFileSync(path, 'utf8'));
}

module.exports = {
    load_config,
}