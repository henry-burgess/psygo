#!/usr/bin/env node

// External requirements
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');

// Internal requirements
const create = require('./components/create');
const build = require('./components/build');
const invoke_util = require('./components/util');

// Program information
program
    .version('1.0.0')
    .option('-d, --dir <path>', 'specify the directory to create the project');

// Create a new plugin
program
    .command('create')
    .description('create a new jsPsych plugin')
    .action(function() {
        create.start()
    });

// Build a plugin for local development
program
    .command('start')
    .description('build the jsPsych plugin for local development and testing')
    .action(function() {
        if (invoke_util.valid_invokation("start")) {
            build.local();
        } else {
            console.log(invoke_util.error(`Not a psygo directory!`));
        }
    });

// Build a plugin for Gorilla deployment
program
    .command('export')
    .description('export the jsPsych plugin for usage on Gorilla')
    .action(function() {
        if (invoke_util.valid_invokation("export")) {
            // build.deploy();
        } else {
            console.log(invoke_util.error(`Not a psygo directory!`));
        }
    });

program.parse(process.argv);