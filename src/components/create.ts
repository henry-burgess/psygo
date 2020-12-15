const inquirer = require('inquirer');

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
            console.log(answers);
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

}

module.exports = {
    start
}