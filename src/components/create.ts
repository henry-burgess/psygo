// External requirements
const inquirer = require('inquirer');
const create_mustache = require('mustache');
const fetcher = require('node-fetch');
const create_util = require('./util');

// Templates
const main_template = `// Construct the timeline of your trial here
let timeline = []

// Instructions for your participants to follow
let instruction_html = "<p><b>Instructions</b></p>" +
    "<p>The objective of this task is to...</p>"

timeline.push({
    type: 'instructions',
    pages: [
        instruction_html
    ],
    show_clickable_nav: true
})

// Initialise and run the jsPsych trials
jsPsych.init({
    timeline: timeline,
    display_element: 'jspsych-target'
})`
const classes_template = `// An empty file for you to specify any custom classes outside of the existing plugin files.`
const jspsych_plugin_template = `jsPsych.plugins[{{name}}] = (function(){

    var plugin = {};

    plugin.info = {
        name: {{name}},
        parameters: {
            // Define any parameters here. See the jsPsych documentation on how to use this field.
        }
    }

    plugin.trial = function(display_element, trial){
        // Write your JavaScript for the trial here.

        jsPsych.finishTrial();
    }

    return plugin;

})();`
const config_template = `module.exports = {
    name: {{name}}
}`

// Collect all JavaScript templates
let javascript_templates = [
    {
        name: "main.js",
        formatting: main_template
    },
    {
        name: "classes.js",
        formatting: classes_template
    },
    {
        name: "jspsych-plugin.js",
        formatting: jspsych_plugin_template
    },
    {
        name: "psygo.config.js",
        formatting: config_template
    }
]

/**
 * Initial prompt to collect information about the plugin.
 */
function start() {
    inquirer
        .prompt([
            { 
                type: "input",
                name: "name",
                message: "What is the name of your plugin?"
            }
        ])
        .then((answers: any) => {
            // Run the construct function
            construct(answers.name);
        })
        .catch((e: any) => {
            if (e.isTtyError) {
                console.log(create_util.error("Prompt could not be rendered!"));
            } else {
                console.log(create_util.error("Something unknown happened!"));
                console.log(create_util.error(e));
            }
        })
}

/**
 * Main function to generate project layout using templates.
 * @param name Name of the plugin to create.
 */
function construct(name: string) {
    // Create top-level directory
    create_util.create_directory(`${name}`);

    // Create assets directory
    create_util.create_directory(`${name}/assets`);

    let template_data = {
        name: name
    };

    // Create each of the files using the templates
    javascript_templates.forEach(file => {
        let rendered = create_mustache.render(file.formatting, template_data);
        create_util.create_file(`./${name}/${file.name}`, rendered);
    });
}

module.exports = {
    start,
}