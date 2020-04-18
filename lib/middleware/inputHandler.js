"use strict";

class InputHandler {

    constructor() {
        console.log('InputMiddleware initialized');
    }

    handleRegistrationInput = (req, res, next) => {

        console.log(req.body.password);
        console.log(req.body.password2);
        console.log(req.body.name);
        console.log(req.body.surname);
        console.log(req.body.email);
        //let checkUser = /^[a-zA-Z0-9]+$/.test(req.body.username);
        //let checkUserLength = (req.body.username).length > 3;
        //let checkMail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        next();
    };
}

module.exports = InputHandler;