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
        shell.exec('./lib/tools/change_user_password_OpenLDAP.sh ' +
            req.body.username + ' ' +
            req.body.password + ' ' +
            req.body.newPassword,
            function (code, stdout, stderr) {
                let tmp = code;
                if (tmp === 0) {
                    res.redirect('/');
                } else {
                    res.sendStatus(500);
                }
            });
    };

    deleteAccount = (req, res) => {
        shell.exec('./lib/tools/delete_user_OpenLDAP.sh ' +
            req.body.username,
            function (code, stdout, stderr) {
                let tmp = code;
                if (tmp === 0) {
                    res.redirect('/');
                    // TODO - logout keycloak session
                } else {
                    res.sendStatus(500);
                }
        });
    };
}

module.exports = RegistrationHandler;