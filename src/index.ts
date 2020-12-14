#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');

clear();
console.log(
    chalk.green(
        figlet.textSync('psygo', { horizontalLayout: 'full' })
    )
);

program
    .version('1.0.0')
    .description('The easiest way to get started creating jsPsych plugins!')
    // .option('-o, --option', 'Demo option')
    .parse(process.argv);