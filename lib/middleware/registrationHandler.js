"use strict";

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const shell = require('shelljs');

class RegistrationHandler {

    constructor() {
        console.log('RegistrationMiddleware initialized');
    }

    register = (req, res) => {
        // do registration
        shell.exec('./tools/create_User.sh ' + req.body.username + ' ' + req.body.password + ' ' + req.body.name + ' ' + req.body.surname, function(code, stdout, stderr) {
            console.log('Exit code:', code);
            console.log('Program output:', stdout);
            console.log('Program stderr:', stderr);
        });
    };

    createEmail = async (username, password, name, surname) => {

    };
}

module.exports = RegistrationHandler;