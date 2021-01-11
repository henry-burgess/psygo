// External requirements
const buildMustache = require('mustache');
const buildUnzipper = require('unzipper');
const buildFS = require('fs');
const {exec} = require('child_process');

// Internal requirements
const buildUtil = require('./util');
const buildConfig = require('./configuration');

// Constants
const jspsychVersion = '6.2.0';
const localLocation = `./local`;
const sourceLocation = './src';
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
  const url = `https://github.com/jspsych/jsPsych/releases/download/` +
    `v${jspsychVersion}/jspsych-${jspsychVersion}.zip`;
  console.log(buildUtil.info(`Obtaining jsPsych v${jspsychVersion}` +
    `from '${url}'.`));

  // Download jsPsych archive to js/temp directory and extract to js/jspsych
  buildUtil.createDirectory(javascriptLocation);
  buildUtil.createDirectory(downloadLocation);
  buildUtil.downloadFile(url, `${downloadLocation}/jspsych.zip`, function() {
    console.log(buildUtil.info(`Extracting ` +
      `'${downloadLocation}/jspsych.zip'...`));
    buildFS.createReadStream(`${downloadLocation}/jspsych.zip`)
        // eslint-disable-next-line new-cap
        .pipe(buildUnzipper.Extract({path: `${javascriptLocation}/jspsych`}))
        .on('finish', () => {
          console.log(buildUtil.success(`Extracted '` +
            `${downloadLocation}/jspsych.zip'.`));

          // Delete temp directory along with contents
          buildFS.rmdirSync(downloadLocation, {recursive: true});
        })
        .on('error', (e: any) => {
          console.log(buildUtil.error(`Error extracting '` +
            `${downloadLocation}/jspsych.zip'!`));
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
  buildUtil.createDirectory(localLocation);

  // Install jsPsych
  // Check if jsPsych folder exists, otherwise download and place jsPsych.
  if (buildUtil.directoryExists(`${localLocation}/js/jspsych`)) {
    console.log(buildUtil.info(`jsPsych installation found, ` +
      `skipping jsPsych installation.`));
  } else {
    console.log(buildUtil.info(`jsPsych installation not detected, ` +
      `installing version ${jspsychVersion}.`));
    installLibraries();
  }

  // Create index.html
  createHead(localLocation);

  // Copy over JavaScript to js directory
  installSourceCode();

  // Run the live server
  startLocal();
}

/**
 * Starts a local server instance.
 */
function startLocal() {
  console.log(buildUtil.info(`Running web server @ http://127.0.0.1:8080`));
  exec(`http-server ${localLocation}`,
      (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.log(buildUtil.error(error.message));
          return;
        }
        if (stderr) {
          console.log(buildUtil.error(stderr));
          return;
        }
      });
}

/**
 * Install the source code into the local instance.
 */
function installSourceCode() {
  const configuration = buildConfig.loadConfiguration(
      buildUtil.CONFIGURATION_LOCATION);

  // Move general files
  configuration.files.forEach((file: any) => {
    const oldPath = `${sourceLocation}/${file.src}`;
    const newPath = `${javascriptLocation}/${file.src}`;
    buildUtil.moveFile(oldPath, newPath, false);
  });
}

/**
 * Creates the header HTML file in the desired directory.
 * @param {string} path Location of the HTML file.
 */
function createHead(path: string) {
  const configuration = buildConfig.loadConfiguration(
      buildUtil.CONFIGURATION_LOCATION);

  // Create HTML file
  const headTemplateData = {
    name: configuration.name,
    libraries: [
      {src: 'jspsych/jspsych.js'},
      {src: 'jspsych/plugins/jspsych-instructions.js'},
      {src: 'plugin.js'},
    ],
    styles: [
      {src: 'js/jspsych/css/jspsych.css'},
    ],
    classes: configuration.files,
  };
  const html = buildMustache.render(headTemplate, headTemplateData);
  buildUtil.createFile(`${path}/index.html`, html);
}

module.exports = {
  local,
};
