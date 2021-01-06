// External requirements
const inquirer = require('inquirer');
const createMustach = require('mustache');
const createUtil = require('./util');

// Templates
const mainTemplate = `// Construct the timeline of your trial here
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
})`;
const classesTemplate = '// An empty file for you to specify any custom ' +
    'classes outside of the existing plugin files.';
const pluginTemplate = `jsPsych.plugins['{{name}}'] = (function(){

    var plugin = {};

    plugin.info = {
        name: '{{name}}',
        parameters: {
            // Define any parameters here. 
            // See the jsPsych documentation on how to use this field.
        }
    }

    plugin.trial = function(display_element, trial){
        // Write your JavaScript for the trial here.

        jsPsych.finishTrial();
    }

    return plugin;

})();`;
const configTemplate = `{
    "name": "{{name}}",
    "files": [
        { "src": "main.js" },
        { "src": "classes.js" },
        { "src": "plugin.js" }
    ]
}`;

// Collect all JavaScript templates
const javascriptTemplates = [
  {
    name: 'main.js',
    formatting: mainTemplate,
  },
  {
    name: 'classes.js',
    formatting: classesTemplate,
  },
  {
    name: 'plugin.js',
    formatting: pluginTemplate,
  },
];

/**
 * Initial prompt to collect information about the plugin.
 */
function start() {
  inquirer
      .prompt([
        {
          type: 'input',
          name: 'name',
          message: 'What is the name of your plugin?',
        },
      ])
      .then((answers: any) => {
        // Run the construct function
        construct(answers.name);
      })
      .catch((e: any) => {
        if (e.isTtyError) {
          console.log(createUtil.error('Prompt could not be rendered!'));
        } else {
          console.log(createUtil.error('Something unknown happened!'));
          console.log(createUtil.error(e));
        }
      });
}

/**
 * Main function to generate project layout using templates.
 * @param {string} name Name of the plugin to create.
 */
function construct(name: string) {
  // Create top-level directory
  createUtil.createDirectory(`${name}`);

  // Create assets directory
  createUtil.createDirectory(`${name}/assets`);

  // Create JavaScript directory
  createUtil.createDirectory(`${name}/src`);

  const templateData = {
    name: name,
  };

  // Create each of the files using the templates
  javascriptTemplates.forEach((file) => {
    const fileName = createMustach.render(file.name, templateData);
    const rendered = createMustach.render(file.formatting, templateData);
    createUtil.createFile(`./${name}/src/${fileName}`, rendered);
  });

  // Create the configuraiton file
  const rendered = createMustach.render(configTemplate, templateData);
  createUtil.createFile(`./${name}/psygo.config.json`, rendered);
}

module.exports = {
  start,
};
