// External requirements
const build_mustache = require('mustache');
const build_unzipper = require('unzipper');
const build_fs = require('fs');

// Internal requirements
const build_util = require('./util');
const build_config = require('./configuration');

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
</html>`

/**
 * Function to download and install jsPsych library.
 */
function install_jspsych() {
    let url = `https://github.com/jspsych/jsPsych/releases/download/v${jspsych_version}/jspsych-${jspsych_version}.zip`;
    console.log(build_util.info(`Obtaining jsPsych v${jspsych_version} from '${url}'.`));
    
    // Download jsPsych archive to js/temp directory and extract to js/jspsych
    build_util.create_directory(javascript_location);
    build_util.create_directory(temp_download_location);
    build_util.download_file(url, `${temp_download_location}/jspsych.zip`, function() {
        console.log(build_util.info(`Extracting '${temp_download_location}/jspsych.zip'...`));
        build_fs.createReadStream(`${temp_download_location}/jspsych.zip`)
            .pipe(build_unzipper.Extract({ path: `${javascript_location}/jspsych` }))
            .on("finish", () => {
                console.log(build_util.success(`Extracted '${temp_download_location}/jspsych.zip'.`));

                // Delete temp directory along with contents
                build_fs.rmdirSync(temp_download_location, { recursive: true });
            })
            .on("error", (e: any) => {
                console.log(build_util.error(`Error extracting '${temp_download_location}/jspsych.zip'!`));
                console.log(build_util.error(e));
            });
    });
}

/**
 * Executed on command 'psygo start'. Copies files into 'local' directory such that plugin can be tested locally in a browser.
 */
function local() {
    // Create 'local' directory for copying files into.
    build_util.create_directory(local_location);

    // Install jsPsych
    // Check if jsPsych folder exists, otherwise download and place jsPsych.
    if (build_util.directory_exists(`${local_location}/js/jspsych`)) {
        console.log(build_util.info(`jsPsych installation found, skipping jsPsych installation.`));
    } else {
        console.log(build_util.info(`jsPsych installation not detected, installing version ${jspsych_version}.`));
        install_jspsych();
    }

    // Create index.html
    create_head(local_location);

    // Copy over JavaScript to js directory
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
    let configuration = build_config.load_config(build_util.default_configuration_location);

    // Create HTML file
    let head_template_data = {
        name: configuration.name,
        libraries: [
            { src: "jspsych/jspsych.js" }
        ],
        styles: [
            { src: "js/jspsych/css/jspsych.css" }
        ],
        classes: configuration.files,
    }
    let html = build_mustache.render(head_template, head_template_data);
    build_util.create_file(`${path}/index.html`, html);
}

module.exports = {
    local,
}