# ezlife-registration-service

Sample implementation of `keycloak-connect` `nodejs` module. 

Seamless user integration of keycloak IdM with a node.js application. 
The registration-service also provides a custom script for LDAP user creation via shell script.

## Installation

You need `nodejs` to run the application.

Install required modules via `npm install --save`.

Execute `node app.js` to start the application.

### Node Modules

* `bootstrap`
* `tether`
* `popper.js`
* `jquery`
* `ejs`
* `express`
* `express-session`
* `keycloak-connect`
* `shelljs`

## Documentation

### Keycloak integration

In order to connect the service to Keycloak, a new realm needs to be setup. Please refer to the Keycloak [documentation](https://www.keycloak.org/docs/latest/) 
on how to create a new realm. The keycloak configuration for the registration app has to be done in `config.json`.

### LDAP integration

The LDAP integration is done via the scripts located in `./lib/tools` directory.
The LDAP integration borrows heavily from iRedMail [sources](https://github.com/iredmail/iRedMail/tree/master/tools) and maintains a LDAP structure
which is suitable for iRedMail.

In order to use the LDAP integration, the scripts need to be adjusted to match your user directory.

### Security

#### Google ReCaptcha

This site uses google reCaptcha v3 for user verification. The request will be executed each time a registration request has been sent.
The reCaptcha API Key as well as the site key needs to be define in front- and backend. The following files need to be touched:

* `config.json`
* `captchaMiddleware.js`
* `register.ejs`

### Password Policy

* Username: >= 3 & regex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))$/
* Name: >= 1
* Surname: >= 1
* Password: >=5 
* Email regex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

The password policy can be adjusted for front- and backend.

* Fontend: `./public/js/checkInput.js`
* Backend: `./lib/middleware/inputHandler.js`

## References

* [keycloak documentation](https://www.keycloak.org/docs/latest/securing_apps/#_nodejs_adapter)
* [keycloak-connect](https://github.com/keycloak/keycloak-nodejs-connect) nodejs module
* [iRedMail](https://github.com/iredmail/iRedMail)

## License

* [GNU GENERAL PUBLIC LICENSE](https://gitlab.ezlife.eu/fjnalta/ezlife-registration-service/-/blob/master/LICENSE)