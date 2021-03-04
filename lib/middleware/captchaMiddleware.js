"use strict";

const config = require('../config');
const request = require('request');

class CaptchaMiddleware {

    constructor() {
        console.log('CaptchaMiddleware initialized');
    }

    // authentication middleware
    verifyToken = (req, res, next) => {
        let response = res;
        let token = req.body.token;
        if (req.body.token && config.reCaptchaSiteKey) {
            request.post('https://www.google.com/recaptcha/api/siteverify', {
                form: {
                    secret : config.reCaptchaSiteKey,
                    response : token
                }
            }, (error, res, body) => {
                if (error) {
                    // calling google api failed
                    response.sendStatus(500);
                    console.log('failed');
                }
                let tokenResponse = JSON.parse(body);
                if (tokenResponse.success) {
                    next();
                }
            });
        } else {
            // token or reCaptcha token not provided
            res.sendStatus(500);
        }
    };
}

module.exports = CaptchaMiddleware;