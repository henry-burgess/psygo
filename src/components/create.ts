const inquirer = require('inquirer');
const mustache = require('mustache');
const fs = require('fs');
const fetcher = require('node-fetch');

const main_template = `
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
const jspsych_plugin_template = `
jsPsych.plugins[{{name}}] = (function(){

    var plugin = {};

    plugin.info = {
        name: {{name}},
        parameters: {

        }
    }

    plugin.trial = function(display_element, trial){
    jsPsych.finishTrial();
    }

    return plugin;

})();`
const config_template = `
module.exports = {
    name: {{name}}
}`
const head_template = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>{{name}}</title>
        {{#libraries}}
        <script src="js/{{src}}"></script>
        {{/libraries}}
        {{#styles}}
        <link href="{{src}}" rel="stylesheet" type="text/css">
        {{/styles}}
    </head>
    <body>
        <div id="jspsych-target"></div>
    </body>
    {{#classes}}
    <script src="js/{{src}}"></script>
    {{/classes}}
</html>`

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
        .catch((error: any) => {
            if (error.isTtyError) {
                console.error("Prompt could not be rendered!");
            } else {
                console.error("Something unknown happened!");
                console.error(error);
            }
        })
}

/**
 * Main function to generate project layout using templates.
 * @param name Name of the plugin to create.
 */
function construct(name: string) {
    // Create top-level directory
    create_directory(name);

    // Create assets directory
    create_directory(`${name}/assets`);

    let template_data = {
        name: name
    };

    // Create each of the JavaScript files using the templates
    let rendered = mustache.render(classes_template, template_data);
    fs.writeFileSync(`./${name}/classes.js`, rendered);
}

/**
 * Create a new directory in the current working directory.
 * @param name The name of the new directory.
 */
function create_directory(name: string) {
    let dir = `./${name}`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    } else {
        console.warn(`Directory ${name} already exists!`);
    }
}

module.exports = {
    start
}