"use strict";

const express      = require('express');
const app          = express();
const nunjucks     = require('nunjucks');
const bodyParser   = require('body-parser');
const mongoose     = require('mongoose');
const cookieParser = require('cookie-parser');
const passport     = require('passport');
const { Strategy } = require('passport-jwt');
const config       = require('./config');
const jwt          = config.jwt;

passport.use(new Strategy(jwt, function(jwt_payload, done) {
    if(jwt_payload != void(0)) return done(false, jwt_payload);
    done();
}));

mongoose.connect(config.connectionUrl, {useMongoClient: true});
mongoose.Promise = require('bluebird');
//mongoose.set('debug', true);

nunjucks.configure('./client/views', { autoescape: true, express: app} );

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(require('express-session')({resave: false, saveUninitialized: false, secret: config.secret}));
require('./router')(app);

app.use('/assets', express.static('./client/public'));
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'),() => {
    console.log('Server started on port '+app.get('port'));
});