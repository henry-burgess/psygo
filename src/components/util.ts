const chalk = require('chalk');
const fs = require('fs');
const http = require('http');

// Chalk formatting
const success = chalk.keyword('green');
const info = chalk.keyword('blue');
const warning = chalk.keyword('yellow');
const error = chalk.bold.red;

// File management
/**
 * Create a new directory in the current working directory.
 * @param name The name of the new directory.
 */
function create_directory(name: string) {
    let dir = `./${name}`;
    if (!fs.existsSync(dir)) {
        try {
            fs.mkdirSync(dir);
            console.log(success(`Created directory '${name}'.`));
        } catch (e) {
            console.log(error(`Error creating directory '${name}'.`));
            console.log(error(e));
        }
        
    } else {
        console.log(warning(`Directory '${name}' already exists!`));
    }
}

/**
 * Utility function to determine if a path currently exists.
 * @param path Path to check if exists.
 */
function directory_exists(path: string) {
    return fs.existsSync(path);
}

/**
 * Utility function to create a new file at a specified path with defined contents.
 * @param path The path to the file, including the filename.
 * @param contents The contents to be written to the file.
 */
function create_file(path: string, contents: string) {
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
 * @param path Path of file to check if exists.
 */
function file_exists(path: string) {
    return fs.existsSync(path);
}

/**
 * Utility function to move a file.
 * @param old_path Old path of file to be moved.
 * @param new_path Updated path of file.
 * @param delete_old Toggle whether to delete old file (complete move), or keep the old copy (copy move).
 */
function move_file(old_path: string, new_path: string, delete_old: boolean) {
    fs.copyFile(old_path, new_path, (e: any) => {
        if (e) {
            console.log(error(`Error moving file '${old_path}'.`));
            console.log(error(e));
        }
    });

    if (delete_old === true) {
        delete_file(old_path);
    }

    console.log(success(`Moved file '${old_path}' to '${new_path}'.`))
}

/**
 * Utility function to delete files.
 * @param path Path of file to delete.
 */
function delete_file(path: string) {
    fs.unlink(path, (e:any) => {
        if (e) {
            console.log(error(`Error deleting file '${path}'.`));
            console.log(error(e));
        }
    });
}

/**
 * Utility function to download a file located online.
 * @param online_path Location of the online file.
 * @param local_path Download target of the file.
 */
function download_file(online_path: string, local_path: string) {
    let file = fs.createWriteStream(`${local_path}`);
    let request = http.get(`${online_path}`, function(stream: any) {
        stream.pipe(file);
        file.on("finish", function() {
            file.close();
        })
    }).on("error", function(e: any) {
        console.log(error(`Error downloading file '${online_path}'.`));
        console.log(error(e));
        delete_file(local_path);
    });
}

/**
 * Checks that the directory that psygo was called in is a valid psygo directory if the command requires it.
 * @param command Command that was invoked.
 */
function valid_invokation(command: string) {
    let commands = ["local", "deploy"];
    if (commands.includes(command)) {
        return file_exists(`./psygo.config.js`);
    }
    return true;
}

module.exports = {
    success,
    info,
    warning,
    error,
    create_directory,
    directory_exists,
    create_file,
    file_exists,
    move_file,
    delete_file,
    download_file,
    valid_invokation,
}