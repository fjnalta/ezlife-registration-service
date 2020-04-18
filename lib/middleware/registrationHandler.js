"use strict";

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const shell = require('shelljs');

class RegistrationHandler {

    constructor() {
        console.log('RegistrationMiddleware initialized');
    }

    register = async (req, res) => {
        // do registration
        await this.createEmail(req.body.username, req.body.password, req.body.name, req.body.surname);
    };

    createEmail = async (username, password, name, surname) => {
        shell.exec('./tools/create_User.sh ' + username + ' ' + password + ' ' + name + ' ' + surname);
    };
}

module.exports = RegistrationHandler;