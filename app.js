const express = require('express');
const session = require('express-session');
const memoryStore = new session.MemoryStore();

const config = require('./lib/config.json');
const Keycloak = require('keycloak-connect');

const keycloak = new Keycloak({store: memoryStore}, config.keycloak);

const bodyParser = require('body-parser');
const path = require('path');

const app = express();

const RegistrationHandler = require('./lib/middleware/registrationHandler');
const InputHandler = require('./lib/middleware/inputHandler');
const CaptchaHandler = require('./lib/middleware/captchaMiddleware');

// Initialize Middleware
const registrationHandler = new RegistrationHandler();
const inputHandler = new InputHandler();
const captchaHandler = new CaptchaHandler();

// use EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// reverse proxy configuration
app.set('trust proxy', '127.0.0.1');

// configure webserver
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
    secret: 'adfiSHDFuhas7',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));

app.use(keycloak.middleware());

// set static paths
app.use(express.static(path.join(__dirname, config.webContentDir)));
app.use('/node_modules', express.static('node_modules'));

// set public router
app.get('/', keycloak.protect(), (req, res) => {
    //console.log(req.kauth.grant.access_token.content);
    res.render('index', {
        token : req.kauth.grant.access_token.content
    });
});

app.get('/register', keycloak.checkSso(), registrationHandler.checkLogin);
app.post('/register', inputHandler.handleRegistrationInput, captchaHandler.verifyToken, registrationHandler.register);

// start server
app.listen(config.port, function () {
    console.log('Server started at Port ' + config.port);
});