"use strict"
require('source-map-support').install(); //solo debe usarse para debugging
require('continuation-local-storage'); //hay que importarlo muy rapido para que no tire warnings


global.__main__ = module
var express = require('express');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var redisStore = require('connect-redis')(session);
var redis = require("redis");
var redisClient = redis.createClient()

var routes = require('./routes/index');
var users = require('./routes/users');

var oo = require('openorange');
var clientRuntime = require('./runtime');

var Promise = require("bluebird")

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(cookieParser());

app.use(session({
    secret: 'oojs secret awxsdecf',
    // create new redis store.
    store: new redisStore({host: 'localhost', port: 6379, client: redisClient, ttl: 260}),
    saveUninitialized: true,
    resave: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//app.use(require('node-compass')({mode: 'expanded'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));
app.use('/openorange/lib/client', express.static(path.join(__dirname, 'node_modules/openorange/lib/client')));
app.use('/openorange/lib/both', express.static(path.join(__dirname, 'node_modules/openorange/lib/both')));


app.use('/', routes);

app.use('/runtime', oo.contextmanager.expressMiddleware()); //aca manejan usuario actual, conexion actual, etc. para ser usadas con toda la app. Son variables definidas por request/cookie
app.use('/runtime', clientRuntime);
app.use('/users', users);
//app.use('/db', db);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (false && app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.serve = function (port) {
    if (port ==null) port = 4000;
    app.listen(port);
    console.log("Application Listening")
}

app.module = module
module.exports = app;
//redisClient.quit()
