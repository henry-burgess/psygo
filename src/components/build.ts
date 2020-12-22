// External requirements
const buildMustache = require('mustache');
const buildUnzipper = require('unzipper');
const buildFS = require('fs');

// Internal requirements
const buildUtil = require('./util');
const buildConfig = require('./configuration');

// Constants
const jspsychVersion = '6.2.0';
const localLocation = `./local`;
const javascriptLocation = `${localLocation}/js`;
const downloadLocation = `${javascriptLocation}/temp`;

// Templates
const headTemplate = `<!DOCTYPE html>
<html lang="en">
    <head>
        <title>{{name}}</title>
        {{#libraries}}
        <script src="js/{{{src}}}"></script>
        {{/libraries}}
        {{#styles}}
        <link href="{{{src}}}" rel="stylesheet" type="text/css">
        {{/styles}}
    </head>
    <body>
        <div id="jspsych-target"></div>
    </body>
    {{#classes}}
    <script src="js/{{{src}}}"></script>
    {{/classes}}
</html>`;

/**
 * Function to download and install jsPsych library.
 */
function installLibraries() {
  const url = `https://github.com/jspsych/jsPsych/releases/download/v
    ${jspsychVersion}/jspsych-${jspsychVersion}.zip`;
  console.log(buildUtil.info(`Obtaining jsPsych v${jspsychVersion}
    from '${url}'.`));

  // Download jsPsych archive to js/temp directory and extract to js/jspsych
  buildUtil.createDirectory(javascriptLocation);
  buildUtil.createDirectory(downloadLocation);
  buildUtil.downloadFile(url, `${downloadLocation}/jspsych.zip`, function() {
    console.log(buildUtil.info(`Extracting '
      ${downloadLocation}/jspsych.zip'...`));
    buildFS.createReadStream(`${downloadLocation}/jspsych.zip`)
        .pipe(buildUnzipper.Extract({path: `${javascriptLocation}/jspsych`}))
        .on('finish', () => {
          console.log(buildUtil.success(`Extracted '
            ${downloadLocation}/jspsych.zip'.`));

          // Delete temp directory along with contents
          buildFS.rmdirSync(downloadLocation, {recursive: true});
        })
        .on('error', (e: any) => {
          console.log(buildUtil.error(`Error extracting '
            ${downloadLocation}/jspsych.zip'!`));
          console.log(buildUtil.error(e));
        });
  });
}

/**
 * Executed on command 'psygo start'.
 * Copies files into 'local' directory such that plugin can be
 * tested locally in a browser.
 */
function local() {
  // Create 'local' directory for copying files into.
  buildUtil.create_directory(localLocation);

  // Install jsPsych
  // Check if jsPsych folder exists, otherwise download and place jsPsych.
  if (buildUtil.directory_exists(`${localLocation}/js/jspsych`)) {
    console.log(buildUtil.info(`jsPsych installation found, 
      skipping jsPsych installation.`));
  } else {
    console.log(buildUtil.info(`jsPsych installation not detected, 
      installing version ${jspsychVersion}.`));
    installLibraries();
  }

  // Create index.html
  createHead(localLocation);

  // Copy over JavaScript to js directory
}

/**
 * Starts a local server instance.
 */
function startLocal() {
  // TODO: write this function
}

/**
 * Install the custom plugin into a jsPsych instance.
 * @param {string} pluginName Name of the custom plugin to install.
 */
function installPlugin(pluginName: string) {
  // TODO: write this function
}

/**
 * Creates the header HTML file in the desired directory.
 * @param {string} path Location of the HTML file.
 */
function createHead(path: string) {
  const configuration = buildConfig.loadConfiguration(
      buildUtil.defaultConfigurationLocal);

  // Create HTML file
  const headTemplateData = {
    name: configuration.name,
    libraries: [
      {src: 'jspsych/jspsych.js'},
    ],
    styles: [
      {src: 'js/jspsych/css/jspsych.css'},
    ],
    classes: configuration.files,
  };
  const html = buildMustache.render(headTemplate, headTemplateData);
  buildUtil.create_file(`${path}/index.html`, html);
}

module.exports = {
  local,
};
