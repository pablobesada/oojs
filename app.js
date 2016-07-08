"use strict"
require('source-map-support').install(); //solo debe usarse para debugging
require('continuation-local-storage'); //hay que importarlo muy rapido para que no tire warnings

let args = require("minimist")(process.argv.slice(2))
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
var Promise = require("bluebird")
//var routes = require('./routesXX/index');
var app = express();
var server = require('http').Server(app);
let settings = require(path.resolve(args.settingsfile || './oo.json'))
var oo = require('openorange')
oo.init()

let ui = require("openorange/ui")


// view engine setup
//app.set('views', path.join(__dirname, 'node_modules/openorange/ui/html'));
app.set('view engine', 'pug');
//app.use('/app/', express.static(path.join(__dirname, 'node_modules/openorange/ui/')));
//app.use('/openorange/ui/css/', express.static(path.join(__dirname, 'node_modules/openorange/lib/client/ui/css/')));
//app.use('/openorange/ui/font/', express.static(path.join(__dirname, 'node_modules/openorange/lib/client/ui/font/')));
//app.use('/openorange/ui/iconfont/', express.static(path.join(__dirname, 'node_modules/openorange/lib/client/ui/iconfont/')));
//app.use('/openorange/ui/images/', express.static(path.join(__dirname, 'node_modules/openorange/lib/client/ui/images/')));

//app.set('views', path.join(__dirname, 'views'));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

let sessionMiddleware = session({
    secret: 'oojs secret awxsdecf',
    // create new redis store.
    store: new redisStore({host: 'localhost', port: 6379, client: redisClient, ttl: 260}),
    saveUninitialized: true,
    resave: false
})

app.use(sessionMiddleware);




//app.use(require('node-compass')({mode: 'expanded'}));
//app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));
//app.use('/openorange/lib/client', express.static(path.join(__dirname, 'node_modules/openorange/lib/client')));
//app.use('/openorange/lib/both', express.static(path.join(__dirname, 'node_modules/openorange/lib/both')));

//app.use('/Users/pablo/WebstormProjects/oojs/base', express.static('/Users/pablo/WebstormProjects/oojs/base'));

let OpenOrangeBaseURL = '/oo/api';

let sio = require("socket.io")(server, {path: OpenOrangeBaseURL + '/socket.io'});
oo.setSocketIO(sio);
sio.use(function(socket, next) { //aca conecto socket.io con las session para poder acceder a la session desde el onConnect de socket
    sessionMiddleware(socket.request, socket.request.res, next)
});
sio.use(oo.contextmanager.socketIOMiddleware()) //aca contecto socketIO con los contextos para el event 'connect'

app.use(OpenOrangeBaseURL, oo.getRouter());



app.use('/oo/ui', ui({OpenOrangeBaseURL: OpenOrangeBaseURL}));
app.get("/", function (req, res, next) {
    res.redirect('oo/ui')
})


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
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            status: err.status,
            stack: err.stack,
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        status: err.status,
        stack: err.stack,
    });
});

app.serve = function () {
    let port = args.port || settings.port;
    server.listen(port);
    app.port = port;
    console.log("Application Listening on port " + port)
}

app.module = module
module.exports = app;
//redisClient.quit()
