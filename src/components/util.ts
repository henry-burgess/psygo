// External requirements
const chalk = require('chalk');
const fs = require('fs');
const request = require('request');

// Internal requirements

// Constants
const CONFIGURATION_LOCATION = './psygo.config.json';

// Chalk formatting
const success = chalk.keyword('green');
const info = chalk.keyword('blue');
const warning = chalk.keyword('yellow');
const error = chalk.bold.red;

/**
 * Create a new directory in the current working directory.
 * @param {string} path  The name of the new directory.
 */
function createDirectory(path: string) {
  if (!fs.existsSync(`${path}`)) {
    try {
      fs.mkdirSync(`${path}`);
      console.log(success(`Created directory '${path}'.`));
    } catch (e) {
      console.log(error(`Error creating directory '${path}'.`));
      console.log(error(e));
    }
  } else {
    console.log(warning(`Directory '${path}' already exists!`));
  }
}

/**
 * Utility function to determine if a path currently exists.
 * @param {string} path Path to check if exists.
 * @return {boolean} true if directory exists, false if not.
 */
function directoryExists(path: string) {
  return fs.existsSync(path);
}

/**
 * Utility function to create a new file at a specified path with defined
 * contents.
 * @param {string} path The path to the file, including the filename.
 * @param {string} contents The contents to be written to the file.
 */
function createFile(path: string, contents: string) {
  try {
    fs.writeFileSync(`${path}`, contents);
    console.log(success(`Created file '${path}'.`));
  } catch (e: any) {
    console.log(error(`Error creating file '${path}'.`));
    console.log(error(e));
  }
}

/**
 * Utility function to determine if a file at a given path exists.
 * @param {string} path Path of file to check if exists.
 * @return {boolean} true if file exists, false if not.
 */
function fileExists(path: string) {
  return fs.existsSync(path);
}

/**
 * Utility function to move a file.
 * @param {string} oldPath Old path of file to be moved.
 * @param {string} newPath Updated path of file.
 * @param {string} removeOld Toggle whether to delete old file (complete move),
 * or keep the old copy (copy move).
 */
function moveFile(oldPath: string, newPath: string, removeOld: boolean) {
  fs.copyFile(oldPath, newPath, (e: any) => {
    if (e) {
      console.log(error(`Error moving file '${oldPath}'.`));
      console.log(error(e));
    }
  });

  if (removeOld) {
    deleteFile(oldPath);
  }

  console.log(success(`Moved file '${oldPath}' to '${newPath}'.`));
}

/**
 * Utility function to delete files.
 * @param {string} path Path of file to delete.
 */
function deleteFile(path: string) {
  fs.unlink(path, (e:any) => {
    if (e) {
      console.log(error(`Error deleting file '${path}'.`));
      console.log(error(e));
    }
  });
}

/**
 * Utility function to download a file located online.
 * @param {string} onlinePath Location of the online file.
 * @param {string} localPath Download target of the file.
 * @param {string} callback Callback function to execute.
 */
function downloadFile(onlinePath: string, localPath: string, callback: any) {
  const file = fs.createWriteStream(`${localPath}`);

  // Send GET request
  const sentRequest = request.get(onlinePath);
  console.log(info(`Downloading '${onlinePath}' to '${localPath}'...`));
  sentRequest.on('response', (response: any) => {
    if (response.statusCode !== 200) {
      console.log(error(`Could not download ${onlinePath}, ` +
      `received status code ${response.statusCode}!`));
    } else {
      // Pipe received response into file
      sentRequest.pipe(file);
      console.log(success(`Successfully downloaded '${onlinePath}' ` +
      `=> '${localPath}'.`));
    }
  }).on('error', (e: any) => {
    deleteFile(localPath);
    console.log(error(`Request error when downloading '${onlinePath}'.`));
    console.log(error(e));
  });

  // Create file
  file.on('finish', () => {
    file.close();
    callback();
  }).on('error', (e: any) => {
    deleteFile(localPath);
    console.log(error(`Request error when creating file '${localPath}'.`));
    console.log(error(e));
  });
}

/**
 * Checks that the directory that psygo was called in is a valid psygo
 * directory if the command requires it.
 * @param {string} command Command that was invoked.
 * @return {boolean}
 */
function validInvokation(command: string) {
  const commands = ['start', 'export'];
  if (commands.includes(command)) {
    // Check for configuration file
    return fileExists(CONFIGURATION_LOCATION);
  }
  return true;
}

module.exports = {
  CONFIGURATION_LOCATION,
  success,
  info,
  warning,
  error,
  createDirectory,
  directoryExists,
  createFile,
  fileExists,
  moveFile,
  deleteFile,
  downloadFile,
  validInvokation,
};
