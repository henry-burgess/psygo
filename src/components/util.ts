const chalk = require('chalk');

// Chalk formatting
const success = chalk.keyword('green');
const warning = chalk.keyword('yellow');
const error = chalk.bold.red;

module.exports = {
    success,
    warning,
    error
}