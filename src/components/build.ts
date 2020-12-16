// External requirements
const build_mustache = require('mustache');

// Internal requirements
const build_util = require('./util');

// Constants
const jspsych_version = "6.2.0";
const local_location = `./local`
const javascript_location = `${local_location}/js`;
const temp_download_location = `${javascript_location}/temp`;

// Templates
const head_template = `<!DOCTYPE html>
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

/**
 * Function to download and install jsPsych library.
 */
function install_jspsych() {
    let url = `https://github.com/jspsych/jsPsych/releases/download/v${jspsych_version}/jspsych-${jspsych_version}.zip`;
    console.log(build_util.info(`Obtaining jsPsych v${jspsych_version} from '${url}'.`));
    
    // Download jsPsych archive to js/temp directory
    build_util.create_directory(javascript_location);
    build_util.create_directory(temp_download_location);
    build_util.download_file(url, `${temp_download_location}/jspsych.zip`);

    // TODO: extract archive to js/jspsych

    // TODO: delete archive and js/temp directory
}

/**
 * Executed on command 'psygo start'. Copies files into 'local' directory such that plugin can be tested locally in a browser.
 */
function local() {
    // Create 'local' directory for copying files into.
    let local_path = `./local`;
    build_util.create_directory(local_path);

    // Install jsPsych
    // Check if jsPsych folder exists, otherwise download and place jsPsych.
    if (build_util.directory_exists(`${local_path}/js/jspsych`)) {
        console.log(build_util.info(`jsPsych installation found, skipping jsPsych installation.`));
    } else {
        console.log(build_util.info(`jsPsych installation not detected, installing version ${jspsych_version}.`));
        install_jspsych();
    }

    // Create HTML file

}

/**
 * Starts a local server instance.
 */
function start_local() {
    // TODO: write this function
}

/**
 * Install the custom plugin into a jsPsych instance.
 * @param plugin_name Name of the custom plugin to install.
 */
function install_plugin(plugin_name: string) {
    // TODO: write this function
}

/**
 * Creates the header HTML file in the desired directory.
 * @param path Location of the HTML file.
 */
function create_head(path: string) {
    // TODO: write this function
}

module.exports = {
    local,
}