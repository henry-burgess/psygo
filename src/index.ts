#!/usr/bin/env node

// External requirements
const program = require('commander');

// Internal requirements
const create = require('./components/create');
const build = require('./components/build');
const invokeUtil = require('./components/util');

// Program information
program
    .version('1.0.1');

// Create a new plugin
program
    .command('create')
    .description('create a new jsPsych plugin')
    .action(function() {
      create.start();
    });

// Build a plugin for local development
program
    .command('start')
    .description('build the jsPsych plugin for local development and testing')
    .action(function() {
      if (invokeUtil.validInvokation('start')) {
        build.local();
      } else {
        console.log(invokeUtil.error(`Not a psygo directory!`));
      }
    });

program.parse(process.argv);
