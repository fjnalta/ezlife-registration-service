"use strict";

const util = require('util');
const exec = util.promisify(require('child_process').exec);

class RegistrationHandler {

    constructor() {
        console.log('RegistrationMiddleware initialized');
    }

    register = async (req, res) => {
        console.log(req.body.username);
        console.log(req.body.password);
        console.log(req.body.name);
        console.log(req.body.surname);


        // do registration
        await this.createEmail(req.body.username, req.body.password);
        await this.enrichLDAP(req.body.name, req.body.surname);

    };

    createEmail = async (username, password) => {
        try {
            const { stdout, stderr } = await exec('../tools/create_User.sh ' + username + ' ' + password);
            console.log('stdout:', stdout);
            console.log('stderr:', stderr);
        } catch (err) {
            console.error(err);
        }
    };

    enrichLDAP = async (name, surname) => {
        console.log('enrich LDAP');
    };
}

module.exports = RegistrationHandler;