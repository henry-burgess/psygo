<h1> psygo 🧠 </h1>

The easiest way to get started creating plugins for jsPsych! psygo is a Node CLI tool that streamlines the development of custom jsPsych plugins. psygo allows you to test your plugin locally, with the ability to export the plugin for local administration or administration via the jsPsych-friendly Gorilla platform. All the hard work is done for you, from setting up a project, to preparing it for administration.

## Requirements & Installation

psygo requires Node.js v14+, available [here](https://nodejs.org/). Once Node.js has been installed, psygo can be installed using npm.

```bash
npm install -g psygo
```

## Usage

### Creating a new plugin

To create a new plugin, open a terminal and call:
```bash
psygo create
```
You will then be prompted for a plugin name. After providing a plugin name, psygo will create a new sub-directory with the following structure:

```
    ./<plugin-name>/
      |-- assets/
      |-- src/
            |-- main.js
            |-- classes.js
            |-- plugin.js
      |-- psygo.config.json
```

*src/main.js*: Constructs the timeline of jsPsych. Also contains the `jsPsych.init( ... );` function call.

*src/classes.js*: An optional file that should contain any additional classes or functions you wish to define outside `main.js`.

*src/plugin.js*: The core plugin file that contains the plugin pre-amble described in the jsPsych documentation, trial parameters, and the `plugin.trial` function.

*psygo.config.js*: Configuration file for psygo. Used in the export process.

*assets/*: A dedicated folder for placing graphics in.

### Start

To test the plugin locally, open a terminal, navigate to a folder containing all the plugin files and `psygo.config.js` and call:
```bash
psygo start
```

This will update the directory structure of your project to the following:
```
    ./<plugin-name>/
      |-- assets/
      |-- local/
            |-- js/
                  |-- jspsych/...
                  |-- classes.js
                  |-- main.js
                  |-- plugin.js
            |-- index.html
      |-- src/
            |-- main.js
            |-- classes.js
            |-- plugin.js
      |-- psygo.config.json
```

All files in the `local` directory are then served at [http://127.0.0.1:8080](http://127.0.0.1:8080) and allows you to try out your plugin!