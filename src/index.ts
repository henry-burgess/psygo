#!/usr/bin/env node

// Main file, handles invokation

// External requirements
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');

// Class requirements
const create = require('./components/create');
const build = require('./components/build');

// Program information
program
    .version('1.0.0')
    .option('-d, --dir <path>', 'specify the directory to create the project');

// Create a new plugin
program
    .command('create <name>')
    .description('create a new jsPsych plugin')
    .action(function(name: any, options: any) {
        create.start()
    });

// Build a plugin for local development
program
    .command('local')
    .description('build the jsPsych plugin for local development and testing')
    .action(function() {
        
    });

// Build a plugin for Gorilla deployment
program
    .command('deploy')
    .description('deploy the jsPsych plugin for usage on Gorilla')
    .action(function() {
        
    });

program.parse(process.argv);