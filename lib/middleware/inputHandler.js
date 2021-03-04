"use strict";

class InputHandler {

    constructor() {
        console.log('InputMiddleware initialized');
    }

    handleRegistrationInput = (req, res, next) => {
        // TODO - implement regex for all input fields
        //let checkUser = /^[a-zA-Z0-9]+$/.test(req.body.username);
        let checkUsername = (req.body.username).length > 0;
        let checkName = (req.body.name).length >= 3;
        let checkSurname = (req.body.surname).length >= 3;
        let checkPassword = (req.body.password).length >= 5;
        let checkMail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email);

        if(checkUsername && checkName && checkSurname && checkPassword && checkMail) {
            if(req.body.password == req.body.password2) {
                next();
            } else {
                console.log("Passwords don't match!");
                res.sendStatus(500);
            }

        } else {
            console.log("Basic checks not passed");
            res.sendStatus(500);
        }
    };

    handlePasswordInput = (req, res, next) => {
        // Check passwords match
        let newPassword = req.body.newPassword;
        let newPassword2 = req.body.newPassword2;

        if(newPassword != newPassword2) {
            res.sendStatus(500);
        }

        // Check password policy
        let checkNewPassword = (req.body.newPassword).length >= 5;
        if(checkNewPassword) {
            next();
        } else {
            res.sendStatus(500);
        }
    };
}

module.exports = InputHandler;