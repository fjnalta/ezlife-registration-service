const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const config = require('./lib/config.json');
const app = express();

// use EJS as view engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'));

// configure webserver
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set static paths
app.use(express.static(path.join(__dirname, config.webContentDir)));
app.use('/node_modules', express.static('node_modules'));

// set public router
app.get('/', function (req, res) {
    res.render('index');
});

// start server
app.listen(config.port,function () {
    console.log('Server started at Port ' + config.port);
});