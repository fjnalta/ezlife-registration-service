"use strict";

const shell = require('shelljs');

class RegistrationHandler {

    constructor() {
        console.log('RegistrationMiddleware initialized');
    }

    register = (req, res) => {
        // do registration
        shell.exec('./lib/tools/create_mail_user_OpenLDAP.sh ' +
            req.body.username + ' ' +
            req.body.password + ' ' +
            req.body.name + ' ' +
            req.body.surname,
            function (code, stdout, stderr) {
                if (code = 0) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(500);
                }
            });
    };
}

module.exports = RegistrationHandler;