"use strict";

const shell = require('shelljs');
const config = require('../config');

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
                let tmp = code;
                if (tmp === 0) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(500);
                }
            });
    };

    checkLogin = (req, res) => {
        if(this.isEmpty(req.kauth)) {
            res.render('register', {
                about : config.about
            });
        } else {
            res.redirect('/');
        }
    };

    isEmpty = (obj) => {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    };

    changePassword = (req, res) => {
        // TODO - implementation
    };

    deleteAccount = (req, res) => {
        // TODO - implementation
    };
}

module.exports = RegistrationHandler;