const jspsych_version = "6.2.0";
const build_util = require('./util');

function install_jspsych() {
    // Function to download jspsych
    let url = `https://github.com/jspsych/jsPsych/releases/download/v${jspsych_version}/jspsych-${jspsych_version}.zip`;
    console.log(build_util.info(`Obtaining jsPsych v${jspsych_version} from '${url}'.`));
}


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

}

/**
 * Install the custom plugin into a jsPsych instance.
 * @param plugin_name Name of the custom plugin to install.
 */
function install_plugin(plugin_name: string) {

}

module.exports = {
    local,
}