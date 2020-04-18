"use strict";

const shell = require('shelljs');

class RegistrationHandler {

    constructor() {
        console.log('RegistrationMiddleware initialized');
    }

    register = (req, res) => {
        // do registration
        shell.exec('./lib/tools/create_User.sh ' + req.body.username + ' ' + req.body.password + ' ' + req.body.name + ' ' + req.body.surname, function(code, stdout, stderr) {
            console.log('Exit code:', code);
            console.log('Program output:', stdout);
            console.log('Program stderr:', stderr);
        });
        res.redirect('https://ezlife.eu');
    };
}

module.exports = RegistrationHandler;